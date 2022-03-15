import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit, FaMapMarkedAlt } from 'react-icons/fa';

function BuddyPageSessionItem({ buddy, buddyId, session, sessionId, index }) {
  // GET YEAR, MONTH, AND DATE
  let year = session.date.substr(0, 4);
  let month = session.date.substr(5, 2);
  let day = session.date.substr(8);

  // CONVERT TIME FROM MILITARY TO STANDARD
  var time = session.time;

  time = time.split(':');

  var hours = Number(time[0]);
  var minutes = Number(time[1]);

  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = '' + hours;
  } else if (hours > 12) {
    timeValue = '' + (hours - 12);
  } else if (hours == 0) {
    timeValue = '12';
  }

  timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
  timeValue += hours >= 12 ? 'pm' : 'am';

  return (
    <li className="categoryListing">
      <div className="categoryListingDetails">
        <p className="trainingSessionTitle">Training Session #{index + 1}</p>
        <div className="categoryListingInfoDiv">
          <p className="categoryListingInfoText">Where: {session.location}</p>
          <p className="categoryListingInfoText">
            When: {`${month}/${day}/${year}`} at {timeValue}
          </p>
          <div className="wanted-button">
            <p className="wanted-button-text">
              {session.buddyWanted === 'excited'
                ? `I need an ${session.buddyWanted} buddy!`
                : `I need a ${session.buddyWanted} buddy!`}
            </p>
          </div>
        </div>
        <Link
          to={`/${buddyId}/${sessionId}`}
          className="mapButton sessionItemMapButton"
        >
          <FaMapMarkedAlt /> See map
        </Link>
      </div>
    </li>
  );
}

export default BuddyPageSessionItem;
