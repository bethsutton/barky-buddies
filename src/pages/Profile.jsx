import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

import BuddyItem from '../components/BuddyItem';
import SessionItem from '../components/SessionItem';

// ICONS
import { FaEdit } from 'react-icons/fa';

function Profile() {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  const [buddies, setBuddies] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

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

      // GET SESSIONS
      const sessionsRef = collection(db, 'sessions');

      // CREATE A QUERY
      const secondQ = query(
        sessionsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
        // limit(10)
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
    };
    fetchUserBuddies();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // UPDATE DISPLAY NAME IN FIREBASE
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // UPDATE IN FIRESTORE
        const userRef = doc(db, 'users', auth.currentUser.uid);

        await updateDoc(userRef, {
          name: name,
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onEdit = (buddyId) => {
    navigate(`/edit-buddy/${buddyId}`);
  };

  const onDelete = async (buddyId) => {
    if (window.confirm('Are you sure you want to remove this dog')) {
      await deleteDoc(doc(db, 'buddies', buddyId));
      const updatedBuddies = buddies.filter((buddy) => buddy.id !== buddyId);
      setBuddies(updatedBuddies);
      toast.success('Your dog was successfully removed from your list');
    }
  };

  const onCancel = async (sessionId) => {
    if (
      window.confirm('Are you sure you want to cancel this practice session')
    ) {
      await deleteDoc(doc(db, 'sessions', sessionId));
      const updatedSessions = sessions.filter(
        (session) => session.id !== sessionId
      );
      setSessions(updatedSessions);
      toast.success('Your training session was successfully canceled');
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageTitle">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : <FaEdit />}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <br></br>

        {/* MY SESSIONS */}
        {!loading && sessions?.length > 0 && (
          <>
            <p className="pageTitle">My Training Sessions</p>
            <ul className="myDogsList">
              {buddies.map((buddy) =>
                sessions.map(
                  (session) =>
                    buddy.id === session.data.buddyId && (
                      <SessionItem
                        buddy={buddy.data}
                        id={buddy.id}
                        key={session.id}
                        session={session.data}
                        sessionId={session.id}
                        onCancel={() => onCancel(session.id)}
                      />
                    )
                )
              )}
            </ul>
          </>
        )}

        <br></br>

        {/* CREATE A SESSION */}
        <Link to="/create-session" className="primaryButton">
          Add a training session
        </Link>

        <br></br>

        {/* MY DOGS */}
        {!loading && buddies?.length > 0 && (
          <>
            <p className="pageTitle">My Dogs</p>
            <ul className="myDogsList">
              {buddies.map((buddy) => (
                <BuddyItem
                  key={buddy.id}
                  buddy={buddy.data}
                  id={buddy.id}
                  onDelete={() => onDelete(buddy.id)}
                  onEdit={() => onEdit(buddy.id)}
                />
              ))}
            </ul>
          </>
        )}

        <br></br>

        {/* CREATE A BUDDY */}
        <Link to="/create-buddy" className="primaryButton">
          Add another dog
        </Link>
      </main>
    </div>
  );
}

export default Profile;
