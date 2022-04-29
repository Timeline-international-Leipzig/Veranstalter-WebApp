import React from "react";
import Fb from "../../Util/fbVariables";
import firebase from "firebase/compat/app";
import { v4 as uuidv4 } from "uuid";

export async function storeProfileImg(result, uid) {
  const filename = uuidv4();

  if (result === 0) {
    window.alert("no images found!");
    return;
  } else {
    return await firebase
      .storage()
      .ref(Fb.PROFILEPICS)
      .child(filename)
      .put(result)
      .then(async function () {
        return firebase
          .storage()
          .ref(Fb.PROFILEPICS)
          .child(filename)
          .getDownloadURL()
          .then(async (url) => {
            await firebase
              .firestore()
              .collection(Fb.ORGANIZERS)
              .doc(uid)
              .update({
                profileImageId: url,
              });
            // setProfileImg(url);
            return url;
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}

export async function deleteProfileImg(uid) {
  const alert = window.confirm("bist du sicher?");

  if (alert) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        profileImageId: "",
      })
      .then(() => {
        //setProfileImg(DefaultPI);
      });
  }
}

export async function storeBackgroundImg(resultB, uid) {
  const filename = uuidv4();

  if (resultB === 0) {
    window.alert("no images found!");
    return;
  } else {
    await firebase
      .storage()
      .ref(Fb.TITLEPICS)
      .child(filename)
      .put(resultB)
      .then(async function () {
        await firebase
          .storage()
          .ref(Fb.TITLEPICS)
          .child(filename)
          .getDownloadURL()
          .then((url) => {
            firebase.firestore().collection(Fb.ORGANIZERS).doc(uid).update({
              titleImageId: url,
            });
            // setBackgroundImg(url);
            return url;
          });
      })

      .catch((error) => {
        console.log(error.message);
      });
  }
}

export function deleteBackgroundImg(uid) {
  const alert = window.confirm("bist du sicher?");

  if (alert) {
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        titleImageId: "",
      })
      .then(() => {
        //setBackgroundImg(DefaultBI);
      });
  }
}
