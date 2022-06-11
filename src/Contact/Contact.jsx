import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import Fb from "../Util/fbVariables";
import emailjs from "emailjs-com";

function Contact(props) {
  const imageInfo = props.imageInfo;
  const eventId = props.eventId;
  const userId = props.userId;
  const orgUid = props.orgUid;
  const uid = useSelector((state) => state.uidReducer);

  const [message, setMessage] = useState();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!uid) return;
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .get()
      .then((snapshot) => {
        const email = snapshot.data().email;
        setEmail(email);
      });
  }, [uid]);

  async function sendEmail(e) {
    e.preventDefault();

    const emailData = {
      message: message,
      imageInfo: imageInfo,
      eventId: eventId,
      userId: userId,
      orgUid: orgUid,
    };

    await emailjs
      .send(
        "service_0v5dgho",
        "template_tme77e6",
        emailData,
        "user_bLdlGoeToWtJCH4lJiWUS"
      )
      .then(
        () => {
          window.alert("Deine Nachricht wurde an uns gesendet.");
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <div>
      <form onSubmit={sendEmail}>
        <div className="contactContainer">
          <div className="emailField">
            <label className="contactLabel" htmlFor="email">
              deine email
            </label>
            <input
              className="contactInput"
              defaultValue={email}
              id="email"
              type="email"
              name="email"
            />
          </div>

          <div>
            <label id="messageLabel" className="contactLabel" htmlFor="message">
              Nachricht
            </label>
            <textarea
              className="messageInput"
              id="message"
              type="text"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              name="message"
              required
            />
          </div>
          <div>
            <input className="sendMessage" type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}
export default Contact;
