import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function BuddyItem({ buddy, id }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${buddy.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={buddy.imageUrls[0]}
          alt={buddy.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingName">{buddy.name}</p>
          <div className="categoryListingInfoDiv">
            {/* <p className="categoryListingInfoText">Triggers: </p> */}
            <p className="categoryListingInfoText">
              Space needed: {buddy.needs}
            </p>
            <p className="categoryListingInfoText">Goal: {buddy.goal}</p>
            <div className="type-button">
              <p className="type-button-text">I am {buddy.type}!</p>
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

export default BuddyItem;
