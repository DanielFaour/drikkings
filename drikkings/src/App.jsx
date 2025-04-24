import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Helmet } from 'react-helmet';
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

function App() {
  return (
    <>
      {/* Disable zooming */}
      {/* <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Helmet> */}

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
            <Route path="/games/game3" element={<Game3 />} />
            <Route path="/games/game4" element={<Game4 />} />
            <Route path="/games/game5" element={<Game5 />} />
            <Route path="/games/info" element={<Info />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
