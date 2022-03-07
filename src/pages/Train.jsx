import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import SessionItem from '../components/SessionItem';

function Train() {
  const [buddies, setBuddies] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        // GET BUDDIES
        const buddiesRef = collection(db, 'buddies');

        // CREATE A QUERY
        const q = query(
          buddiesRef,
          where('session', '==', true),
          // where('session.length', '>', 0)
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // EXECUTE QUERY
        const querySnap = await getDocs(q);

        // const lastVisible = querySnap.docs[querySnap.docs.length - 1];

        // INITIALIZE EMPTY LISTINGS ARRAY
        const buddies = [];

        // FOR EACH DOC IN QUERY SNAPSHOT,
        querySnap.forEach((doc) => {
          return buddies.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBuddies(buddies);

        // GET SESSIONS
        const sessionsRef = collection(db, 'sessions');

        // CREATE A QUERY
        const secondQ = query(
          sessionsRef,
          orderBy('timestamp', 'desc'),
          limit(10)
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
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch buddies');
        console.log(error);
      }
    };

    fetchBuddies();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageTitle">Training Sessions</p>
      </header>
      {loading ? (
        <Spinner />
      ) : buddies && buddies.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {buddies.map((buddy) =>
                sessions.map(
                  (session) =>
                    buddy.id === session.data.buddyId && (
                      <SessionItem
                        buddy={buddy.data}
                        id={buddy.id}
                        key={buddy.id}
                        session={session.data}
                      />
                    )
                )
              )}
            </ul>
          </main>
          <br />
          <br />
          {/* {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )} */}
        </>
      ) : (
        <p>No training sessions</p>
      )}
    </div>
  );
}

export default Train;
