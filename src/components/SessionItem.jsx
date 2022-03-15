import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function SessionItem({ buddy, id, session, onCancel }) {
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
      <Link to={`/${id}`} className="categoryListingLink">
        <img
          src={buddy.imageUrls[0]}
          alt={buddy.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingName">{buddy.name}</p>
          <div className="categoryListingInfoDiv">
            <p className="categoryListingInfoText">Where: {session.location}</p>
            <p className="categoryListingInfoText">
              When: {`${month}/${day}/${year}`} at {timeValue}
            </p>
            <div className="type-button">
              <p className="type-button-text">I am {buddy.type}!</p>
            </div>
            <div className="wanted-button">
              <p className="wanted-button-text">
                {session.buddyWanted === 'excited'
                  ? `I need an ${session.buddyWanted} buddy!`
                  : `I need a ${session.buddyWanted} buddy!`}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {onCancel && (
        <FaTrash
          className="removeIcon"
          // fill="rgb(231,76,60)"
          onClick={() => onCancel(session.id)}
        />
      )}
    </li>
  );
}

export default SessionItem;
