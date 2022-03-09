import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import {
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Session() {
  const [buddy, setBuddy] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // INITIALIZE HOOKS
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchSessionInfo = async () => {
      const docRef = doc(db, 'sessions', params.sessionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setSession(docSnap.data());
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, [navigate, params.sessionId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="buddy-page">
      {/* SESSION DETAILS */}

      <div className="about-section">
        <p className="pageTitle">{session.location}</p>
      </div>

      <Link to={`/${params.buddyId}`} className="primaryButton">
        Back to Buddy Page
      </Link>
    </main>
  );
}

export default Session;
