import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Fb from "../Util/fbVariables";
import ProfileImage from "./Components/ProfileImage";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import pathnames from "../Util/pathnames";
import "./Profile.css";
import Navigation from "../Util/Repitition/Navigation";

function Profile(props) {
  const uid = props.uid;

  const [userText, setUserText] = useState({});

  useEffect(() => {
    async function userInfos() {
      if (!uid) return;
      await firebase
        .firestore()
        .collection(Fb.ORGANIZERS)
        .doc(uid)
        .get()
        .then((snapshot) => {
          const username = snapshot.data().username;
          const fullName = snapshot.data().fullName;
          setUserText({ username, fullName });
        });
    }
    userInfos();
  }, []);
  //console.log(uid);

  if (!uid) return <div> etwas ist schief gelaufen :(</div>;

  return (
    <div>
      <Navigation currentProfile={true} />
      <main>
        <ProfileImage uid={uid} toggleScreen={true} />
        <div className="profileInfo">
          <div className="userName">
            <span className="userName"> {userText.username}</span>
          </div>
          <div className="userRealName">
            <span className="userRealName"> {userText.realname}</span>
          </div>
          <Link className="profileEditLink" to={pathnames.EDIT_PROFILE}>
            <button id="followBtn" className="profileEdit">
              <span>Profil bearbeiten</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
export default Profile;
