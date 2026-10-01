import { Navigate, useLocation } from "react-router-dom";
import { getAdmin } from "../services/authService";
import { hasPermission } from "../config/permissions";

const PermissionRoute = ({ module, action = "read", children }) => {
  const user = getAdmin();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasPermission(user, module, action)) {
    return children;
  }

  return (
    <Navigate
      to="/dashboard"
      replace
      state={{ denied: true, from: location.pathname }}
    />
  );
};

export default PermissionRoute;
