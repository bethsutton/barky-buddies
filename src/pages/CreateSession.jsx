import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  doc,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';

function CreateSession() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [buddies, setBuddies] = useState(null);
  // const [buddy, setBuddy] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    date: '',
    time: '',
    buddyId: '',
    buddyWanted: 'neutral',
    latitude: 0,
    longitude: 0,
  });

  const { address, date, buddyId, buddyWanted, latitude, longitude } = formData;

  const navigate = useNavigate();
  const isMounted = useRef(true);
  const auth = getAuth();

  // CHECK IF LOGGED IN THEN ADD USER ID TO FORM DATA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({ ...formData, userRef: user.uid });
        setLoggedIn(true);
      } else {
        navigate('/sign-in');
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

  // FETCHES USER'S BUDDIES
  useEffect(() => {
    const fetchUserBuddies = async () => {
      const buddiesRef = collection(db, 'buddies');

      const q = query(
        buddiesRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      let buddies = [];

      // console.log(auth.currentUser);

      querySnap.forEach((doc) => {
        return buddies.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBuddies(buddies);
      console.log(buddies);
      setLoading(false);
    };

    if (loggedIn) {
      fetchUserBuddies();
    }
  }, [auth, loggedIn]);

  // HANDLES THE SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // GEOLOCATION
    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCUGNfJY7bXN1crJh-3tZEcf6LuQFXSM5w`
      );

      // ${process.env.REACT_APP_GEOCODE_API_KEY}

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address;

      console.log(geolocation, location);

      if (location === undefined || location.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a correct address');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const formDataCopy = {
      ...formData,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.address;
    const docRef = await addDoc(collection(db, 'sessions'), formDataCopy);

    // ADD SESSION ID TO SESSION ARRAY IN FOR BUDDY BUDDIES COLLECTION
    const secondDocRef = doc(db, 'buddies', buddyId);
    await updateDoc(secondDocRef, {
      sessions: arrayUnion(docRef.id),
    });

    // Atomically add a new region to the "regions" array field.
    // await updateDoc(washingtonRef, {
    //   regions: arrayUnion("greater_virginia")
    // });

    // Atomically remove a region from the "regions" array field.
    // await updateDoc(washingtonRef, {
    //   regions: arrayRemove("east_coast")
    // });

    setLoading(false);

    toast.success('Training session added');
    navigate(`/${buddyId}`);
  };

  // HANDLES WHEN FORM DATA IS CHOSEN
  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  // HANDLES WHEN BUDDY IS SELECTED
  // const handleBuddySelection = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     buddyId: e.target.value,
  //   }));
  //   setBuddy(e.target.value)
  //   console.log(formData);
  // };

  if (loading) {
    return <Spinner />;
  }

  if (buddies === null) {
    return <Spinner />;
  }

  if (buddies.length === 0) {
    return (
      <div className="profile">
        <header>
          <p className="pageTitle">Add a Training Session</p>
        </header>
        <main>
          <p className="formLabel">Add a dog to create a training session</p>

          {/* CREATE A BUDDY */}
          <Link to="/create-buddy" className="primaryButton">
            Add a dog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="profile">
      <header>
        <p className="pageTitle">Add a Training Session</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          {/* FIND BUDDY FOR */}
          <label className="formLabel">Find a buddy for...</label>
          {buddies.map((buddy) => (
            <div className="formButtons formType" key={buddy.id}>
              <button
                type="button"
                className={
                  buddy.id === buddyId ? 'formButtonActive' : 'formButton'
                }
                id="buddyId"
                value={buddy.id}
                onClick={onMutate}
              >
                {buddy.data.name}
              </button>
            </div>
          ))}

          {/* BUDDY WANTED */}
          <label className="formLabel">I am looking for a...</label>
          <div className="formButtons formType">
            {/* REACTIVE BUTTON */}
            <button
              type="button"
              className={
                buddyWanted === 'reactive' ? 'formButtonActive' : 'formButton'
              }
              id="buddyWanted"
              value="reactive"
              onClick={onMutate}
            >
              Reactive Buddy
            </button>
            {/* EXCITED BUTTON */}
            <button
              type="button"
              className={
                buddyWanted === 'excited' ? 'formButtonActive' : 'formButton'
              }
              id="buddyWanted"
              value="excited"
              onClick={onMutate}
            >
              Excited Buddy
            </button>
          </div>
          <div className="formButtons formType">
            {/* BABY BUTTON */}
            <button
              type="button"
              className={
                buddyWanted === 'baby' ? 'formButtonActive' : 'formButton'
              }
              id="buddyWanted"
              value="baby"
              onClick={onMutate}
            >
              Baby Buddy
            </button>
            {/* NEUTRAL BUTTON */}
            <button
              type="button"
              className={
                buddyWanted === 'neutral' ? 'formButtonActive' : 'formButton'
              }
              id="buddyWanted"
              value="neutral"
              onClick={onMutate}
            >
              Neutral Buddy
            </button>
          </div>

          {/* ADDRESS */}
          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {/* DATE */}
          <label className="formLabel">Date</label>
          <input
            className="formInputAddress"
            type="date"
            id="date"
            name="date"
          ></input>

          {/* TIME */}
          <label className="formLabel">Time</label>
          <input
            className="formInputAddress"
            type="time"
            id="time"
            name="time"
          ></input>

          {/* CREATE LISTING BUTTON */}
          <button type="submit" className="primaryButton createListingButton">
            Add my training session
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateSession;

// Find Buddy for (query buddies, input buddy ID with session details) DONE
// Make buddies.session an array DONE
// Have array contain session.id DONE
// when delete, delete by session.id
