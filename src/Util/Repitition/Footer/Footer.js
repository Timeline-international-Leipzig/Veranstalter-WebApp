import React, {useState} from 'react'
import { Link } from "react-router-dom"

function Footer(props) {

var whatDrawer = props.whatDrawer;

    return (
        <div className={whatDrawer? "drawerFooter":"homeFooter"}>
                <Link className="imda" to="/impressum">Impressum</Link>
                <Link className="imda" to="/datenschutz">Datenschutz</Link>
        </div>
    )
}

export default Footer