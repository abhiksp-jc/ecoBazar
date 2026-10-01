require("dotenv").config();
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const Admin = require("../models/admin");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = (
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "abhikashyap252525@gmail.com"
    ).trim().toLowerCase();

    const plainPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const name = process.env.ADMIN_NAME || "Admin";
    const phone = process.env.ADMIN_PHONE || "+919541126687";

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "ADMIN";
      admin.status = "ACTIVE";
      admin.name = name;
      admin.phone = phone;
      await admin.save();
      console.log(`✅ Admin account updated for: ${email}`);
    } else {
      admin = await Admin.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "ADMIN",
        permissions: [],
        status: "ACTIVE"
      });
      console.log(`✅ Admin account created for: ${email}`);
    }


    console.log(`Admin Login Credentials:`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);


    process.exit(0);
  } catch (error) {
    console.error("Seeding admin failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
