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

// ICONS
import { FaEdit } from 'react-icons/fa';

function Profile() {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  const [buddies, setBuddies] = useState(null);
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

      console.log(auth.currentUser);

      querySnap.forEach((doc) => {
        return buddies.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBuddies(buddies);
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

  // const onEdit = (listingId) => {
  //   navigate(`/edit-listing/${listingId}`);
  // };

  // const onDelete = async (listingId) => {
  //   if (window.confirm('Are you sure you want to delete this listing')) {
  //     await deleteDoc(doc(db, 'listings', listingId));
  //     const updatedListings = listings.filter(
  //       (listing) => listing.id !== listingId
  //     );
  //     setListings(updatedListings);
  //     toast.success('Your listing was successfully deleted');
  //   }
  // };

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
      </main>
    </div>
  );
}

export default Profile;

// const auth = getAuth();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: auth.currentUser.displayName,
//     email: auth.currentUser.email,
//   });

//   const { name, email } = formData;

//   const navigate = useNavigate();

//   const onLogout = () => {
//     auth.signOut();
//     navigate('/');
//   };

//   return (
//     <div className="profile">
//       <header className="pageTitle">
//         <p className="pageHeader">My Profile</p>
//         <button type="button" className="logOut" onClick={onLogout}>
//           Logout
//         </button>
//       </header>
//       <main></main>
//     </div>
//   );
