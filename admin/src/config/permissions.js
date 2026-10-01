export const PERMISSIONS = {
  products: ["read", "create", "edit", "delete"],
  categories: ["read", "create", "edit", "delete"],
  orders: ["read", "create", "edit", "delete"],
  customers: ["read", "create", "edit", "delete"],
  contentManagement: ["read", "create", "edit", "delete"],
  faqs: ["read", "create", "edit", "delete"]
};

export const ALL_READ_PERMISSIONS = Object.keys(PERMISSIONS).map(
  (module) => `${module}.read`
);

export const ALL_CREATE_PERMISSIONS = Object.keys(PERMISSIONS).map(
  (module) => `${module}.create`
);

export const ALL_EDIT_PERMISSIONS = Object.keys(PERMISSIONS).map(
  (module) => `${module}.edit`
);

export const ALL_DELETE_PERMISSIONS = Object.keys(PERMISSIONS).map(
  (module) => `${module}.delete`
);

export const hasPermission = (user, module, action = "read") => {
  if (!user) return false;
  if (!user.role || String(user.role).toUpperCase() === "ADMIN") return true;

  return Array.isArray(user.permissions) &&
    user.permissions.includes(`${module}.${action}`);
};

export const canSeeModule = (user, module) => {
  return hasPermission(user, module, "read");
};
