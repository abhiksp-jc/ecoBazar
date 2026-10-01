const { normalizePermissions } = require("../config/permissions");

const permissionMiddleware = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (req.user.role === "ADMIN") {
      return next();
    }

    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const permissions = normalizePermissions(req.user.permissions);
    const permission = `${module}.${action}`;

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: `Permission denied: ${action} access to ${module}`
      });
    }

    next();
  };
};

module.exports = permissionMiddleware;
