import { useNavigate } from 'react-router-dom';
import './g_styles/info.css';

function GameInfo() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div id="info_game">
      <button id="btnReturn" onClick={() => navigate('/')}>⬅️</button>
      <div id="infoContainer">
        <h2>Spillinfo</h2>
        <h3>💣 1/16 Minesweeper 💣</h3>
        <p>I dette spillet er det én bombe skjult blant de 16 knappene. Målet er å unngå å trykke på bomben.
          <br></br>
          <br></br>
          1. <b>Starten:</b> En spiller begynner med å trykke på en knapp.
          <br></br>
          <br></br>
          2. <b>Antall trykk:</b> Etter man har trykket på én eller flere knapper, sender man turen videre til neste spiller (med klokka).
          <br></br>
          <br></br>
          3. <b>Antall slurker:</b> Dersom en spiller trykker på en knapp med bomben, må de drikke for antall knapper de har trykket på, inkludert forrige spillers. Ingen unntak!
          <br></br>
          <br></br>
          <b>Bonus:</b> Dersom en spiller trykker på bomben på første forsøk, må de ta en shot eller chug. Synd trist leit, et problem for morgendagen!
          <br></br>
          <br></br>
        </p>
        <h3>⏱️ Flere spill på vei ⏱️</h3>
      </div>
      <div className="emptySpace"></div>
      <div className="emptySpace"></div>
        
        <footer className="footer">
          <p>Laget av <a href="https://danielfaour.no" target="_blank">Daniel Faour🔗</a></p>
          <p>Spander meg en pils: 47629779</p>
        </footer>
    </div>
  );
}

export default GameInfo;
