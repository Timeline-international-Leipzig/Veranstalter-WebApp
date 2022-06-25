import React, { Component, useEffect, useState, useRef } from "react";
//import QrReader from "react-qr-scanner";
import { QrReader } from "react-qr-reader";
import firebase from "firebase/compat/app";
import Fb from "./fbVariables";

function QrCodeScanner({ disableScanner, eventId }) {
  //console.log(eventId);
  const [data, setData] = useState("No result");

  function checkUserData(result) {
    firebase
      .firestore()
      .collection(Fb.COM_EVENTS)
      .doc(eventId)
      .collection(result)
      .get()
      .then(() => {});
  }

  return (
    <div>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            console.log(result);
            disableScanner();
            // checkUserData(result);
          }

          if (error) console.log(error);
        }}
        scanDelay="1000"
        //style={{ width: "100%" }}
      />
      <p>{data}</p>
    </div>
  );
}
export default QrCodeScanner;
/*
export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
    };

    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    console.log(data);
    this.setState({
      result: data,
    });
  }
  handleError(err) {
    console.error(err);
  }
  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          constraints={{
            facingMode: "rear",
          }}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}
*/
