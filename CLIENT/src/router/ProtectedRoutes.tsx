import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context";

const ProtectedRoutes = () => {
  const { userData } = useAuthStore();

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
