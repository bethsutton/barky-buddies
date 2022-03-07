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
  addDoc,
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
  const [loading, setLoading] = useState(false);
  const [buddies, setBuddies] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    date: '',
    buddyId: '',
    buddyWanted: 'neutral',
  });

  const { address, date, buddyId, buddyWanted } = formData;

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

    if (buddies.length === 0) {
      setLoading(false);
      toast.error('Add a dog to create a training session');
      return;
    }

    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'sessions'), formDataCopy);

    setLoading(false);

    toast.success('Training session added');
    navigate(`/train/${docRef.id}`);
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

// Find Buddy for (query buddies, input buddy ID with session details)
// Set buddy session = true when creating session
// When removing, remove session = true from buddy in buddies

// Make buddies.session an array
// Have array contain session.id
// when delete, delete by session.id
