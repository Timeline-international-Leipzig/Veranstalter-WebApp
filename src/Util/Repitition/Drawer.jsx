import React, { useEffect, useState } from "react";
import "./Drawer.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import DefaultPI from "../../Images/DefaultPI.jpeg";
import Footer from "../Repitition/Footer/Footer";
import Fb from "../fbVariables";
import pathnames from "../pathnames";

function Drawer(props) {
  const uid = useSelector((state) => state.uidReducer);

  const [profileImg, setProfileImg] = useState(DefaultPI);

  const [storage, setStorage] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const [availableStoarge, setAvailableStoarge] = useState(0);

  useEffect(() => {
    if (!uid) return;
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .get()
      .then((snapshot) => {
        const profileImage = snapshot.data().profileImageId;
        const usedSt = snapshot.data().usedStorage;
        const availableSt = snapshot.data().availableStoarge;

        const storageProgress = (usedSt / availableSt) * 100;
        setStorage(storageProgress);
        setUsedStorage(usedSt / 1000000);
        setAvailableStoarge(availableSt / 1000000);

        if (!profileImage) return;
        setProfileImg(profileImage);
      });
  }, [uid]);

  if (!props.open.drawerPop) return null;

  const logoutFkt = () => {
    firebase.auth().signOut();
  };

  return (
    <>
      <div>
        <div className="overlay" onClick={props.onClose}></div>
        <div className="drawerPopup">
          <Link to={pathnames.EDIT_PROFILE}>
            <img className="drawerTitlePic" src={profileImg} alt="" />
          </Link>
          <div className="storageBar">
            <div
              className="storageProgress"
              style={{ width: `${storage}%` }}
            ></div>
          </div>
          <div className="storageCount">
            {usedStorage} GB von {availableStoarge} GB
          </div>
          <div className="storageBtn">
            <div className="storage">speicher erweitern.</div>
          </div>
          <div className="drawerItem">
            <Link to={pathnames.EDIT_PROFILE} className="drawerBtn">
              <span className="itemText">einstellungen</span>
            </Link>
          </div>
          <div className="drawerItem">
            {/*<Link to={pathnames.CONTACT} className="drawerBtn">
              <span className="itemText">kontakt</span>
  </Link>*/}
          </div>
          <div className="drawerItem">
            {/*<Link to={pathnames.EXTRAFUNCTIONS} className="drawerBtn">
              <span className="itemText">extra funktionen</span>
</Link>*/}
          </div>
          <div className="drawerItem">
            <div onClick={logoutFkt} id="signoutBtn" className="drawerBtn2">
              <span id="signout">abmelden</span>
            </div>
          </div>
          <Footer whatDrawer={true} />
        </div>
      </div>
    </>
  );
}
export default Drawer;
