import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import pathnames from "./Util/pathnames";
import { isLogged } from "./Redux/actions";
import Register from "./Login/Register";
import Login from "./Login/Login";
import EmailCheck from "./Login/EmailCheck";
import ProfileSetup from "./Login/ProfileSetup";
import AGB from "./Util/Repitition/Footer/AGB";
import Impressum from "./Util/Repitition/Footer/Impressum";
import Datenschutz from "./Util/Repitition/Footer/Datenschutz";
import ForgotPassword from "./Login/ForgotPassword";
import Profile from "./Profile/Profile";
import EditProfile from "./Settings/EditProfile";
import CreateEvent from "./Event/CreateEvent";

const firebaseConfig = {
  apiKey: "AIzaSyDBff13eSabadw6JOmPPWKsfxu7okqx0I4",
  authDomain: "timeline-backup.firebaseapp.com",
  projectId: "timeline-backup",
  storageBucket: "timeline-backup.appspot.com",
  messagingSenderId: "467538146750",
  appId: "1:467538146750:web:63a671baa23a1fdb3f35ef",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

function App() {
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    function authListener() {
      firebase.auth().onAuthStateChanged(function onAuthStateChanged(user) {
        if (user) {
          dispatch(isLogged());
          setIsAuthenticated(true);
          setIsVerified(user.emailVerified);
        } else {
          setIsAuthenticated(false);
          setIsVerified(false);
        }
      });
    }
    authListener();
  }, []);

  function emailIsVerified() {
    setIsVerified(true);
    window.location.href = pathnames.PROFIL_SETUP;
  }

  return (
    <Router>
      {/*<div className="content">*/}
      <Routes>
        {/*Anmeldung */}
        <Route exact path="/" component={Register}></Route>

        <Route exact path={pathnames.AGB} element={<AGB />}></Route>
        <Route
          exact
          path={pathnames.DATENSCHUTZ}
          element={<Datenschutz />}
        ></Route>
        <Route exact path={pathnames.IMPRESSUM} element={<Impressum />}></Route>

        <Route exact path={pathnames.REGISTER} element={<Register />}></Route>
        <Route exact path={pathnames.LOGIN} element={<Login />}></Route>
        <Route
          exact
          path={pathnames.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        ></Route>

        <Route
          exact
          path={pathnames.EMAIL_CHECK}
          element={<EmailCheck emailIsVerified={emailIsVerified} />}
        ></Route>
        <Route
          exact
          path={pathnames.PROFIL_SETUP}
          element={<ProfileSetup />}
        ></Route>

        {/*In Anwendung */}
        <Route
          exact
          path={pathnames.PROFILE}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <Profile />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path={pathnames.EDIT_PROFILE}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <EditProfile />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path={pathnames.EVENT_CREATION}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <CreateEvent />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
      {/*</div>*/}
    </Router>
  );
}

export default App;
