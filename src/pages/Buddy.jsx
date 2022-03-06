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
        console.log(docSnap.data());
        setBuddy(docSnap.data());
        setLoading(false);
      }
    };

    fetchBuddy();
  }, [navigate, params.buddyId]);

  return <div>Buddy</div>;
}

export default Buddy;
