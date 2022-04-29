import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fb from "../../Util/fbVariables";
import DefaultPI from "../../Images/DefaultPI.jpeg";
import DefaultBI from "../../Images/DefaultBI.jpeg";
import firebase from "firebase/compat/app";
import {
  storeProfileImg,
  deleteProfileImg,
  storeBackgroundImg,
  deleteBackgroundImg,
} from "./ProfileImageActions";
import "../../Util/Repitition/Cropup.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ProfileImage(props) {
  const toggleScreen = props.toggleScreen;
  const uid = props.uid;

  const [profileImg, setProfileImg] = useState(DefaultPI);
  const [backgroundImg, setBackgroundImg] = useState(DefaultBI);

  //laden des ProfileImg und des bgImg
  useEffect(() => {
    if (!uid) return;
    firebase
      .firestore()
      .collection(Fb.ORGANIZERS)
      .doc(uid)
      .get()
      .then(async (snapshot) => {
        const profileImage = await snapshot.data().profileImageId;
        const backgroundImage = await snapshot.data().titleImageId;

        if (profileImage) setProfileImg(profileImage);
        if (backgroundImage) setBackgroundImg(backgroundImage);
      });
  }, [uid]);

  // Crop & Upload Funktionen
  const cropAbbruch = (e) => {
    e.target.value = null;
  };

  // Profilbild
  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    aspect: 1,
    width: 160,
    unit: "px",
    x: 170,
    y: 50,
  });
  const [cropup, setCropup] = useState(false);

  const toggleCropup = () => {
    setCropup(!cropup);
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
        storeProfileImg(blob, uid);
        toggleCropup();
      },
      "image/webp",
      1
    );
  };

  // Hintergrundbild
  const [srcImgB, setSrcImgB] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [cropB, setCropB] = useState({
    aspect: 20 / 10,
    unit: "px",
    width: 300,
    x: 100,
    y: 50,
  });
  const [cropupB, setCropupB] = useState(false);

  const toggleCropupB = () => {
    setCropupB(!cropupB);
  };

  const handleImageB = (e) => {
    setSrcImgB(URL.createObjectURL(e.target.files[0]));
    toggleCropupB();
  };

  const getCroppedImgB = () => {
    const canvas = document.createElement("canvas");
    const scaleX = imageB.naturalWidth / imageB.width;
    const scaleY = imageB.naturalHeight / imageB.height;
    canvas.width = cropB.width;
    canvas.height = cropB.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imageB,
      cropB.x * scaleX,
      cropB.y * scaleY,
      cropB.width * scaleX,
      cropB.height * scaleY,
      0,
      0,
      cropB.width,
      cropB.height
    );

    canvas.toBlob(
      (blob) => {
        storeBackgroundImg(blob, uid);
        toggleCropupB();
      },
      "image/webp",
      1
    );
  };

  return (
    <>
      <div>
        {/*Hintergrundbild */}

        <div>
          {srcImgB && cropupB ? (
            <div className="cropOverlayBI">
              <div className="cropBI">
                <ReactCrop
                  className="cropperBI"
                  src={srcImgB}
                  onImageLoaded={setImageB}
                  crop={cropB}
                  onChange={setCropB}
                />
                <div className="cropUploadBtn" onClick={getCroppedImgB}>
                  übernehmen.
                </div>
                <div className="stopCrop" onClick={toggleCropupB}>
                  abbrechen
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="sectionBI">
          {toggleScreen ? (
            <div />
          ) : (
            <div
              className="settingsDelete"
              onClick={() => deleteBackgroundImg(uid)}
            >
              <span className="settingsDeleteSpan">
                Hintergrundbild löschen
              </span>
            </div>
          )}
          {toggleScreen ? (
            <div />
          ) : (
            <label htmlFor="bi" className="settingsInputMTop">
              <span className="settingsInputSpan">Hintergrundbild ändern</span>
            </label>
          )}

          <label htmlFor="bi" className="customFileInputBI">
            {toggleScreen ? (
              <Link to="/einstellungen/profil">
                <img className="BI" src={backgroundImg} alt="" />
              </Link>
            ) : (
              <div>
                <input
                  id="bi"
                  className="einrichtungFileInputBI"
                  type="file"
                  onChange={handleImageB}
                  onClick={(e) => cropAbbruch(e)}
                ></input>
                <img className="settingsBI" src={backgroundImg} alt="" />
              </div>
            )}
          </label>
        </div>

        {/*Profilbild */}

        <div>
          {srcImg && cropup ? (
            <div className="cropOverlayPI">
              <div className="cropPI">
                <ReactCrop
                  className="cropperPI"
                  src={srcImg}
                  onImageLoaded={setImage}
                  crop={crop}
                  onChange={setCrop}
                  circularCrop="true"
                />
                <div className="cropUploadBtn" onClick={getCroppedImg}>
                  übernehmen.
                </div>
                <div className="stopCrop" onClick={toggleCropup}>
                  abbrechen
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="sectionPI">
          <label htmlFor="pi" className="customFileInputPI">
            {toggleScreen ? (
              <Link to="einstellungen/profil">
                <img className="PI" src={profileImg} alt="" />
              </Link>
            ) : (
              <div>
                <input
                  id="pi"
                  className="einrichtungFileInputPI"
                  type="file"
                  onChange={handleImage}
                  onClick={(e) => cropAbbruch(e)}
                ></input>
                <img className="settingsPI" src={profileImg} alt="" />
              </div>
            )}
          </label>
          {toggleScreen ? (
            <div />
          ) : (
            <label htmlFor="pi" className="settingsInputMBot">
              <span className="settingsInputSpan">Profilbild ändern</span>
            </label>
          )}
        </div>
        {toggleScreen ? (
          <div />
        ) : (
          <div className="settingsDelete" onClick={() => deleteProfileImg(uid)}>
            <span className="settingsDeleteSpan">Profilbild löschen</span>
          </div>
        )}
      </div>
    </>
  );
}
export default ProfileImage;
