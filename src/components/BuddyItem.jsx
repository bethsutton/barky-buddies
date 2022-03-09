import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function BuddyItem({ buddy, id, onEdit, onDelete }) {
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
            <p className="categoryListingInfoText">Triggers: </p>
            <p className="categoryListingInfoText">Needs: {buddy.needs}</p>
            <p className="categoryListingInfoText">Goal: {buddy.goal}</p>
            <div className="type-button">
              <p className="type-button-text">I am {buddy.type}!</p>
            </div>
          </div>
        </div>
      </Link>

      {onDelete && (
        <FaTrash
          className="removeIcon"
          // fill="rgb(231,76,60)"
          onClick={() => onDelete(buddy.id, buddy.name)}
        />
      )}

      {onEdit && (
        <FaEdit
          className="editIcon"
          // fill="rgb(231,76,60)"
          onClick={() => onEdit(id)}
        />
      )}
    </li>
  );
}

export default BuddyItem;
