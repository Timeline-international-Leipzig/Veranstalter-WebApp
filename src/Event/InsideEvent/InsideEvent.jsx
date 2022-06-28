import React, { useLayoutEffect, useState, useEffect } from "react";
import { useParams } from "react-router";
import Fb from "../../Util/fbVariables";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Navigation from "../../Util/Repitition/Navigation";
import DefaultBI from "../../Images/DefaultBI.jpeg";
import EventFotos from "./Components/EventFotos";
import Participants from "./Components/Participants";
import EventSettings from "./Components/EventSettings";
import "./InsideEvent.css";
import {
  EmailShareButton,
  WhatsappShareButton,
  EmailIcon,
  WhatsappIcon,
} from "react-share";

function InsideEvent() {
  const eventId = useParams().eventId;
  const uid = useSelector((state) => state.uidReducer);

  const [eventInfos, setEventInfos] = useState([]);
  const [participants, setParticipants] = useState();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  //holt alle Infos über das Event
  useEffect(() => {
    async function eventInfo() {
      const event = await firebase
        .firestore()
        .collection(Fb.COM_EVENTS)
        .doc(eventId)
        .get()
        .then((snapshot) => {
          const {
            id,
            coverPic,
            title,
            startDate,
            endDate,
            startStamp,
            mode,
            participantIds,
            adminIds,
            URL,
          } = snapshot.data();

          return {
            id,
            coverPic,
            title,
            startDate,
            endDate,
            startStamp,
            mode,
            participantIds,
            adminIds,
            URL,
          };
        });
      setEventInfos(event);
    }
    eventInfo();
    getParticipants();
  }, [eventId]);

  //holt sich Bilder und Infos über die Partici
  async function getParticipants() {
    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .get()
      .then((snapshot) => {
        const participants = snapshot.data().participantIds;
        const creatorFilter = participants.filter((id) => id !== uid);
        mapArray(creatorFilter);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function mapArray(array) {
    const promiseArray = array.map(async (uid) => {
      return await firebase
        .firestore()
        .collection(Fb.USERS)
        .doc(uid)
        .get()
        .then((snapshot) => {
          const { username, profileImageId, uid } = snapshot.data();

          return {
            username,
            profileImageId,
            uid,
          };
        });
    });
    const userArray = await Promise.all(promiseArray);
    setParticipants(userArray);
  }

  //Edit Profile
  function updateTitle(newTitle) {
    console.log("test");
    setEventInfos({ ...eventInfos, title: newTitle });
  }

  /*Event verlassen
    function leaveEvent() {
      leavingEvent(eventInfos, uid);
    }*/

  //Coverpic ändern
  function updateCoverPic(url) {
    setEventInfos({ ...eventInfos, coverPic: url });
  }

  async function removeParticipant() {
    setParticipants(await getParticipants(eventId));
  }

  //Eventmode ändern
  /* function updateMode(newEventPrivacy) {
    setEventInfos({ ...eventInfos, mode: newEventPrivacy });
  }*/

  return (
    <div>
      <Navigation navHeader={eventInfos.title} />
      <main>
        {eventInfos.coverPic === "" ? (
          <img className="insideCover" src={DefaultBI} alt="" />
        ) : (
          <img className="insideCover" src={eventInfos.coverPic} alt="" />
        )}
        <div className="titleMain">
          <span className="titleSpan">{eventInfos.title}</span>
          <EventSettings
            eventInfo={eventInfos}
            updateTitle={(newTitle) => updateTitle(newTitle)}
            //updateMode={(EventPrivacy) => updateMode(EventPrivacy)}
            // leaveEvent={leaveEvent}
            updateCoverPic={(url) => updateCoverPic(url)}
            removeParticipant={removeParticipant}
          />
        </div>
        <div className="insideDate">
          <span>
            {eventInfos.startDate} - {eventInfos.endDate}
          </span>
        </div>

        <EmailShareButton url={eventInfos.URL}>
          <EmailIcon round={true} size={32} />
        </EmailShareButton>
        <WhatsappShareButton
          url={eventInfos.URL}
          title="Groupic teilen test"
          separator=": "
        >
          <WhatsappIcon round={true} size={32} url={eventInfos.URL} />
        </WhatsappShareButton>

        <div className="participantBar">
          <div className="participantRow">
            <Participants participantArray={participants} />
          </div>
          <hr className="hrEvent" />
        </div>
        <EventFotos eventId={eventId} />
      </main>
    </div>
  );
}
export default InsideEvent;
