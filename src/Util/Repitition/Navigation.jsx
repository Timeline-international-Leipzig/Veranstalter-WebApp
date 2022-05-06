import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import Fb from "../fbVariables";
import pathnames from "../pathnames";
import firebase from "firebase/compat/app";
import Group from "../../IconComponents/Group";
import Album from "../../IconComponents/Album";
import Notification from "../../IconComponents/Notification";
import SettingsIcon from "../../IconComponents/SettingsIcon";
import Drawer from "../Repitition/Drawer";
import { useSelector } from "react-redux";
import LogoGroupic from "./LogoGroupic";

function Navigation(props) {
  const currentProfile = props.currentProfile;
  const currentSocial = props.currentSocial;
  const currentNotification = props.currentNotification;

  //const uid = useSelector((state) => state.uidReducer);

  const [isOpen, setIsOpen] = useState({ drawerPop: false });

  const toggleOpen = () => {
    setIsOpen({ drawerPop: true });
  };

  const toggleClose = () => {
    setIsOpen({ drawerPop: false });
  };

  return (
    <div>
      <nav className="navbar" id="navbar">
        <ul className="nav">
          <LogoGroupic regularNav={true} />

          <li id="li">
            <Link to={pathnames.SOCIAL} className="nav-link">
              <Group />
              <span className={currentSocial ? "activeNav" : "link-text"}>
                community
              </span>
            </Link>
          </li>

          <li id="lit">
            <Link to={pathnames.PROFILE} className="nav-link">
              <Album />
              <span className={currentProfile ? "activeNav" : "link-text"}>
                profil
              </span>
            </Link>
          </li>

          <li>
            <div className="hex-container">
              <Link to={pathnames.EVENT_CREATION} className="hexagon">
                <div className="side"></div>
                <div className="side"></div>
              </Link>
            </div>
          </li>

          <li id="li">
            <Link
              id="notification"
              to={pathnames.NOTIFICATION}
              className="nav-link"
            >
              {/*<Notification />*/}
              <span className={currentNotification ? "activeNav" : "link-text"}>
                nachrichten
              </span>
              {/*notifications ? (
                <span className="notificationAlert">!</span>
              ) : (
                <div></div>
              )*/}
            </Link>
          </li>

          <li id="li2" onClick={() => toggleOpen()}>
            <div className="nav-link">
              <SettingsIcon />
              <span className="link-text">einstellungen</span>
            </div>
          </li>
        </ul>
      </nav>
      <Drawer open={isOpen} onClose={() => toggleClose()} />
    </div>
  );
}
export default Navigation;
