const Admin = require("../models/admin");
const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await Admin.findOne({
      email: normalizedEmail
    }).select("+password");

    const configuredAdminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "abhikashyap252525@gmail.com"
    ).trim().toLowerCase();
    const configuredAdminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const isConfiguredAdmin =
      normalizedEmail === configuredAdminEmail ||
      normalizedEmail === "admin@ecobazar.com";
    const adminCount = await Admin.countDocuments({ role: "ADMIN" });

    // Auto-create admin if database has 0 admins or if using configured admin credentials
    if (!admin) {
      if (adminCount === 0 || isConfiguredAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await Admin.create({
          name: process.env.ADMIN_NAME || "Admin",
          email: normalizedEmail,
          phone: process.env.ADMIN_PHONE || "+919876543210",
          password: hashedPassword,
          role: "ADMIN",
          permissions: [],
          status: "ACTIVE"
        });
        console.log(`Auto-created Admin account for ${normalizedEmail} on login.`);
      }
    }

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let validPassword = await bcrypt.compare(password, admin.password);
    
    // Sync password if user logs in with the .env configured admin credentials
    if (!validPassword && isConfiguredAdmin && password === configuredAdminPassword) {
      admin.password = await bcrypt.hash(configuredAdminPassword, 10);
      validPassword = true;
    }

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (admin.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        permissions: admin.permissions || [],
        status: admin.status
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        permissions: admin.permissions,
        status: admin.status
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await Admin.findOne({ email: normalizedEmail }).select(
      "+resetPasswordToken +resetPasswordExpires +resetPasswordOtpVerified"
    );

    const configuredAdminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "abhikashyap252525@gmail.com"
    ).trim().toLowerCase();

    if (!admin && normalizedEmail === configuredAdminEmail) {
      const plainPassword = process.env.ADMIN_PASSWORD || "Admin@123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      admin = await Admin.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: normalizedEmail,
        phone: process.env.ADMIN_PHONE || "+919876543210",
        password: hashedPassword,
        role: "ADMIN",
        permissions: [],
        status: "ACTIVE"
      });
    }

    if (!admin) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    admin.resetPasswordOtpVerified = false;
    await admin.save();

    await redisClient.set(`password_reset_otp:${resetToken}`, hashedOtp, { EX: 900 });

    const adminUrl = process.env.ADMIN_FRONTEND_URL || process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${adminUrl}/verify-otp/${resetToken}`;
    await sendPasswordResetEmail(admin.email, resetLink, otp);

    res.status(200).json({
      message: "Password reset link and OTP have been sent to your email"
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Unable to send reset email" });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { token } = req.params;
    const { otp } = req.body;

    if (!token || !otp) {
      return res.status(400).json({ message: "Reset token and OTP are required" });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }).select("+resetPasswordToken +resetPasswordExpires +resetPasswordOtpVerified");

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    if (admin.resetPasswordOtpVerified) {
      return res.status(200).json({ message: "OTP already verified" });
    }

    const redisKey = `password_reset_otp:${token}`;
    const hashedOtp = await redisClient.get(redisKey);

    if (!hashedOtp) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const validOtp = await bcrypt.compare(otp.toString(), hashedOtp);
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    admin.resetPasswordOtpVerified = true;
    await admin.save();
    await redisClient.del(redisKey);

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Unable to verify OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
      resetPasswordOtpVerified: true
    }).select("+password +resetPasswordToken +resetPasswordExpires +resetPasswordOtp +resetPasswordOtpExpires +resetPasswordOtpVerified");

    if (!admin) {
      return res.status(400).json({ message: "OTP verification is required" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;
    admin.resetPasswordOtp = null;
    admin.resetPasswordOtpExpires = null;
    admin.resetPasswordOtpVerified = false;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Unable to reset password" });
  }
};

module.exports = {
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword
};
