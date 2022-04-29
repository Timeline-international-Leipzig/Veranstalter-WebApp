import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import _ from "lodash";
import pathnames from "../Util/pathnames";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import LogoSmall from "../IconComponents/LogoSmall";
import { css } from "@emotion/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordShown, setPasswordShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const override = css`
    position: absolute;
    right: 13%;
  `;

  //funktionalität für das verbergen oder zeigen des Pw
  const togglePasswordVisiblity = (e) => {
    e.preventDefault();
    setPasswordShown(passwordShown ? false : true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      orgLogin(e);
    }
  };

  async function orgLogin(e) {
    e.preventDefault();
    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(firebase.auth().currentUser.uid);
        setLoading(false);
        window.location.href = pathnames.PROFILE;
      })
      .catch((error) => {
        setLoading(false);
        var errorMessage = error.message;

        window.alert(errorMessage);

        return;
      });
  }

  return (
    <div className="form-bg">
      <Link to="/groupic.de">
        <div className="formGroupic">
          <span className="logoSpan">
            <LogoSmall width="2em" />
          </span>
          <span className="nameSpan">
            <header className="formText">roupic</header>
          </span>
        </div>
      </Link>
      <div className="form-container">
        <form
          action="#"
          id="contactForm"
          onSubmit={(e) => {
            orgLogin(e);
          }}
        >
          <div>
            <div>
              <label htmlFor="email">email.</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>
            <div className="passwordField">
              <label htmlFor="password">passwort.</label>
              <div className="pwLine">
                <input
                  type={passwordShown ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyDown(e)}
                  required
                />
                <div className="m" onClick={togglePasswordVisiblity}>
                  <span className="mSpan">
                    {passwordShown ? "verbergen" : "anzeigen"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ctaBtn">
            <button type="submit" id="cta-btn">
              <span>anmelden.</span>
              <ClipLoader
                className="clipLoad"
                color="skyblue"
                loading={loading}
                css={override}
                size={15}
              />
            </button>
          </div>
          <div className="contSwitch">
            <Link to="/registrierung" id="gray">
              "kein account vorhanden? hier registrieren.",
            </Link>
          </div>

          <div className="forgot">
            <Link to="/Passwort-vergessen" id="gray">
              passwort vergessen?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
