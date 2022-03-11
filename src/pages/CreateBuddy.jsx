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
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';

function CreateBuddy() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'neutral',
    name: '',
    // triggers: '',
    needs: '6 feet',
    goal: 'pass another dog calmly',
    age: 1,
    images: {},
    session: false,
  });

  const {
    type,
    name,
    // triggers,
    needs,
    goal,
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
          // USER ID ADDED TO FORM DATA
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    navigate(`/${docRef.id}`);
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

          {/* NEEDS */}
          <label className="formLabel">
            How much space does your dog need from a buddy?
          </label>
          <div className="formButtons formType">
            {/* 6FT BUTTON */}
            <button
              type="button"
              className={needs === '6 feet' ? 'formButtonActive' : 'formButton'}
              id="needs"
              value="6 feet"
              onClick={onMutate}
            >
              6 feet
            </button>
            {/* ACROSS THE STREET BUTTON */}
            <button
              type="button"
              className={
                needs === 'across the street'
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id="needs"
              value="across the street"
              onClick={onMutate}
            >
              Across the street
            </button>
          </div>
          <div className="formButtons formType">
            {/* ONE BLOCK BUTTON */}
            <button
              type="button"
              className={
                needs === 'a football field' ? 'formButtonActive' : 'formButton'
              }
              id="needs"
              value="a football field"
              onClick={onMutate}
            >
              A football field
            </button>
            {/* NO SPACE NEEDED BUTTON */}
            <button
              type="button"
              className={
                needs === 'no space needed' ? 'formButtonActive' : 'formButton'
              }
              id="needs"
              value="no space"
              onClick={onMutate}
            >
              No space needed
            </button>
          </div>

          {/* GOAL */}
          <label className="formLabel">
            What is your current goal for your dog?
          </label>
          <div className="formButtons formType">
            {/* PASS A DOG BUTTON */}
            <button
              type="button"
              className={
                goal === 'pass another dog calmly'
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id="goal"
              value="pass another dog calmly"
              onClick={onMutate}
            >
              Pass another dog calmly
            </button>
          </div>
          <div className="formButtons formType">
            {/* GREET A DOG BUTTON */}
            <button
              type="button"
              className={
                goal === 'greet another dog calmly'
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id="goal"
              value="greet another dog calmly"
              onClick={onMutate}
            >
              Greet another dog calmly
            </button>
          </div>
          <div className="formButtons formType">
            {/* OUTSIDE HOME BUTTON */}
            <button
              type="button"
              className={
                goal === 'calmly watch a dog pass our house'
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id="goal"
              value="calmly watch a dog pass our house"
              onClick={onMutate}
            >
              Calmly watch a dog pass our house
            </button>
          </div>
          <div className="formButtons formType">
            {/* WALK AWAY BUTTON */}
            <button
              type="button"
              className={
                goal === 'walk away from a barking dog'
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id="goal"
              value="walk away from a barking dog"
              onClick={onMutate}
            >
              Walk away from a barking dog
            </button>
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

          {/* CREATE BUDDY BUTTON */}
          <button type="submit" className="primaryButton createListingButton">
            Add my buddy
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateBuddy;
