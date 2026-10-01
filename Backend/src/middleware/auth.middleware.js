const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { normalizePermissions } = require("../config/permissions");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("role status permissions");
    if (!admin) {
      return res.status(401).json({ message: "User not found" });
    }

    if (admin.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    req.user = {
      id: admin._id,
      role: admin.role,
      status: admin.status,
      permissions: admin.role === "ADMIN" ? [] : normalizePermissions(admin.permissions)
    };

    if (typeof next === "function") {
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
