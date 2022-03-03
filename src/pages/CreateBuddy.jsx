import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';

function CreateBuddy() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'neutral',
    name: '',
    // triggers: '',
    // needs: '',
    // goals: '',
    age: 1,
    images: {},
  });

  const {
    type,
    name,
    // triggers,
    // needs,
    // goals,
    age,
    images,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images');
      return;
    }

    // STORE SINGLE IMAGE IN FIREBASE
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, 'buddies'), formDataCopy);

    setLoading(false);

    toast.success('Dog added');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    // FILES
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // TEXT / BOOLEANS / NUMBERS
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageTitle">Add a Dog</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          {/* DOG TYPE */}
          <label className="formLabel">My dog is...</label>
          <div className="formButtons formType">
            {/* REACTIVE BUTTON */}
            <button
              type="button"
              className={
                type === 'reactive' ? 'formButtonActive' : 'formButton'
              }
              id="type"
              value="reactive"
              onClick={onMutate}
            >
              Reactive
            </button>
            {/* EXCITED BUTTON */}
            <button
              type="button"
              className={type === 'excited' ? 'formButtonActive' : 'formButton'}
              id="type"
              value="excited"
              onClick={onMutate}
            >
              Excited
            </button>
          </div>
          <div className="formButtons formType">
            {/* BABY BUTTON */}
            <button
              type="button"
              className={type === 'baby' ? 'formButtonActive' : 'formButton'}
              id="type"
              value="baby"
              onClick={onMutate}
            >
              Younger than
              <br />6 months
            </button>
            {/* NEUTRAL BUTTON */}
            <button
              type="button"
              className={type === 'neutral' ? 'formButtonActive' : 'formButton'}
              id="type"
              value="neutral"
              onClick={onMutate}
            >
              Neutral
            </button>
          </div>

          {/* NAME */}
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="1"
            required
          />

          {/* AGE */}
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Age</label>
              <input
                className="formInputSmall"
                type="number"
                id="age"
                value={age}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          {/* IMAGES */}
          <label className="formLabel">Pictures of your dog</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />

          {/* CREATE LISTING BUTTON */}
          <button type="submit" className="primaryButton createListingButton">
            Add dog
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateBuddy;
