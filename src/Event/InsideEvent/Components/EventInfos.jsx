import React, { useState } from "react";
import firebase from "firebase/compat/app";
import Fb from "../../../Util/fbVariables";

function EventInfos({ eventId }) {
  //console.log(eventId);
  const [infos, setInfos] = useState();

  function uploadInfo(e) {
    e.preventDefault();

    firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .update({
        info: infos,
      })
      .then(() => {
        window.alert("Infos wurden veröffentlicht!");
      });
  }

  return (
    <div>
      <form onSubmit={(e) => uploadInfo(e)}>
        <textarea
          placeholder="Infos für das Event..."
          className="messageInput"
          id="message"
          type="text"
          onChange={(e) => {
            setInfos(e.target.value);
          }}
          name="message"
          required
        />
        {infos && (
          <div className="sendMessage">
            <button type="submit">Veröffentlichen</button>
          </div>
        )}
      </form>
    </div>
  );
}
export default EventInfos;
