import { Routes, Route } from 'react-router-dom';
import './App.css';
import './components/styles/buttons.css';
import './components/styles/mainGame.css';
import ThemeToggle from './components/ThemeToggle';
import Info from './components/games/GameInfo';
import InfoButton from './components/infoButton';
import GamesCards from './components/GamesCards';
import Game1 from './components/games/Game1';
import Game2 from './components/games/Game2';

function App() {
  return (
    <>
      <ThemeToggle />
      <InfoButton />

      <div className="bodyContainer">
        <div className="title">
          <h1>🍻</h1>
          <h2>drikkings.no</h2>
          <p>Drikkelekene for små grupper,
            <br />
            perfekt til vors eller pubben!
          </p>
        </div>

        <div className="container">
          <h3>Velg et spill:</h3>
          <Routes>
            <Route path="/" element={<GamesCards />} />
            <Route path="/games/game1" element={<Game1 />} />
            <Route path="/games/game2" element={<Game2 />} />
            <Route path="/games/info" element={<Info />} />
          </Routes>
        </div>

        <div className="emptySpace"></div>
        <footer className="footer">
          <p>Laget av <a href="https://danielfaour.no" target="_blank">Daniel Faour🔗</a></p>
          <p>Sist oppdatert 2025</p>
        </footer>
      </div>
    </>
  );
}

export default App;
