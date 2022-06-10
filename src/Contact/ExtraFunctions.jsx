import React from "react";
import Contact from "./Contact";
import FriendIcon from "../IconComponents/FriendIcon";

function ExtraFunctions() {
  return (
    <div>
      {/*<NewNav navHeader="Extra Funktionen" />*/}
      <main>
        <div className="extraFunctions">
          <span className="featureWish">
            schlage uns deine Wunsch-Features für zukünftige Updates vor!
          </span>
        </div>
        <FriendIcon />
        <Contact />
      </main>
    </div>
  );
}

export default ExtraFunctions;
