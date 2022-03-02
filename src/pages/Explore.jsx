import React from 'react';
import Spinner from '../components/Spinner';

// IMAGES
import neutralBuddy from '../components/assets/neutral-buddy.jpeg';
import reactiveBuddy from '../components/assets/reactive-buddy.jpeg';
import excitedBuddy from '../components/assets/excited-buddy.jpeg';
import babyBuddy from '../components/assets/baby-buddy.jpeg';

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageTitle">New Practice Sessions</p>
      </header>
      <main>
        {/* <Slider /> */}

        <p className="pageTitle">Explore Practice Sessions</p>
        <div className="exploreCategories">
          <div className="exploreCategoriesGroup">
            <div>
              <img src={reactiveBuddy} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Reactive Buddies</p>
            </div>
            <div>
              <img src={excitedBuddy} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Excited Buddies</p>
            </div>
          </div>
          <div className="exploreCategoriesGroup">
            <div>
              <img src={babyBuddy} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Baby Buddies</p>
            </div>
            <div>
              <img src={neutralBuddy} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Neutral Buddies</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
