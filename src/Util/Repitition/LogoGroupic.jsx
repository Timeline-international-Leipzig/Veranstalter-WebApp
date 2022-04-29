import React from "react";
import Logo from "../../IconComponents/Logo";
import { Link } from "react-router-dom";
import pathnames from "../pathnames";

function LogoGroupic(props) {
  var regularNav = props.regularNav;

  return (
    <div>
      <Link to={pathnames.PROFILE}>
        <div
          className={regularNav ? "navigationGroupic" : "settingsNavGroupic"}
        >
          <span className="logoSpan">
            <Logo width="1.8em" />
          </span>
          <span className="nameSpan">
            <header className="navLogoText">roupic</header>
          </span>
        </div>
      </Link>
    </div>
  );
}

export default LogoGroupic;
