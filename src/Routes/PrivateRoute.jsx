import React, { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div>
        <span className="loading loading-bars loading-xs"></span>
        <span className="loading loading-bars loading-sm"></span>
        <span className="loading loading-bars loading-md"></span>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  if (user) {
    return React.Children.only(children);
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;