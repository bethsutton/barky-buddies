import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function BuddyPageSessionItem({ buddy, buddyId, session, sessionId }) {
  // const date = session.date.toDate().toDateString();
  // const time = session.date.toDate().toLocaleTimeString('en-US');
  // console.log(session.date);

  return (
    <li className="categoryListing">
      <div className="categoryListingDetails">
        <div className="categoryListingInfoDiv">
          <p className="categoryListingInfoText">Where: {session.location}</p>
          <p className="categoryListingInfoText">
            When: {session.date} at {session.time}
          </p>
          <div className="wanted-button">
            <p className="wanted-button-text">
              {session.buddyWanted === 'excited'
                ? `I want an ${session.buddyWanted} buddy!`
                : `I want a ${session.buddyWanted} buddy!`}
            </p>
          </div>
          <Link to={`/${buddyId}/${sessionId}`} className="mapButton">
            See Map
          </Link>
        </div>
      </div>
    </li>
  );
}

export default BuddyPageSessionItem;
