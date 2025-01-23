import React, { useEffect, useState } from 'react';
import LaunchList from './components/LaunchList';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <h1>SpaceX Launches</h1>
      <LaunchList />
    </div>
  );
}

export default App;