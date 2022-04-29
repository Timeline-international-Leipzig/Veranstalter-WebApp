import { Link } from "react-router-dom";
import "./Settings.css";
import LogoGroupicSmall from "../Util/Repitition/LogoGroupicSmall";
import pathnames from "../Util/pathnames";

function SettingsNav(props) {


    var currentPR = props.currentPR;
    var currentPW = props.currentPW;
    var currentAC = props.currentAC;
    var currentEM = props.currentEM;


    return (
        <div className="settingsNavbar">
            <div className="sNav">
                <div className="settingsNavItem">
                    <LogoGroupicSmall regularNav={false} />
                </div>
                <div className="settingsNavItem">
                    <Link className="settingsLink" to={pathnames.EDIT_PROFILE}>
                        <span className={currentPR ? "activeSettings NavText" : "NavText"}>Profil bearbeiten</span>
                    </Link>
                </div>
                <div className="settingsNavItem">
                    <Link className="settingsLink" to={pathnames.EDIT_EMAIL}>
                        <span className={currentEM ? "activeSettings NavText" : "NavText"}>Email ändern</span>
                    </Link>
                </div>
                <div className="settingsNavItem">
                    <Link className="settingsLink" to={pathnames.EDIT_PASSWORD}>
                        <span className={currentPW ? "activeSettings NavText" : "NavText"}>Passwort ändern</span>
                    </Link>
                </div>
                <div className="settingsNavItem">
                    <Link className="settingsLink" to={pathnames.EDIT_ACCOUNTS}>
                        <span className={currentAC ? "activeSettings NavText" : "NavText"}>Verknüpfte Konten</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SettingsNav;
