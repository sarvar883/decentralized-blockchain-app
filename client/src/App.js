import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import components
import StartPage from './components/StartPage';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<StartPage />} />
      </Routes>
    </div>
  );
}

export default App;