import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultBI from "../../Images/DefaultBI.jpeg";
import Star from "../../IconComponents/Star";
import Star2 from "../../IconComponents/Star2";
import _ from "lodash";

function PreviewUpcoming(props) {
  const eventInfos = props.events;
  const highlightIds = props.highlightIds;

  const addHighlight = props.addHighlight;
  const removeHighlight = props.removeHighlight;

  const [filteredArray, setFilteredArray] = useState();

  useEffect(() => {
    filterUpcomingArray();
  }, [eventInfos]);

  function filterUpcomingArray() {
    const time = new Date().getTime();

    const filterArray = eventInfos.filter((start) => start.startStamp > time);
    setFilteredArray(filterArray);
  }

  return (
    <div>
      {_.isEmpty(filteredArray) ? null : (
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
                      <span className="previewDate2">
                        - {eventInfo.endDate}
                      </span>
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
                    <img
                      src={eventInfo.coverPic}
                      className="previewImg"
                      alt=""
                    />
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
      )}
    </div>
  );
}
export default PreviewUpcoming;
