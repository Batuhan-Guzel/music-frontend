import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "./auth";
import React from "react";

type Props = {
  children: React.ReactNode;
  allow: string[];
};

export default function RoleRoute({ children, allow }: Props) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const role = getRole();
  if (!role || !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
