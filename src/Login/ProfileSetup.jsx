import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "./Login.css";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import ReactCrop from "react-image-crop";
import "./ProfileSetup.css";
import "../Util/Repitition/Cropup.css";
import "react-image-crop/dist/ReactCrop.css";
import DefaultPI from "../Images/DefaultPI.jpeg";
import DefaultBI from "../Images/DefaultBI.jpeg";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import pathnames from "../Util/pathnames";
import Fb from "../Util/fbVariables";
import { useSelector } from "react-redux";

function ProfileSetup() {
  const uid = useSelector((state) => state.uidReducer);

  //const uid = firebase.auth().currentUser.uid;

  // Profile Image
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(DefaultPI);
  const [cropup, setCropup] = useState(false);

  const [loading, setLoading] = useState(false);

  const override = css`
    position: absolute;
    right: 15%;
    top: 33%;
  `;

  async function continueToProfile(e) {
    e.preventDefault();
    setLoading(true);
    await uploadBackgroundImg();
    await uploadProfileImg();
    window.location.href = pathnames.PROFILE;
  }

  // Crop & Upload Funktionen
  const cropAbbruch = (e) => {
    e.target.value = null;
  };

  const toggleCropup = () => {
    setCropup(!cropup);
  };

  const handleImage = (e) => {
    setSrcImg(URL.createObjectURL(e.target.files[0]));
    toggleCropup();
  };

  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    aspect: 1,
    width: 160,
    unit: "px",
    x: 170,
    y: 50,
  });

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

    const base64Image = canvas.toDataURL("image/jpeg", 1);
    setShowResult(base64Image);

    canvas.toBlob(
      (blob) => {
        setResult(blob);
        toggleCropup();
      },
      "image/jpeg",
      1
    );
  };

  async function uploadProfileImg() {
    const filename = uuidv4();

    if (!result) return;

    await firebase
      .storage()
      .ref(Fb.PROFILEPICS)
      .child(filename)
      .put(result)
      .then(async function () {
        await firebase
          .storage()
          .ref(Fb.PROFILEPICS)
          .child(filename)
          .getDownloadURL()
          .then(async (url) => {
            await firebase
              .firestore()
              .collection(Fb.ORGANIZERS)
              .doc(uid)
              .update({
                profileImageId: url,
              });
            return url;
          });
      })

      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Background Image
  const [resultB, setResultB] = useState();
  const [showResultB, setShowResultB] = useState(DefaultBI);
  const [cropupB, setCropupB] = useState(false);

  const toggleCropupB = () => {
    setCropupB(!cropupB);
  };

  const handleImageB = (e) => {
    setSrcImgB(URL.createObjectURL(e.target.files[0]));
    toggleCropupB();
  };

  const [srcImgB, setSrcImgB] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [cropB, setCropB] = useState({
    aspect: 20 / 10,
    unit: "px",
    width: 300,
    x: 100,
    y: 50,
  });

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

    const base64Image = canvas.toDataURL("image/jpeg", 1);
    setShowResultB(base64Image);

    canvas.toBlob(
      (blob) => {
        setResultB(blob);
        toggleCropupB();
      },
      "image/jpeg",
      1
    );
  };

  async function uploadBackgroundImg() {
    const filename = uuidv4();

    if (!resultB) return;
    await firebase
      .storage()
      .ref(Fb.TITLEPICS)
      .child(filename)
      .put(resultB)
      .then(async function () {
        await firebase
          .storage()
          .ref(Fb.TITLEPICS)
          .child(filename)
          .getDownloadURL()
          .then(async (url) => {
            await firebase
              .firestore()
              .collection(Fb.ORGANIZERS)
              .doc(uid)
              .update({
                titleImageId: url,
              });
            return url;
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  return (
    <div className="einrichtungSection">
      <div className="customInput">
        <label className="fileLabel" htmlFor="filePI">
          wähle ein Profilbild.
        </label>
      </div>

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
                übernehmen
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
        <label htmlFor="filePI" className="customFileInputPI">
          <input
            id="filePI"
            className="einrichtungFileInputPI"
            type="file"
            onChange={handleImage}
            onClick={(e) => cropAbbruch(e)}
          ></input>
          <img className="einrichtungPI" src={showResult} alt="" />
        </label>
      </div>

      <hr className="einrichtung-hr" />

      <div className="customInput">
        <label className="fileLabel" htmlFor="fileBI">
          wähle ein Hintergrundbild.
        </label>
      </div>

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
        <label htmlFor="fileBI" className="customFileInputBI">
          <input
            id="fileBI"
            className="einrichtungFileInputBI"
            type="file"
            onChange={handleImageB}
            onClick={(e) => cropAbbruch(e)}
          ></input>
          <img className="einrichtungBI" src={showResultB} alt="" />
        </label>
      </div>

      <hr className="einrichtung-hr" />

      {loading ? (
        <div className="weiterBtn" onClick={(e) => continueToProfile(e)}>
          <span>weiter</span>
          <ClipLoader
            className="clipLoad"
            color="skyblue"
            loading={loading}
            css={override}
            size={15}
          />
        </div>
      ) : (
        <div className="weiterBtn" onClick={(e) => continueToProfile(e)}>
          weiter
        </div>
      )}
    </div>
  );
}
export default ProfileSetup;
