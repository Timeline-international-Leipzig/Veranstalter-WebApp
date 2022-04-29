import React, { useState } from "react";
import LogoSmall from "../IconComponents/LogoSmall";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import pathnames from "../Util/pathnames";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");

  function sendLink(e) {
    e.preventDefault();
    if (email !== email2) {
      window.alert(
        "Deine E-Mail und die Bestätigung deiner E-Mail stimmen nicht überein!"
      );
      return;
    } else {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          window.alert("checke deine E-Mails");
        })

        .catch((error) => {
          var errorMessage = error.message;

          window.alert(errorMessage);
          return;
        });
    }
  }

  return (
    <div className="form-bg">
      <Link to="/groupic.de">
        <div className="formGroupic">
          <span className="logoSpan">
            <LogoSmall width="2em" fill="#024761" />
          </span>
          <span className="nameSpan">
            <header className="formText">roupic</header>
          </span>
        </div>
      </Link>
      <div className="forgotContainer">
        <h3 className="pwText1">passwort vergessen ? </h3>
        <h4 className="pwText2">
          kein Problem, du erhälst einen Link zur Wiederherstellung.
        </h4>
        <form action="#" onSubmit={(e) => sendLink(e)}>
          <div>
            <input
              type="email"
              className="forgotInput"
              placeholder="deine email"
              onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
              required
            ></input>
          </div>
          <div>
            <input
              type="email"
              className="forgotInput"
              placeholder="email wiederholen"
              onChange={(e) => setEmail2(e.target.value.toLocaleLowerCase())}
              required
            ></input>
          </div>
          <div className="forgotBtns">
            <button id="cta-btn">link senden.</button>
            <Link id="gray" className="backToAn" to={pathnames.LOGIN}>
              zurück zur Anmedlung
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
