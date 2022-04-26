import { combineReducers } from "redux";
import uidReducer from "./loggingStatus";

const allReducers = combineReducers({
  uidReducer,
});

export default allReducers;
