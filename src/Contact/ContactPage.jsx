import React, { useState, useEffect } from "react";
import Support from "../IconComponents/Support";
import { useLocation } from "react-router-dom";
import Contact from "./Contact";

function ContactPage() {
  const location = useLocation();

  const [imageInfo, setImageInfo] = useState();
  const [eventId, setEventId] = useState();
  const [userId, setUserId] = useState();
  const [orgUid, setOrgUid] = useState();

  useEffect(() => {
    if (location.state) {
      const { imageInfo } = location.state;
      const { eventId } = location.state;
      const { userId } = location.state;
      const { profileUid } = location.state;

      setImageInfo(imageInfo);
      setEventId(eventId);
      setUserId(userId);
      setOrgUid(profileUid);
    }
  }, []);

  return (
    <div>
      {/*<NewNav navHeader="Kontakt"/>*/}
      <main>
        <div className="contactHeader">
          <div className="supportSVG">
            <Support />
          </div>
          <span className="contaceHeaderSpan">kontaktiere uns!</span>
        </div>
        <div className="contactInfo">
          {imageInfo ? (
            <span>Grund deiner Bildmeldung:</span>
          ) : userId || orgUid ? (
            <span>Warum möchtest du diesen Nutzer melden?</span>
          ) : (
            <span>
              Falls ein Problem beim Nutzen der Anwendung aufgetreten ist, oder
              du dich mit einem anderem Anliegen an uns wenden möchtest, kümmern
              wir uns gerne.
            </span>
          )}
        </div>

        <Contact
          imageInfo={imageInfo}
          eventId={eventId}
          userId={userId}
          orgUid={orgUid}
        />
      </main>
    </div>
  );
}
export default ContactPage;
