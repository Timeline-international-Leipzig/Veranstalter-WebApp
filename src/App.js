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
import InsideEvent from "./Event/InsideEvent/InsideEvent";
import ContactPage from "./Contact/ContactPage";
import ExtraFunctions from "./Contact/ExtraFunctions";

const firebaseConfig = {
  apiKey: "AIzaSyC3OHufvBBCg1m1r7lpOLT3205yCGxj3tM",
  authDomain: "groupic-release.firebaseapp.com",
  projectId: "groupic-release",
  storageBucket: "groupic-release.appspot.com",
  messagingSenderId: "52061265488",
  appId: "1:52061265488:web:3cb59c79c12de025edfb55",
  measurementId: "G-VDWVVFD24J",
}

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

        <Route
          exact path={pathnames.CONTACT}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <ContactPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact path={pathnames.EXTRAFUNCTIONS}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <ExtraFunctions />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path="/event/:eventId"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              isVerified={isVerified}
            >
              <InsideEvent />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
