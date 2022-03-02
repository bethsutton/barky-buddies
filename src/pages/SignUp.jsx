import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ICONS
import { FaEye, FaArrowRight } from 'react-icons/fa';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../firebase.config';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import OAuth from '../components/OAuth';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // MAKE COPY OF FORM DATA FROM STATE
      const formDataCopy = { ...formData };
      // DELETE PASSWORD
      delete formDataCopy.password;
      // ADD TIMESTAMP AND SET TO SERVER TIMESTAMP
      formDataCopy.timestamp = serverTimestamp();
      // UPDATE DATABASE AND ADD USER TO USERS COLLECTION
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageTitle">Welcome!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            {/* NAME */}
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
            />
            {/* EMAIL */}
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            {/* PASSWORD */}
            <div className="passwordInputDiv">
              <input
                type={showPassword ? 'text' : 'password'}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              <FaEye
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            {/* SIGN UP BAR */}
            <div className="signUpBar">
              <button className="primaryButton">
                <p className="signUpText">Sign Up</p>
                {/* <FaArrowRight fill="#ffffff" /> */}
              </button>
            </div>
          </form>

          <OAuth />

          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
