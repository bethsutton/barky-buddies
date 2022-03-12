import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Slider from '../components/Slider';

// IMAGES
import neutralBuddy from '../components/assets/neutral-buddy.jpeg';
import reactiveBuddy from '../components/assets/reactive-buddy.jpeg';
import excitedBuddy from '../components/assets/excited-buddy.jpeg';
import babyBuddy from '../components/assets/baby-buddy.jpeg';

function Explore() {
  return (
    <div className="explore">
      <main>
        {/* <SLIDER /> */}
        <Slider />

        {/* EXPLORE */}
        <div className="explore-page">
          <p className="pageTitle">Explore Buddies</p>
          <div className="exploreCategories">
            <div className="exploreCategoriesGroup">
              <Link to="/category/reactive">
                <img
                  src={reactiveBuddy}
                  alt=""
                  className="exploreCategoryImg"
                />
                <p className="exploreCategoryName">Reactive Buddies</p>
              </Link>
              <Link to="/category/excited">
                <img src={excitedBuddy} alt="" className="exploreCategoryImg" />
                <p className="exploreCategoryName">Excited Buddies</p>
              </Link>
            </div>
            <div className="exploreCategoriesGroup">
              <Link to="/category/baby">
                <img src={babyBuddy} alt="" className="exploreCategoryImg" />
                <p className="exploreCategoryName">Baby Buddies</p>
              </Link>
              <Link to="/category/neutral">
                <img src={neutralBuddy} alt="" className="exploreCategoryImg" />
                <p className="exploreCategoryName">Neutral Buddies</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
