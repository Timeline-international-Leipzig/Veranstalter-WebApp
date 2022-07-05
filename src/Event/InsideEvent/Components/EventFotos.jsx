import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Fb from "../../../Util/fbVariables";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Camera from "../../../IconComponents/Camera";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import NextIcon from "../../../IconComponents/NextIcon";
import PreviousIcon from "../../../IconComponents/PreviousIcon";
import pathnames from "../../../Util/pathnames";
import DefaultPI from "../../../Images/DefaultPI.jpeg";
import Quote from "../../../IconComponents/Quote";
import CloseIcon from "../../../IconComponents/Close";
import CreateElement from "./CreateElement";
import Compressor from "compressorjs";

function EventFotos({ eventId }) {
  const [elementsList, setElementsList] = useState([{}]);
  const [fotosList, setFotosList] = useState();

  const [showFotoOverlay, setShowFotoOverlay] = useState(false);

  const [citationPreviewPopup, setCitationPreviewPopup] = useState(false);

  useEffect(() => {
    function getElements() {
      firebase
        .firestore()
        .collection(Fb.COM_EVENTS)
        .doc(eventId)
        .collection(Fb.ELEMENTS)
        .get()
        .then((snapshot) => {
          const array = snapshot.docs.map((eventId) => {
            const { id, stamp, toUid, type, uriOrUid } = eventId.data();

            return { id, stamp, toUid, type, uriOrUid, overlayOpen: false };
          });
          sortElements(array);
          filterFotos(array);
        });
    }
    getElements();
  }, [eventId]);

  //Aktualisiert die fotoliste wenn ein Bild hinzugefügt wird
  useEffect(() => {
    filterFotos(elementsList);
  }, [elementsList]);

  function sortElements(array) {
    const sortedArray = array.sort((a, b) => (a.stamp < b.stamp ? 1 : -1));
    setElementsList(sortedArray);
  }

  function filterFotos(array) {
    const fotos = array.filter((elements) => elements.type === "IMAGE");
    setFotosList(fotos);
  }

  //FOTOS
  async function addFoto(e) {
    const time = Date.now();
    const file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fotoId = uuidv4();

      new Compressor(file[i], {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (resFile) => {
          uploadFoto(resFile, fotoId, time);
        },
      });
    }
  }

  async function uploadFoto(resFile, fotoId, time) {
    await firebase
      .storage()
      .ref(Fb.EVENTPICS)
      .child(eventId)
      .child(fotoId)
      .put(resFile)
      .then(async () => {
        await firebase
          .storage()
          .ref(Fb.EVENTPICS)
          .child(eventId)
          .child(fotoId)
          .getDownloadURL()
          .then(async (url) => {
            await firebase
              .firestore()
              .collection(Fb.COM_EVENTS)
              .doc(eventId)
              .collection(Fb.ELEMENTS)
              .doc(fotoId)
              .set({
                id: fotoId,
                stamp: time,
                type: Fb.IMAGE,
                toUid: null,
                uriOrUid: url,
              });
            setElementsList((prevState) => [
              {
                id: fotoId,
                stamp: time,
                type: Fb.IMAGE,
                toUid: null,
                uriOrUid: url,
              },
              ...prevState,
            ]);
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  async function deleteFoto(fotos) {
    await firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .collection(Fb.ELEMENTS)
      .doc(fotos.id)
      .delete()
      .then(() => {
        const updatefotosList = elementsList.filter(
          (foto) => foto.id !== fotos.id
        );
        setElementsList(updatefotosList);
      });

    await firebase
      .storage()
      .ref(Fb.EVENTPICS)
      .child(eventId)
      .child(fotos.id)
      .delete();
  }

  const openFoto = (id) => {
    setShowFotoOverlay(true);

    const newList = fotosList.map((entry) => {
      if (entry.id === id) {
        entry.overlayOpen = true;
      }
      return entry;
    });
    setFotosList(newList);
  };

  const closeFoto = () => {
    setShowFotoOverlay(false);
    const newList = fotosList.map((entry) => {
      entry.overlayOpen = false;

      return entry;
    });
    setFotosList(newList);
  };

  const nextFoto = (id) => {
    const currentItem = fotosList.findIndex((item) => item.id === id);
    const nextItem = currentItem + 1;

    const newList = fotosList.map((entry, index) => {
      if (index === currentItem) {
        entry.overlayOpen = false;
      }
      if (currentItem === fotosList.length - 1) {
        closeFoto();
      }
      if (index === nextItem) {
        entry.overlayOpen = true;
      }
      return entry;
    });
    setFotosList(newList);
  };

  const previousFoto = (id) => {
    const currentItem = fotosList.findIndex((item) => item.id === id);
    const previousItem = currentItem - 1;

    const newList = fotosList.map((entry, index) => {
      if (index === currentItem) {
        entry.overlayOpen = false;
      }
      if (currentItem === 0) closeFoto();
      if (index === previousItem) {
        entry.overlayOpen = true;
      }
      return entry;
    });
    setFotosList(newList);
  };

  //ZITATE
  function toggleCitationPopup() {
    setCitationPreviewPopup((prevState) => !prevState);
  }

  return (
    <div className="addShowFoto">
      <div className="photoInput">
        <input
          id="insideInput"
          type="file"
          onChange={(e) => addFoto(e)}
          multiple
        ></input>
        <label className="labelInputPhoto" htmlFor="insideInput">
          <Camera />
        </label>

        <div className="addQuote" onClick={toggleCitationPopup}>
          <Quote />
        </div>
      </div>

      {citationPreviewPopup && (
        <div className="participantOverlay">
          <div className="participantPopup2">
            <span className="quoteHeader">Zitat hinzufügen</span>

            <div
              className="closeParticipantPopup"
              onClick={toggleCitationPopup}
            >
              <span>schließen</span>
            </div>
          </div>
        </div>
      )}

      <div className="insideImgCont">
        {elementsList.map((elements) => {
          switch (elements.type) {
            case Fb.IMAGE:
              return (
                <div className="flexSize" key={elements.id}>
                  <ContextMenuTrigger className="wrapper" id={elements.id}>
                    <div className="dummy"></div>
                    <div
                      className="insideImg"
                      key={elements.id}
                      style={{
                        backgroundImage: `url(${elements.uriOrUid})`,
                      }}
                      onClick={() => openFoto(elements.id)}
                    ></div>
                  </ContextMenuTrigger>
                  <ContextMenu className="rightClick" id={elements.id}>
                    <MenuItem
                      data={{ foo: "bar" }}
                      onClick={() => deleteFoto(elements)}
                      className="rightClickItem"
                    >
                      Bild löschen
                    </MenuItem>

                    <MenuItem>
                      <Link
                        className="rightClickItem"
                        to={{
                          pathname: pathnames.CONTACT,
                          state: {
                            imageInfo: elements.id,
                            eventId: eventId,
                          },
                        }}
                      >
                        Bild melden
                      </Link>
                    </MenuItem>
                  </ContextMenu>

                  {showFotoOverlay && (
                    <div onClick={closeFoto} className="fotoOverlay">
                      <CloseIcon />
                    </div>
                  )}

                  {fotosList && (
                    <div>
                      {fotosList.map((foto) => (
                        <div key={foto.id}>
                          {foto.overlayOpen && (
                            <div>
                              <CloseIcon onClick={closeFoto} />

                              <div className="fotosPopup">
                                <div
                                  onClick={() => previousFoto(foto.id)}
                                  className="previousBtn"
                                >
                                  <PreviousIcon />
                                </div>
                                <img
                                  className="overlayImgFullSize"
                                  src={foto.uriOrUid}
                                  alt=""
                                />
                                <div
                                  onClick={() => nextFoto(foto.id)}
                                  className="nextBtn"
                                >
                                  <NextIcon />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            case Fb.CREATE:
              return (
                <CreateElement
                  key={elements.id}
                  creatorId={elements.uriOrUid}
                />
              );
          }
        })}
      </div>
    </div>
  );
}
export default EventFotos;
