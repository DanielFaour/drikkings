import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import './App.css';
import './components/styles/buttons.css';
import './components/styles/mainGame.css';

import ThemeToggle from './components/ThemeToggle';
import Info from './components/games/GameInfo';
import InfoButton from './components/infoButton';
import GamesCards from './components/GamesCards';
import Game1 from './components/games/Game1';
import Game2 from './components/games/Game2';
import Game3 from './components/games/Game3';
import Game4 from './components/games/Game4';
import Game5 from './components/games/Game5';
import VisibilityHandler from "./components/VisibilityHandler";

function App() {
  const [winRotation, setWinRotation] = useState(false);

  function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !/Tablet|iPad/i.test(navigator.userAgent);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");

    function handleOrientationChange(e) {
      if (e.matches && isMobile()) {
        setWinRotation(false);
      } else if (!isMobile()) {
        setWinRotation(false);
      } else {
        setWinRotation(true);
      }
    }

    handleOrientationChange(mediaQuery);
    mediaQuery.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  return (
    <>
      {/* Optional: Disable zooming */}
      {/* 
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Helmet> 
      */}
      
      <ThemeToggle />
      <div id="nav">
        <InfoButton />
      </div>

      <div className="bodyContainer">
        <div className="title">
          <h1>🍻</h1>
          <h2>drikkings.no</h2>
          <p>
            Drikkelekene for små grupper,
            <br />
            perfekt til vors eller pubben!
          </p>
        </div>

        <div className="container">
          <h3>Velg et spill:</h3>
          <VisibilityHandler />
          <Routes>
            <Route path="/" element={<GamesCards />} />
            <Route path="/games/game1" element={<Game1 />} />
            <Route path="/games/game2" element={<Game2 />} />
            <Route path="/games/game3" element={<Game3 />} />
            <Route path="/games/game4" element={<Game4 />} />
            <Route path="/games/game5" element={<Game5 />} />
            <Route path="/games/info" element={<Info />} />
          </Routes>
          {/* <p id="copyright">Copyright © 2025 Daniel Faour</p> */}
        </div>
      </div>

      {winRotation && (
        <div id="wrongRotation">
          <h1>🔄️ Roter mobilen vertikalt 🔄️</h1>
        </div>
      )}
    </>
  );
}

export default App;
