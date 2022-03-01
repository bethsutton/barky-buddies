import React from 'react';
import { FaDog, FaCompass, FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route == location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <FaCompass
              className="navbarListItemIcon"
              size={56}
              fill={pathMatchRoute('/') ? '#ffffff' : '#127890'}
            />
            <p
              className={
                pathMatchRoute('/')
                  ? 'navbarListItemNameActive'
                  : 'navbarListName'
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/buddies')}>
            <FaDog
              className="navbarListItemIcon"
              size={56}
              fill={pathMatchRoute('/buddies') ? '#ffffff' : '#127890'}
            />
            <p
              className={
                pathMatchRoute('/buddies')
                  ? 'navbarListItemNameActive'
                  : 'navbarListName'
              }
            >
              Buddies
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/profile')}>
            <FaUser
              size={56}
              className="navbarListItemIcon"
              fill={pathMatchRoute('/profile') ? '#ffffff' : '#127890'}
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'navbarListItemNameActive'
                  : 'navbarListName'
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
