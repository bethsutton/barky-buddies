import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function SessionItem({ buddy, id, session, date }) {
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
            <p className="categoryListingInfoText">Where: {session.address}</p>
            <p className="categoryListingInfoText">When: {date}</p>
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

export default SessionItem;
