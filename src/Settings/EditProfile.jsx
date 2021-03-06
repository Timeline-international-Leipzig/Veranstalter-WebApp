import React, { useState, useEffect } from "react";
import ProfileImage from "../Profile/Components/ProfileImage";
import SettingsNav from "./SettingsNav";
import firebase from "firebase/compat/app";
import { useSelector } from "react-redux";
import Fb from "../Util/fbVariables";
import _ from "lodash";

function EditProfile() {
  const uid = useSelector((state) => state.uidReducer);

  const [username, setUsername] = useState("");
  const [officialName, setOfficialName] = useState("");

  const [usernameUpdate, setUsernameUpdate] = useState("");
  const [officialNameUpdate, setOfficialNameUpdate] = useState("");

  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    if (!uid) return;
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .get()
      .then((snapshot) => {
        const username = snapshot.data().username;
        const officialName = snapshot.data().officialName;
        setUsername(username);
        setOfficialName(officialName);
        setUsernameUpdate(username);
        setOfficialNameUpdate(officialName);
      });
  }, [uid]);

  useEffect(() => {
    if (username === usernameUpdate && officialName === officialNameUpdate) {
      setShowEditButton(false);
    }
  }, [usernameUpdate, officialNameUpdate]);

  function updateConditions() {
    if (officialName !== officialNameUpdate && username === usernameUpdate)
      updateRealname();
    else checkUsername();
  }

  async function checkUsername() {
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

    const orgCheck = await firebase
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

    const usedNames = [...userCheck, ...orgCheck];

    if (_.isEmpty(usedNames)) {
      updateProfile();
    }
    if (!_.isEmpty(usedNames))
      window.alert(
        "Dieser Nutzername ist schon vergeben. Bitte versuche einen anderen."
      );
  }

  function updateProfile() {
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        username: usernameUpdate,
        fullName: officialNameUpdate,
        keyWords: generateKeyword(usernameUpdate),
      })
      .then(() => {
        setUsername(usernameUpdate);
        setUsername(officialNameUpdate);
        alert("Profilnamen ge??ndert");
        setShowEditButton(false);
      })
      .catch(() => {
        alert("Fehler bei der Eingabe der Nutzerdaten");
        return;
      });
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

  function updateRealname() {
    firebase
      .firestore()
      .collection(Fb.USERS)
      .doc(uid)
      .update({
        fullName: officialNameUpdate,
      })
      .then(() => {
        setOfficialName(officialNameUpdate);
        alert("Vollst??ndiger Name ge??ndert");
        setShowEditButton(false);
      })
      .catch(() => {
        alert("Fehler bei der Eingabe der Nutzerdaten");
        return;
      });
  }

  return (
    <div>
      <SettingsNav currentPR={true} />

      <div className="settingsMain">
        <div className="imgSettingSection">
          <ProfileImage toggleScreen={false} />
        </div>
        <div className="editProfileInput">
          <label htmlFor="realNameInput">
            <span className="settingsSpan">vollst??ndigen Namen ??ndern</span>
          </label>
          <input
            className="settingsInput"
            defaultValue={officialName}
            id="realNameInput"
            type="text"
            onChange={(e) => {
              setOfficialNameUpdate(e.target.value);
              setShowEditButton(true);
            }}
          />
        </div>
        <p className="realnameInfo">
          Anhand des Namens, unter dem man dich kennt, k??nnen andere Personen
          dein Konto leichter finden. Verwende deshalb deinen vollst??ndigen
          Namen oder Spitznamen.
        </p>

        <div className="editProfileInput">
          <label htmlFor="usernameInput">
            <span className="settingsSpan">Benutzernamen ??ndern</span>
          </label>
          <input
            className="settingsInput"
            defaultValue={username}
            id="usernameInput"
            type="text"
            onChange={(e) => {
              setUsernameUpdate(e.target.value.toLowerCase());
              setShowEditButton(true);
            }}
          />
        </div>
        <div>
          {showEditButton ? (
            <button className="updateProfile" onClick={updateConditions}>
              ??bernehmen
            </button>
          ) : (
            <div />
          )}
        </div>

        {/*<button className="updateProfile" onClick={updateProfile}>
          ??bernehmen
          </button>*/}
      </div>
    </div>
  );
}
export default EditProfile;
