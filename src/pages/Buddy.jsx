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
import BuddyPageSessionItem from '../components/BuddyPageSessionItem';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Buddy() {
  const [buddy, setBuddy] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);

  // INITIALIZE HOOKS
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchBuddyInfo = async () => {
      const docRef = doc(db, 'buddies', params.buddyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setBuddy(docSnap.data());
        setLoading(false);
      }

      // GET SESSIONS
      const sessionsRef = collection(db, 'sessions');

      // CREATE A QUERY
      const secondQ = query(
        sessionsRef,
        where('buddyId', '==', params.buddyId),
        orderBy('timestamp', 'desc')
      );

      // EXECUTE QUERY
      const secondQuerySnap = await getDocs(secondQ);

      // const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      // INITIALIZE EMPTY LISTINGS ARRAY
      const sessions = [];

      // FOR EACH DOC IN QUERY SNAPSHOT,
      secondQuerySnap.forEach((doc) => {
        return sessions.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSessions(sessions);
    };

    fetchBuddyInfo();
  }, [navigate, params.buddyId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="buddy-page">
      {/* SLIDER */}
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
      >
        {buddy.imageUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${buddy.imageUrls[index]}) no-repeat center`,
                backgroundSize: 'cover',
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ABOUT SECTION */}
      <div className="about-section">
        <div className="type-button about-type-button buddy-page-type-button">
          <p className="type-button-text">I am {buddy.type}!</p>
        </div>
        <p className="pageTitle">About {buddy.name}</p>
        <ul className="about-page-info">
          {/* <p className="categoryListingInfoText">Triggers: </p> */}
          <li className="about-page-info-text">
            {buddy.name} is {buddy.age} {buddy.age === 1 ? 'year' : 'years'} old
          </li>
          <li className="about-page-info-text">
            {buddy.name} needs {buddy.needs} of space from another dog
          </li>
          <li className="about-page-info-text">
            {buddy.name}'s goal is to {buddy.goal}
          </li>
        </ul>
      </div>

      {/* SESSION DETAILS */}
      {!loading && sessions?.length > 0 && (
        <div className="about-section">
          <p className="pageTitle">{buddy.name}'s Upcoming Training Sessions</p>
          <ul className="myDogsList">
            {sessions.map((session, index) => (
              <BuddyPageSessionItem
                buddy={buddy}
                buddyId={params.buddyId}
                key={session.id}
                session={session.data}
                sessionId={session.id}
                index={index}
              />
            ))}
          </ul>
        </div>
      )}

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
