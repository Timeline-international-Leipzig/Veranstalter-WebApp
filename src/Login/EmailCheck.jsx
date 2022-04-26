import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import pathnames from "../Util/pathnames";

function EmailCheck(props) {
  const emailIsVerified = props.emailIsVerified;

  async function checkEmailVerification() {
    await firebase.auth().currentUser.reload();

    const uid = firebase.auth().currentUser.uid;
    //await emailIsVerified();

    const isVerified = firebase.auth().currentUser.emailVerified;
    if (isVerified) {
      emailIsVerified(uid);
    } else {
      window.alert("bitte überprüfe deine Emails!");
    }
  }

  function sendEmailAgain() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        alert("Bestätigungsemail wurde erneut gesendet! ");
      })
      .catch((error) => {
        var errorMessage = error.message;

        window.alert(errorMessage);
        return;
      });
  }

  return (
    <div>
      <p>Bitte überprüfe deine Emails</p>
      <div onClick={checkEmailVerification}>weiter.</div>
      <div onClick={() => (window.location.href = pathnames.REGISTER)}>
        zurück zur Registrierung
      </div>
      <div onClick={sendEmailAgain}>Email erneut senden</div>
    </div>
  );
}
export default EmailCheck;
