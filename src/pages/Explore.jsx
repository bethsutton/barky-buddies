import React from 'react';
import Spinner from '../components/Spinner';

// IMAGES
import dogImage from '../components/assets/dog.jpg';

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
              <img src={dogImage} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Reactive Buddies</p>
            </div>
            <div>
              <img src={dogImage} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Excited Buddies</p>
            </div>
          </div>
          <div className="exploreCategoriesGroup">
            <div>
              <img src={dogImage} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Baby Buddies</p>
            </div>
            <div>
              <img src={dogImage} alt="" className="exploreCategoryImg" />
              <p className="exploreCategoryName">Neutral Buddies</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
