import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Fb from "../Util/fbVariables";
import _ from "lodash";
import pathnames from "../Util/pathnames";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import LogoSmall from "../IconComponents/LogoSmall";
import { css } from "@emotion/react";

function Register() {
  const [username, setUsername] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  //aktiviert den Chiploader am Anfang der Funktion und deaktiviert ihn am ende
  const [loading, setLoading] = useState(false);
  const override = css`
    position: absolute;
    right: 9%;
  `;

  //Checkboxen für die AGBs
  const AGBcheckBoxRef = useRef();

  const register = "account bereits vorhanden? hier anmelden.";

  const [passwordShown, setPasswordShown] = useState(false);
  const [password2Shown, setPassword2Shown] = useState(false);

  useEffect(() => {
    async function fbBug() {
      await firebase.firestore().collection(Fb.ORGANIZERS).doc("bug").set({
        firestoreInit: "firestore init",
      });
    }
    fbBug();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      userCreation(e);
    }
  };

  //funktionalität für das verbergen oder zeigen des Pw
  const togglePasswordVisiblity = (e) => {
    e.preventDefault();
    setPasswordShown(passwordShown ? false : true);
  };
  const togglePassword2Visiblity = (e) => {
    e.preventDefault();
    setPassword2Shown(password2Shown ? false : true);
  };

  async function checkUsername(e) {
    e.preventDefault();
    const userCheck = await firebase
      .firestore()
      .collection(Fb.USERS)
      .where("username", "==", username)
      .get()
      .then((snapshot) => {
        const userArray = snapshot.docs.map((doc) => {
          return doc.data().username;
        });
        return userArray;
      });

    const organizerCheck = await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .where("username", "==", username)
      .get()
      .then((snapshot) => {
        const userArray = snapshot.docs.map((doc) => {
          return doc.data().username;
        });
        return userArray;
      });

    if (_.isEmpty(userCheck) && _.isEmpty(organizerCheck)) {
      userCreation();
    } else {
      window.alert(
        "Dieser Nutzername ist schon vergeben. Bitte versuche einen anderen."
      );
    }
  }

  async function userCreation() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (cred) => {
        await setUpUser(cred.user.uid);
      })
      .catch((error) => {
        var errorMessage = error.message;

        window.alert(errorMessage);
        return;
      });
  }

  async function setUpUser(uid) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .set({
        uid: uid,
        officialName: officialName,
        username: username,
        email: email,
        profileImageId: "",
        titleImageId: "",
        adress: adress,
        city: city,
        token: "",
        keyWords: "",
        // highLights: [],
        events: [],
        usedStorage: 0,
        availableStoarge: 2000000,
        //openActiveEvents: true,
      })
      .catch((error) => {
        var errorMessage = error.message;

        window.alert(errorMessage);
        return;
      });
    storeKeywords(username, uid);
  }

  function generateKeyword(string) {
    let result = [];

    for (var i = 0; i < string.length; i++) {
      for (var j = i + 1; j <= string.length; j++) {
        result.push(string.slice(i, j));
      }
    }

    return result;
  }

  async function storeKeywords(string, uid) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        keyWords: generateKeyword(string),
      })
      .catch((error) => {
        var errorMessage = error.message;

        window.alert(errorMessage);
        return;
      });
    deleteFbInit();
  }

  async function deleteFbInit() {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc("bug")
      .delete()
      .then(() => {
        emailVerification();
      });
  }

  async function emailVerification() {
    await firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        setLoading(!loading);
        window.location.href = pathnames.EMAIL_CHECK;
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
      <div className="registCol">
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
      </div>
      <div className="form-container">
        <form
          /*action="#"*/ id="contactForm"
          onSubmit={(e) => checkUsername(e)}
        >
          {/*Registrierung*/}

          <div>
            <div>
              <label htmlFor="name">rechtlicher firmenname.</label>
              <input
                maxLength="15"
                type="text"
                id="username"
                value={officialName}
                onChange={(e) => setOfficialName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="name">benutzername.</label>
              <input
                maxLength="15"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
              />
            </div>

            <div>
              <label htmlFor="name">straße + hausnr.</label>
              <input
                type="text"
                id="username"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="name">postleitzahl + stadt. </label>
              <input
                type="text"
                id="username"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

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

            <div>
              <label htmlFor="password">passwort.</label>
              <div className="pwLine">
                <input
                  type={passwordShown ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="m" onClick={togglePasswordVisiblity}>
                  <span className="mSpan">
                    {passwordShown ? "verbergen" : "anzeigen"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password">passwort bestätigen.</label>
              <div className="pwLine">
                <input
                  type={password2Shown ? "text" : "password"}
                  id="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  onKeyPress={(e) => handleKeyDown(e)}
                  required
                />
                <div className="m" onClick={togglePassword2Visiblity}>
                  <span className="mSpan">
                    {password2Shown ? "verbergen" : "anzeigen"}
                  </span>
                </div>
              </div>
            </div>

            <div className="checkboxen">
              <input
                id="checkAGB"
                className="checkbox"
                type="checkbox"
                ref={AGBcheckBoxRef}
                required
              ></input>

              <label className="checkboxLabel" htmlFor="checkAGB">
                <span>
                  ich habe die{" "}
                  <Link to={pathnames.AGB} target="_blank">
                    AGB{" "}
                  </Link>{" "}
                  gelesen und bin einverstanden
                </span>
              </label>
            </div>
          </div>
          <div className="ctaBtn">
            <button type="submit" id="cta-btn">
              <span className="registSpan">registrieren.</span>

              <ClipLoader
                className="clipLoad"
                color="skyblue"
                loading={loading}
                css={override}
                size={15}
              />
            </button>
          </div>
          {/**hier fehlen noch styles */}
          {/*<ClipLoader color="red" loading={loading} size={80} />*/}
          <div className="contSwitch">
            <Link id="gray" to={pathnames.LOGIN}>
              {register}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
