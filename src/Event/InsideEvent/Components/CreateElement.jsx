import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Fb from "../../../Util/fbVariables";
import ParticipantIcon from "../../../IconComponents/ParticipantIcon";

function CreateElement({ creatorId }) {
  const [creater, setCreater] = useState("");

  useEffect(() => {
    async function getUsername() {
      const creater = await firebase
        .firestore()
        .collection(Fb.ORGANIZERS)
        .doc(creatorId)
        .get()
        .then(async (snapshot) => {
          const username = await snapshot.data().username;
          return username;
        });

      setCreater(creater);
    }

    getUsername();
  }, [creatorId]);

  return (
    <div className="elementWidth">
      <ParticipantIcon />
      <span>{creater} hat das Ereignis erstellt.</span>
      <br />
    </div>
  );
}
export default CreateElement;
