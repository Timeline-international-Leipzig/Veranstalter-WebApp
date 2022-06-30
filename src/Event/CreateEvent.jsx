import React from "react";
import "./CreateEvent.css";
import { useState, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { de } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/compat/app";
import { useSelector } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import DefaultBI from "../Images/DefaultBI.jpeg";
import Navigation from "../Util/Repitition/Navigation";
import pathnames from "../Util/pathnames";
import Calendar from "../IconComponents/Calendar";
import Fb from "../Util/fbVariables";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import CurrencyInput from "react-currency-input-field";

function CreateEvent() {
  const uid = useSelector((state) => state.uidReducer);

  const [eventname, setEventname] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDateFormatted, setStartDateFormatted] = useState();
  const [startDateMillisec, setStartDateMillisec] = useState();
  const [endStampMillisec, setEndStampMillisec] = useState();
  const [endDate, setEndDate] = useState();
  const [endDateFormatted, setEndDateFormatted] = useState(null);
  const [eventPrivacy, setEventPrivacy] = useState();
  const [price, setPrice] = useState("1");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");

  //aktiviert den Chiploader am Anfang der Funktion und deaktiviert ihn am ende
  const [loading, setLoading] = useState(false);
  const override = css`
    position: absolute;
    right: 9%;
  `;

  registerLocale("de", de);

  useEffect(() => {
    formatStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    console.log(price, 1);
  }, [price]);

  useEffect(() => {
    formatEndDate(endDate);
  }, [endDate]);

  function validateInput(e) {
    e.preventDefault();

    if (!eventname) {
      setLoading(false);
      window.alert("Gib dem Event einen Titel");
      return;
    } else if (!startDate) {
      setLoading(false);
      window.alert("Gib dem Event ein Startdatum");
      return;
    } else if (!endDate) {
      setLoading(false);
      window.alert("Gib dem Event ein Enddatum");
      return;
    } else if (!eventPrivacy) {
      setLoading(false);
      window.alert("wähle aus, wer das Event sehen darf");
      return;
    } else {
      createEvent();
    }
  }

  async function createEvent() {
    const eventId = uuidv4();
    const elementId = uuidv4();
    const time = Date.now();
    const URL = "https://groupic.de/offizielles-event/" + eventId;

    setLoading(true);

    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .set({
        title: eventname,
        publishTime: time,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        participantIds: [uid],
        coverPic: "",
        mode: eventPrivacy,
        adminIds: [uid],
        id: eventId,
        creatorId: uid,
        startStamp: startDateMillisec,
        endStamp: endStampMillisec,
        sizeKb: 0,
        URL: URL,
        price: price.toString(),
        time: time,
        place: place,
      })
      .then(async () => {
        await firebase
          .firestore()
          .collection(Fb.COM_EVENTS)
          .doc(eventId)
          .collection(Fb.ELEMENTS)
          .doc(elementId)
          .set({
            id: elementId,
            stamp: time,
            type: Fb.CREATE,
            toUid: null,
            uriOrUid: uid,
          });
      })
      .then(async () => {
        await storeCoverImg(eventId);
      });
  }

  async function createUserConnection(_eventId) {
    await firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .update({
        events: firebase.firestore.FieldValue.arrayUnion(_eventId),
      })
      .then(() => {
        window.location.href = pathnames.PROFILE;
      });
  }

  function formatStartDate(date) {
    if (!date) return;
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const _date = [day, month, year].join(".");
    setStartDateFormatted(_date);
    setStartDateMillisec(date.getTime());
  }

  function formatEndDate(date) {
    if (!date) return;
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const _date = [day, month, year].join(".");
    setEndDateFormatted(_date);
    setEndStampMillisec(date.getTime());
  }

  // Crop & Upload Funktionen

  const cropAbbruch = (e) => {
    e.target.value = null;
  };

  // Coverbild

  const [srcImgC, setSrcImgC] = useState(null);
  const [imageC, setImageC] = useState(null);
  const [cropC, setCropC] = useState({
    aspect: 20 / 10,
    unit: "px",
    width: 300,
    x: 100,
    y: 50,
  });

  const [showResultC, setShowResultC] = useState(DefaultBI);
  const [resultC, setResultC] = useState(null);
  const [cropupC, setCropupC] = useState(false);

  const toggleCropupC = () => {
    setCropupC(!cropupC);
  };

  const handleImageC = (e) => {
    setSrcImgC(URL.createObjectURL(e.target.files[0]));
    toggleCropupC();
  };

  const getCroppedImgC = () => {
    const canvas = document.createElement("canvas");
    const scaleX = imageC.naturalWidth / imageC.width;
    const scaleY = imageC.naturalHeight / imageC.height;
    canvas.width = cropC.width;
    canvas.height = cropC.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imageC,
      cropC.x * scaleX,
      cropC.y * scaleY,
      cropC.width * scaleX,
      cropC.height * scaleY,
      0,
      0,
      cropC.width,
      cropC.height
    );

    const base64Image = canvas.toDataURL("image/jpeg", 1);
    setShowResultC(base64Image);

    canvas.toBlob(
      (blob) => {
        setResultC(blob);
        toggleCropupC();
      },
      "image/webp",
      1
    );
  };

  async function storeCoverImg(_eventId) {
    if (!resultC) {
      createUserConnection(_eventId);
      return;
    } else {
      await firebase
        .storage()
        .ref(Fb.COVERPICS)
        .child(_eventId)
        .put(resultC)
        .then(async function () {
          await firebase
            .storage()
            .ref(Fb.COVERPICS)
            .child(_eventId)
            .getDownloadURL()
            .then(async (url) => {
              await firebase
                .firestore()
                .collection(Fb.COM_EVENTS)
                .doc(_eventId)
                .update({
                  coverPic: url,
                });
              return url;
            });
        })
        .catch((error) => {
          window.alert(error.message);
        });
      createUserConnection(_eventId);
    }
  }

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="customInput" onClick={onClick} ref={ref}>
      {value}
      <Calendar />
    </button>
  ));

  let plsWork = (time) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  return (
    <div>
      <Navigation />
      <main>
        <div className="createAlbum">
          <span>Erstelle</span> ein Album
        </div>

        <div className="createTitleContainer">
          <label id="createLabel" className="nameLabel" htmlFor="titleInput">
            Name des Erlebnisses
          </label>

          <input
            required
            className="titleInput"
            id="titleInput"
            type="text"
            value={eventname}
            onChange={(e) => setEventname(e.target.value)}
          />
        </div>
        {/**auf den Seiten stehen die ganzen konfigurationen und beispiele, da kann man sich mal umsehen */}
        {/**https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md */}
        {/**https://reactdatepicker.com/ */}
        <div className="startDatum">
          <label id="createLabel" className="datumLabel">
            Stardatum:{" "}
          </label>
          <DatePicker
            selected={startDate}
            onSelect={(date) => setStartDate(date)}
            dateFormat="dd.MM.yyyy"
            withPortal
            timeClassName={plsWork}
            customInput={<CustomInput />}
            locale="de"
            closeOnScroll={true}
            className="dateInput"
          ></DatePicker>
        </div>

        <div className="startDatum2">
          <label id="createLabel" className="datumLabel2">
            Enddatum:
          </label>
          <DatePicker
            selected={endDate}
            onSelect={(date) => setEndDate(date)}
            dateFormat="dd.MM.yyyy"
            customInput={<CustomInput />}
            withPortal
            locale="de"
            closeOnScroll={true}
            timeClassName="dateOutput"
          ></DatePicker>
        </div>

        <div>
          {srcImgC && cropupC ? (
            <div className="cropOverlayBI">
              <div className="cropBI">
                <ReactCrop
                  className="cropperBI"
                  src={srcImgC}
                  onImageLoaded={setImageC}
                  crop={cropC}
                  onChange={setCropC}
                />
                <div className="cropUploadBtn" onClick={getCroppedImgC}>
                  übernehmen.
                </div>
                <div className="stopCrop" onClick={toggleCropupC}>
                  abbrechen
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="sectionBI">
          <label id="createLabel" className="coverLabel" htmlFor="fileBI">
            Coverbild hinzufügen
          </label>
          <label htmlFor="fileBI" className="customFileInputBI">
            <input
              id="fileBI"
              className="einrichtungFileInputBI"
              type="file"
              onChange={handleImageC}
              onClick={(e) => cropAbbruch(e)}
            ></input>
            <img className="einrichtungBI" src={showResultC} alt="" />
          </label>
        </div>

        <div>
          <input
            type="text"
            placeholder="Ort..."
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Zeit..."
            value={time}
            onChange={(e) => setTime(e.target.value)}
          ></input>
        </div>

        <div className="privacyLabel">
          <span id="createLabel">Was ist die Eventeinstellung? </span>
        </div>

        <form className="eventPrivacy">
          <div className="line1">
            <input
              id="teilnehmer"
              type="radio"
              value="öffentlich"
              checked={eventPrivacy === 1}
              onChange={(e) => setEventPrivacy(1)}
            />
            <label className="eventPrivacyLabel" htmlFor="teilnehmer">
              öffentlich
            </label>
          </div>

          <div className="line1">
            <input
              id="teilnehmerUndKontakte"
              type="radio"
              value="auf Einladung"
              checked={eventPrivacy === 2}
              onChange={(e) => setEventPrivacy(2)}
            />
            <label
              className="eventPrivacyLabel"
              htmlFor="teilnehmerUndKontakte"
            >
              auf Einladung
            </label>
          </div>

          <div className="line1">
            <input
              id="teilnehmer"
              type="radio"
              value="kostenpflichtig"
              checked={eventPrivacy === 3}
              onChange={(e) => setEventPrivacy(3)}
            />
            <label className="eventPrivacyLabel" htmlFor="teilnehmer">
              bezahltes Ticket
            </label>
          </div>
        </form>

        {/*(eventPrivacy = "beschränkt" ? <div></div> : null)*/}

        <button className="continueEvent" onClick={validateInput}>
          <span>erstellen</span>
          <ClipLoader
            className="clipLoad"
            color="skyblue"
            loading={loading}
            css={override}
            size={15}
          />
        </button>

        {eventPrivacy === 3 && (
          <CurrencyInput
            placeholder="bitte gib den Preis deines Tickets ein"
            onValueChange={(value) => setPrice(value)}
            value={price}
            decimalsLimit={2}
            suffix="€"
            allowNegativeValue={false}
            defaultValue={1.0}
            decimalSeparator="."
            groupSeparator=","
          />
        )}
      </main>
    </div>
  );
}
export default CreateEvent;
