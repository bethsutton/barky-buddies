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
import BuddyItem from '../components/BuddyItem';

function Category() {
  const [buddies, setBuddies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedBuddy, setLastFetchedBuddy] = useState(null);

  // GET BUDDY TYPE FROM URL
  const params = useParams();

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        // GET REFERENCE
        const buddiesRef = collection(db, 'buddies');

        // CREATE A QUERY
        const q = query(
          buddiesRef,
          where('type', '==', params.buddyType),
          orderBy('timestamp', 'desc'),
          limit(5)
        );

        // EXECUTE QUERY
        const querySnap = await getDocs(q);

        // FIND LAST VISIBLE LISTING
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedBuddy(lastVisible);

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
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch buddies');
      }
    };

    fetchBuddies();
  }, [params.buddyType]);

  // PAGINATION / LOAD MORE LISTINGS
  const onFetchMoreBuddies = async () => {
    try {
      const buddiesRef = collection(db, 'buddies');

      const q = query(
        buddiesRef,
        where('type', '==', params.buddyType),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedBuddy),
        limit(5)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedBuddy(lastVisible);

      const buddies = [];

      querySnap.forEach((doc) => {
        return buddies.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBuddies((prevState) => [...prevState, ...buddies]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch more buddies');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageTitle">
          {params.buddyType[0].toUpperCase() + params.buddyType.substring(1)}{' '}
          Buddies
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : buddies && buddies.length > 0 ? (
        <>
          <main>
            <div className="categoryListings">
              {buddies.map((buddy) => (
                <BuddyItem buddy={buddy.data} id={buddy.id} key={buddy.id} />
              ))}
            </div>
          </main>

          <br />
          <br />
          {lastFetchedBuddy && (
            <p className="loadMore" onClick={onFetchMoreBuddies}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>We couldn't find any {params.buddyType} buddies</p>
      )}
    </div>
  );
}

export default Category;
