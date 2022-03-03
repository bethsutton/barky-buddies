import React from 'react';
// COMPONENTS
import Dog from '../components/Dog';

function Train() {
  return (
    <div className="category">
      <header>
        <p className="pageTitle">Training Sessions</p>
      </header>
      <div className="dog-container">
        <Dog />
      </div>
    </div>
  );
}

export default Train;
