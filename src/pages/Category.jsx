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
// import ListingItem from '../components/ListingItem';

function Category() {
  const [buddies, setBuddies] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [lastFetchedListing, setLastFetchedListing] = useState(null);

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
          limit(10)
        );

        // EXECUTE QUERY
        const querySnap = await getDocs(q);

        // FIND LAST VISIBLE LISTING
        // const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        // setLastFetchedListing(lastVisible);

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
  // const onFetchMoreListings = async () => {
  //   try {
  //     const listingsRef = collection(db, 'listings');

  //     const q = query(
  //       listingsRef,
  //       where('type', '==', params.categoryName),
  //       orderBy('timestamp', 'desc'),
  //       startAfter(lastFetchedListing),
  //       limit(10)
  //     );

  //     const querySnap = await getDocs(q);

  //     const lastVisible = querySnap.docs[querySnap.docs.length - 1];
  //     setLastFetchedListing(lastVisible);

  //     const listings = [];

  //     querySnap.forEach((doc) => {
  //       return listings.push({
  //         id: doc.id,
  //         data: doc.data(),
  //       });
  //     });

  //     setListings((prevState) => [...prevState, ...listings]);
  //     setLoading(false);
  //   } catch (error) {
  //     toast.error('Could not fetch listings');
  //   }
  // };

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
                // <ListingItem
                //   listing={listing.data}
                //   id={listing.id}
                //   key={listing.id}
                // />
                <p key={buddy.id}>{buddy.data.name}</p>
              ))}
            </div>
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
        <p>There are no {params.buddyType} buddies ready to practice</p>
      )}
    </div>
  );
}

export default Category;
