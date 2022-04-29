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

function CreateEvent() {
  const uid = useSelector((state) => state.uidReducer);
}
export default CreateEvent;
