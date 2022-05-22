import React, { useEffect, useState } from "react";
import Fb from "../../Util/fbVariables";
import _ from "lodash";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import PreviewAll from "../../Event/Eventpreview/PreviewAll";
import PreviewUpcoming from "../../Event/Eventpreview/PreviewUpcoming";
import PreviewHighlights from "../../Event/Eventpreview/PreviewHighlights";
import QrReader from "react-qr-scanner";
import Test from "../../Util/QRcodeScanner";

function TabBar() {
  const uid = useSelector((state) => state.uidReducer);

  const [highlights, setHighlights] = useState([]);

  const [eventInfos, setEventInfos] = useState([]);

  const [toggleState, setToggleState] = useState(0);
  const [showQRscanner, setShowQRscanner] = useState(false);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    async function eventPreview() {
      if (!uid) return;
      //holt erstmal alle ids der events und checkt danach ob er sich auf einem
      //fremden Profil befindet oder nicht
      await firebase
        .firestore()
        .collection(Fb.ORGANIZERS)
        .doc(uid)
        .get()
        .then(async (snapshot) => {
          const eventArray = await snapshot.data().events;
          const highlightArray = await snapshot.data().highLights;
          setHighlights(highlightArray);

          if (!_.isEmpty(eventArray)) mapIds(eventArray);
        });
    }
    eventPreview();
  }, [uid]);

  async function mapIds(array) {
    if (_.isEmpty(array)) return;
    const eventPromiseArray = array.map(async (id) => {
      return await firebase
        .firestore()
        .collection(Fb.COM_EVENTS)
        .doc(id)
        .get()
        .then(async (snapshot) => {
          const {
            id,
            coverPic,
            title,
            startDate,
            endDate,
            startStamp,
            participantIds,
            adminIds,
          } = snapshot.data();

          return {
            id,
            coverPic,
            title,
            startDate,
            endDate,
            startStamp,
            participantIds,
            adminIds,
          };
        });
    });
    const eventArray = await Promise.all(eventPromiseArray);

    sortEventArray(eventArray);
  }

  function sortEventArray(eventArray) {
    const sortedArray = eventArray.sort((a, b) =>
      a.startStamp < b.startStamp ? 1 : -1
    );
    setEventInfos(sortedArray);
  }

  async function addHighlight(id) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        highLights: firebase.firestore.FieldValue.arrayUnion(id),
      })
      .then(() => {
        setHighlights((prevState) => [...prevState, id]);
      });
  }

  async function removeHighlight(id) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        highLights: firebase.firestore.FieldValue.arrayRemove(id),
      })
      .then(() => {
        const newList = highlights.filter((entry) => entry !== id);
        setHighlights(newList);
      });
  }

  //QR code Scanner
  function handleScan(result) {
    if (result) console.log(result);
  }

  function handleError(error) {
    console.log(error);
  }

  //console.log(adapter);

  return (
    <div className="sectionTab">
      <hr className="hr1" />
      <div className="tabBar">
        <div className="tab-head">
          <div
            className={toggleState === 0 ? "active-tabs" : "tabs"}
            onClick={() => toggleTab(0)}
          >
            highlights
          </div>
          <div
            className={toggleState === 1 ? "active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            anstehend
          </div>
          <div
            className={toggleState === 2 ? "active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            erlebnisse
          </div>
          <div
            className={toggleState === 3 ? "active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            QR code scanner
          </div>
        </div>
        <div
          style={{ left: toggleState * 25 + "%" }}
          className="tab-indicator"
        ></div>
      </div>
      <hr className="hr2" />

      <div className="tab-content">
        <div
          id="highlights"
          className={toggleState === 0 ? "active-content" : "contents"}
        >
          <PreviewHighlights
            events={eventInfos}
            highlightIds={highlights}
            addHighlight={(id) => addHighlight(id)}
            removeHighlight={(id) => removeHighlight(id)}
          />
        </div>

        <div
          id="coming"
          className={toggleState === 1 ? "active-content" : "contents"}
        >
          <PreviewUpcoming
            events={eventInfos}
            highlightIds={highlights}
            addHighlight={(id) => addHighlight(id)}
            removeHighlight={(id) => removeHighlight(id)}
          />
        </div>

        <div
          id="events"
          className={toggleState === 2 ? "active-content" : "contents"}
        >
          <PreviewAll
            events={eventInfos}
            highlightIds={highlights}
            //otherProfile={otherProfile}
            addHighlight={(id) => addHighlight(id)}
            removeHighlight={(id) => removeHighlight(id)}
          />
        </div>

        <div
          id="follower"
          className={toggleState === 3 ? "active-content" : "contents"}
        >
          <br />
          {showQRscanner ? (
            <div>
              <Test />
              <button onClick={() => setShowQRscanner(false)}>fertig</button>
            </div>
          ) : (
            <button onClick={() => setShowQRscanner(true)}>
              jetzt scannen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default TabBar;
