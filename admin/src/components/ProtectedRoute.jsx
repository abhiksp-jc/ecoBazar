import { Navigate } from "react-router-dom";
import {
  getToken,
  getAdmin
} from "../services/authService";

const ProtectedRoute = ({
  children
}) => {
  const token = getToken();
  const admin = getAdmin();

  if (!token || !admin) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;