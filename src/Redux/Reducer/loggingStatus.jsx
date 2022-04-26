import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const uidReducer = (state = "", action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return (state = firebase.auth().currentUser.uid);
    default:
      return state;
  }
};

export default uidReducer;
