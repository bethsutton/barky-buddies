import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';

function Buddy() {
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);

  // INITIALIZE HOOKS
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchBuddy = async () => {
      const docRef = doc(db, 'buddies', params.buddyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setBuddy(docSnap.data());
        setLoading(false);
      }
    };

    fetchBuddy();
  }, [navigate, params.buddyId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* SLIDER */}

      {/* ABOUT SECTION */}
      <div className="about-section">
        <div className="type-button about-type-button">
          <p className="type-button-text">I am {buddy.type}!</p>
        </div>
        <p className="pageTitle">About {buddy.name}</p>
        <div className="about-page-info">
          {/* <p className="categoryListingInfoText">Triggers: </p> */}
          <p className="about-page-info-text">Space needed: {buddy.needs}</p>
          <p className="about-page-info-text">Goal: {buddy.goal}</p>
        </div>
      </div>

      {/* SESSION DETAILS */}

      {/* SESSION LOCATION */}

      {/* CONTACT MY PARENT BUTTON */}
      {auth.currentUser?.uid !== buddy.userRef && (
        <Link
          to={`/contact/${buddy.userRef}?buddyName=${buddy.name}`}
          className="primaryButton"
        >
          Contact my parent
        </Link>
      )}
    </main>
  );
}

export default Buddy;
