// src/utils/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const PrivateRoute = ({ children }) => {
  const { authStatus } = useContext(AuthContext);

  if (authStatus !== "ok") {
    return <Navigate to="/login" replace />;
  }
  return children;
};
