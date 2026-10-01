const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

const ensureAdminExists = async () => {
  try {
    const adminCount = await Admin.countDocuments({ role: "ADMIN" });

    if (adminCount > 0) {
      return;
    }

    const email = (
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "admin@ecobazar.com"
    ).trim().toLowerCase();

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      let needsSave = false;
      if (existingUser.role !== "ADMIN") {
        existingUser.role = "ADMIN";
        existingUser.status = "ACTIVE";
        needsSave = true;
      }
      const targetName = process.env.ADMIN_NAME || "Abhi";
      if (existingUser.name !== targetName) {
        existingUser.name = targetName;
        needsSave = true;
      }
      if (needsSave) {
        await existingUser.save();
      }
      return;
    }

    const plainPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const name = process.env.ADMIN_NAME || "Abhi";
    const phone = process.env.ADMIN_PHONE || "+919876543210";

    await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "ADMIN",
      permissions: [],
      status: "ACTIVE"
    });

    console.log("==================================================");
    console.log("👑 Default Super Admin Account Created:");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${plainPassword}`);
    console.log("==================================================");
  } catch (error) {
    console.error("⚠️ Failed to ensure default admin account:", error.message);
  }
};

module.exports = ensureAdminExists;
