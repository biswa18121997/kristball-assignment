import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../state/UserContext";

const ProtectedRoute = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate('/login');

  // Not logged in
  if (!userCtx || !userCtx.token) {
    navigate('/login');
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
