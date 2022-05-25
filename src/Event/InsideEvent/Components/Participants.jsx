import React, { useState } from "react";
import _ from "lodash";
import DefaultPI from "../../../Images/DefaultPI.jpeg";
import ParticipantIcon from "../../../IconComponents/ParticipantIcon";
import { Link } from "react-router-dom";

function Participants({ participantArray }) {
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  return (
    <div className="participantCont">
      {!_.isEmpty(participantArray) && (
        <div className="participantAlign">
          {participantArray.slice(0, 4).map((info) => (
            <Link
              to={{
                pathname: "/" + info.username,
                state: {
                  userInfo: info,
                },
              }}
              key={info.uid}
            >
              {info.profileImageId === "" ? (
                <img
                  className="insideParticipant2"
                  src={DefaultPI}
                  alt=""
                ></img>
              ) : (
                <img
                  className="insideParticipant2"
                  src={info.profileImageId}
                  alt=""
                ></img>
              )}
            </Link>
          ))}
          {participantArray > 4 && (
            <div>
              <button
                onClick={() =>
                  setShowAllParticipants((prevState) => !prevState)
                }
              >
                show all
              </button>
            </div>
          )}
          {showAllParticipants && (
            <div className="particiPantOverlay">
              <div className="participantPopup">
                {participantArray.slice(0, 4).map((info) => (
                  <Link
                    to={{
                      pathname: "/" + info.username,
                      state: {
                        userInfo: info,
                      },
                    }}
                    key={info.uid}
                  >
                    {info.profileImageId === "" ? (
                      <img
                        className="insideParticipant2"
                        src={DefaultPI}
                        alt=""
                      ></img>
                    ) : (
                      <img
                        className="insideParticipant2"
                        src={info.profileImageId}
                        alt=""
                      ></img>
                    )}
                  </Link>
                ))}
                <div
                  className="closeParticipantPopup"
                  onClick={() =>
                    setShowAllParticipants((prevState) => !prevState)
                  }
                >
                  <span>schließen</span>
                </div>
              </div>
            </div>
          )}
          {participantArray.length > 4 && (
            <div className="moreContacts">
              <img
                src={<ParticipantIcon />}
                className="contactPicMore"
                onClick={() =>
                  setShowAllParticipants((prevState) => !prevState)
                }
              ></img>
              <div className="contactNameSpan2">
                <span> mehr</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Participants;
