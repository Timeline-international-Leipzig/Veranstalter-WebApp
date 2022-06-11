import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import MenuIcon from "../../../IconComponents/MenuIcon";
import Fb from "../../../Util/fbVariables";
import _ from "lodash";
import ReactCrop from "react-image-crop";

function EventSettings({
  eventInfo,
  updateTitle,
  updateCoverPic,
  removeParticipant,
}) {
  const title = eventInfo.title;
  const adminIds = eventInfo.adminIds;
  const eventId = eventInfo.id;
  const mode = eventInfo.mode;

  const uid = useSelector((state) => state.uidReducer);

  const [newTitle, setNewTitle] = useState();
  const [showTitleBtn, setShowTitleBtn] = useState(false);

  const [modePopup, setmodePopup] = useState(false);
  const [eventPrivacy, setEventPrivacy] = useState(mode);
  const [modeChangeBtn, setModeChangeBtn] = useState(false);

  const [showDropDown, setShowDropDown] = useState(false);

  const openDropDown = () => {
    setShowDropDown((prevState) => !prevState);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Alert if clicked on outside of element
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowDropDown(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  //Variablen und Funktionen für Edit Event
  async function updateTitleFb(newTitle) {
    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .update({
        title: newTitle,
      })
      .then(() => {
        setShowTitleBtn(false);
        updateTitle(newTitle);
        alert("Titel geändert");
      })
      .catch(() => {
        alert("Fehler bei der Eingabe des Titels");
        return;
      });
  }

  //Coverpic ändern
  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    aspect: 20 / 10,
    width: 160,
    unit: "px",
    x: 170,
    y: 50,
  });
  const [cropup, setCropup] = useState(false);

  const toggleCropup = () => {
    setCropup(!cropup);
  };

  const cropAbbruch = (e) => {
    e.target.value = null;
  };

  const handleImage = (e) => {
    setSrcImg(URL.createObjectURL(e.target.files[0]));
    toggleCropup();
  };

  const getCroppedImg = () => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(
      (blob) => {
        storeCoverPic(blob);
        toggleCropup();
      },
      "image/webp",
      1
    );
  };

  async function storeCoverPic(result) {
    if (result === 0) {
      window.alert("kein Bild gefunden!");
      return;
    } else {
      await firebase
        .storage()
        .ref(Fb.COVERPICS)
        .child(eventId)
        .put(result)
        .then(async function () {
          await firebase
            .storage()
            .ref(Fb.COVERPICS)
            .child(eventId)
            .getDownloadURL()
            .then(async (url) => {
              await firebase
                .firestore()
                .collection(Fb.COM_EVENTS)
                .doc(eventId)
                .update({
                  coverPic: url,
                });
              console.log("gespeichert");
              updateCoverPic(url);
              //return url;
            });
        })

        .catch((error) => {
          window.alert(error.message);
        });
    }
  }

  //alert fehlt, der nach ein paar sekunden wieder verschwindet
  async function shareAlbum() {
    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .get()
      .then(async (snapshot) => {
        const URL = await snapshot.data().URL;
        navigator.clipboard.writeText(URL);
      });
  }

  const [removePopup, setRemovePopup] = useState(false);
  const [parts, setParts] = useState([]);

  const toggleRemovePopup = () => {
    setRemovePopup((prevState) => !prevState);
    removePartiList();
  };

  async function removePartiList() {
    const partarray = await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .get()
      .then((snapshot) => {
        const participants = snapshot.data().participantIds;
        return participants;
      });

    const adminArray = await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .get()
      .then((snapshot) => {
        const adminArray = snapshot.data().adminIds;
        return adminArray;
      });

    const filterAdmins = partarray.filter((id) => !adminArray.includes(id));

    mapPartiArray(filterAdmins);
  }

  async function mapPartiArray(array) {
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
            removed: false,
          };
        });
    });
    const userArray = await Promise.all(promiseArray);
    setParts(userArray);
  }

  function remove(uid, username) {
    const alert = window.confirm(
      "bist du sicher, dass du " +
        username +
        " aus dem Ereignis entfernen willst? "
    );
    if (alert) {
      const updatedList = parts.map((entry) => {
        if (entry.uid === uid) {
          entry.removed = true;
        }
        return entry;
      });
      setParts(updatedList);
      removeParticipant();

      firebase
        .firestore()
        .collection(Fb.COM_EVENTS)
        .doc(eventId)
        .update({
          participantIds: firebase.firestore.FieldValue.arrayRemove(uid),
        });

      firebase
        .firestore()
        .collection(Fb.USERS)
        .doc(uid)
        .update({
          com_events: firebase.firestore.FieldValue.arrayRemove(eventId),
        });
    }
  }

  //Mode ändern
  /*function toggleModePopup() {
    setmodePopup(!modePopup);
    setEventPrivacy(mode);
  }


  async function updateFbMode() {
    updateMode(eventPrivacy);
    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .update({
        mode: eventPrivacy,
      })
      .then(() => {
        window.alert("Ereignismodus geändert");
        setmodePopup(false);
        setShowDropDown(false);
      });
  }*/

  return (
    <div ref={wrapperRef} className="dropCont">
      <div onClick={openDropDown} className="drop">
        <MenuIcon />
      </div>

      {showDropDown && (
        <div className="dropDown2">
          {/*Titel bearbeiten  */}
          <div>
            <div>
              {showTitleBtn && (
                <div
                  className="updateEventName2"
                  onClick={() => updateTitleFb(newTitle)}
                >
                  <span className="updateEventNameSpan">Album Name ändern</span>
                </div>
              )}
            </div>
            <input
              defaultValue={title}
              className="editCoverTitle"
              type="text"
              onChange={(e) => {
                setNewTitle(e.target.value);
                setShowTitleBtn(true);
              }}
            ></input>
          </div>

          {/*bearbeiten des Coverbildes */}
          <div>
            {srcImg && cropup && (
              <div className="cropOverlayPI">
                <div className="cropPI">
                  <ReactCrop
                    className="cropperPI"
                    src={srcImg}
                    onImageLoaded={setImage}
                    crop={crop}
                    onChange={setCrop}
                  />
                  <div className="cropUploadBtn" onClick={getCroppedImg}>
                    übernehmen.
                  </div>
                  <div className="stopCrop" onClick={toggleCropup}>
                    abbrechen
                  </div>
                </div>
              </div>
            )}
          </div>
          <input
            id="pi"
            className="einrichtungFileInputPI"
            type="file"
            onChange={handleImage}
            onClick={(e) => cropAbbruch(e)}
          ></input>
          <label htmlFor="pi" className="ddElement">
            <span>Coverbild ändern</span>
          </label>

          {/**Album teilen */}
          <div className="ddElement" onClick={shareAlbum}>
            <span>Album teilen</span>
          </div>

          {removePopup && (
            <div className="cropOverlayBI">
              <div className="cropBI">
                {parts.length ? (
                  <div>
                    {parts.map((info) => (
                      <div key={info.uid}>
                        {/*<img src={info.profileImageId} width="150" height="150"></img>*/}
                        <p>{info.username}</p>
                        <div onClick={() => remove(info.uid, info.username)}>
                          {info.removed ? "wurde entfernt" : "entfernen"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>leider niemanden gefunden :(</div>
                )}

                <div onClick={toggleRemovePopup}>schließen</div>
              </div>
            </div>
          )}
          <div className="ddElement" onClick={toggleRemovePopup}>
            <span>Teilnehmer entfernen</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default EventSettings;
