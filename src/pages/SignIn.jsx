import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

// ICONS
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Invalid user credentials');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageTitle">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
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
              <div
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {/* FORGOT PASSWORD LINK */}
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            {/* SIGN IN BAR */}
            <div className="signInBar">
              <button className="primaryButton">
                <p className="signInText">Sign In</p>
                {/* <FaArrowRight fill="#ffffff" /> */}
              </button>
            </div>
          </form>

          <OAuth />

          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
