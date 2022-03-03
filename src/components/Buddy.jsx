import React from 'react';
import { Link } from 'react-router-dom';
// ICONS
import { FaTrash, FaEdit } from 'react-icons/fa';

function Buddy({ buddy, id }) {
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
          <p className="categoryListingLocation">{buddy.name}</p>
          <p className="categoryListingName">{buddy.age}</p>
          <div className="categoryListingInfoDiv">
            <p>Goal: {buddy.goal}</p>
            <p>Needs: {buddy.needs[0]}</p>
          </div>
        </div>
      </Link>

      {/* {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )} */}

      {/* {onEdit && (
        <EditIcon
          className="editIcon"
          // fill="rgb(231,76,60)"
          onClick={() => onEdit(id)}
        />
      )} */}
    </li>
  );
}

export default Buddy;
