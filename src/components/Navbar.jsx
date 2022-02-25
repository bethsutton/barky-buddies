import React from 'react';
// import {  } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar shadow-lg bg-primary-new text-neutral-content">
      <div className="container mx-auto flex flex-row">
        <div className="flex-none hidden md:inline px-2 mx-2">
          <Link to="/" className="text-lg font-bold align-middle">
            LOGO
          </Link>
        </div>

        <div className="flex-1 px-2 mx-2">
          <div className="flex justify-end">
            <Link to="/" className="mx-3 text-black">
              Home
            </Link>
            <Link to="/about" className="mx-3 text-black">
              About
            </Link>
            <Link to="/contact" className="mx-3 text-black">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
