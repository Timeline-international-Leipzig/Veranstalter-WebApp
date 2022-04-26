import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import pathnames from "./Util/pathnames";
import { isLogged } from "./Redux/actions";
//import firebase from "firebase";
import Register from "./Login/Register";

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
  return (
    <Router>
      {/*<div className="content">*/}
      <Routes>
        <Route path="/" component={Register}>
          {/*<Register />*/}
        </Route>
        <Route path={pathnames.REGISTER} element={<Register />}>
          {/*<Register />*/}
        </Route>
      </Routes>
      {/*</div>*/}
    </Router>
  );
}

export default App;
