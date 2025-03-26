import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import GamesCards from './components/GamesCards'
import Game1 from './components/games/Game1';
import Game2 from './components/games/Game2';

function App() {


  return (
    <>
      <div className="title">
        <h1>🍻</h1>
        <h2>drikkings.no</h2>
      </div>
      <div className="container">
        <h3>Velg et spill:</h3>
        <Routes>
          <Route path="/" element={<GamesCards />} />
          <Route path="/games/game1" element={<Game1 />} />
          <Route path="/games/game2" element={<Game2 />} />
        </Routes>
      </div>

    </>
  )
}

export default App
