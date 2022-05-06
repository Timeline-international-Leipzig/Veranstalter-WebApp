import { Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import pathnames from "../Util/pathnames";

function PrivateRoute({ children, isAuthenticated, isVerified }) {
  if (isAuthenticated === null || isVerified === null) return null;

  if (!isAuthenticated)
    return (
      <Navigate
        to={{
          pathname: pathnames.LOGIN,
        }}
      />
    );

  if (isAuthenticated && !isVerified)
    return (
      <Navigate
        to={{
          pathname: pathnames.EMAIL_CHECK,
        }}
      />
    );

  return <>{children}</>;
}
export default PrivateRoute;
