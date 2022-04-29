import { Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import pathnames from "../Util/pathnames";

function PrivateRoute({ children, ...rest }) {
  //console.log(isVerified, isAuthenticated);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    function authListener() {
      firebase.auth().onAuthStateChanged(function onAuthStateChanged(user) {
        if (user) {
          setIsAuthenticated(true);
          setIsVerified(user.emailVerified);
          console.log(user.uid);
        } else {
          setIsAuthenticated(false);
          setIsVerified(false);
        }
      });
    }
    authListener();
  }, [isAuthenticated]);

  if (!isAuthenticated)
    return (
      <Navigate
        to={{
          pathname: pathnames.REGISTER,
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

  return <Route {...rest} render={() => children} />;
}
export default PrivateRoute;
