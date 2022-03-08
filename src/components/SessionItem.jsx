import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function SessionItem({ buddy, id, session }) {
  // const date = session.date.toDate().toDateString();
  // const time = session.date.toDate().toLocaleTimeString('en-US');
  // console.log(session.date);

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
              {/* When: {session.date} at {session.time} */}
            </p>
            <div className="type-button">
              <p className="type-button-text">I am {buddy.type}!</p>
            </div>
            <div className="wanted-button">
              <p className="wanted-button-text">
                I want a {session.buddyWanted} buddy!
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* {onDelete && (
        <FaTrash
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )} */}

      {/* {onEdit && (
        <FaEdit
          className="editIcon"
          // fill="rgb(231,76,60)"
          onClick={() => onEdit(id)}
        />
      )} */}
    </li>
  );
}

export default SessionItem;
