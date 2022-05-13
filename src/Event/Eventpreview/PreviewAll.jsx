import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultBI from "../../Images/DefaultBI.jpeg";
import Star from "../../IconComponents/Star";
import Star2 from "../../IconComponents/Star2";

function PreviewAll(props) {
  const eventInfos = props.events;
  const highlightIds = props.highlightIds;

  const addHighlight = props.addHighlight;
  const removeHighlight = props.removeHighlight;

  return (
    <div>
      {eventInfos.map((eventInfo) => (
        <div key={eventInfo.id}>
          <div className="circleWrapper">
            <div className="dateLine">
              <div className="circle"></div>
              <span className="previewDate">{eventInfo.startDate}</span>
              <span>
                {eventInfo.endDate === eventInfo.startDate ? (
                  <span></span>
                ) : (
                  <span className="previewDate2">- {eventInfo.endDate}</span>
                )}
              </span>
              <div className="vertical"></div>
            </div>

            <Link
              className="previewLink"
              to={{
                pathname: "event/" + eventInfo.id,
              }}
            >
              {eventInfo.coverPic === "" ? (
                <img src={DefaultBI} className="previewImg" alt="" />
              ) : (
                <img src={eventInfo.coverPic} className="previewImg" alt="" />
              )}
            </Link>

            {highlightIds.includes(eventInfo.id) ? (
              <div>
                <div
                  className="highlightStar"
                  onClick={() => removeHighlight(eventInfo.id)}
                >
                  <Star2 className="starIcon" />
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="highlightStar"
                  onClick={() => addHighlight(eventInfo.id)}
                >
                  <Star className="starIcon" />
                </div>
              </div>
            )}
          </div>

          <div className="previewTitle">
            <span className="previewTitle">{eventInfo.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default PreviewAll;
