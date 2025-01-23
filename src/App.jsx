import React, { useEffect, useState } from 'react';
import LaunchList from './components/LaunchList';

function App() {
  return (
    <div className="App container">
      <h1>SpaceX Launches</h1>
      <LaunchList />
    </div>
  );
}

export default App;