const PERMISSIONS = {
  products: ["read", "create", "edit", "delete"],
  categories: ["read", "create", "edit", "delete"],
  orders: ["read", "create", "edit", "delete"],
  customers: ["read", "create", "edit", "delete"],
  contentManagement: ["read", "create", "edit", "delete"],
  faqs: ["read", "create", "edit", "delete"]
};

const ALL_PERMISSIONS = Object.entries(PERMISSIONS).flatMap(([module, actions]) =>
  actions.map((action) => `${module}.${action}`)
);

const normalizePermissions = (permissions = []) => {
  if (!Array.isArray(permissions)) return [];

  const result = [];

  for (const perm of permissions) {
    if (!ALL_PERMISSIONS.includes(perm)) continue;

    if (!result.includes(perm)) {
      result.push(perm);
    }

    const [module, action] = perm.split(".");
    const readPermission = `${module}.read`;
    if (action !== "read" && !result.includes(readPermission)) {
      result.push(readPermission);
    }
  }

  return result;
};

module.exports = {
  PERMISSIONS,
  ALL_PERMISSIONS,
  normalizePermissions
};
