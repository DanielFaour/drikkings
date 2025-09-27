import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './g_styles/info.css';
import bmcImage from './g_assets/bmab.png';
import ThemeToggle from '../ThemeToggle';

function GameInfo() {
  const navigate = useNavigate();

  return (
    <>
      <div id="nav_info">
        <button id="btnReturn" onPointerUp={() => navigate('/')}>⬅️</button>
        <h2>Spillinformasjon</h2>
      </div>
      <div id="info_game">
        <div id="info_container">
          <div id="info_text">

            <h3>Introduksjon</h3>
            <p>
              Denne nettsiden er laget som et hobbyprosjekt ved siden av jobb og studier. Spillene kan spilles som man vil, men de er designet etter reglene under.
              <br /><br />
              Har du noen ønsker, feedback eller funnet feil, send meg gjerne en epost <a href='mailto:daniea1602@gmail.com'>her!</a>
              <br /><br />
            </p>
            <h3>💣 1/16 Minesweeper 💣</h3>
            <p>I dette spillet er det én bombe skjult blant de 16 knappene. Målet er å unngå å trykke på bomben.
              <br /><br />
              1. <b>Starten:</b> En spiller begynner med å trykke på en knapp.
              <br /><br />
              2. <b>Antall trykk:</b> Etter man har trykket på én eller flere knapper, sender man turen videre til neste spiller (med klokka).
              <br /><br />
              3. <b>Antall slurker:</b> Dersom en spiller trykker på en knapp med bomben, må de drikke for antall knapper de selv har trykket på den runden, inkludert forrige spillers. Ingen unntak!
              <br /><br />
              <b>Bonus:</b> Dersom en spiller trykker på bomben på første forsøk på et nytt spill, må de ta en shot eller chug. Synd trist leit, det er problem for senere!
              <br /><br />
            </p>
            <h3>🥛 Shot Roulette 🥛</h3>
            <p>
              Klassisk russisk rulett med en liten vri! Personen som blir pekt på av revolveren må ta sjansen sin og trykke på den. Hvis den skyter må personen som
              trakk på den sist ta en slurk, eller shot hvis dere er klin kokkos!
              <br /><br />
              <b>Bonus:</b> Det er en liten sannsynlighet for at kula er en "lucky bullet" som vil si taperen vinner og kan dele ut straffen!
              <br /><br />
            </p>
            <h3>🍼 Flasketuten peker på 🍼</h3>
            <br />
            {/* <center>Work in progress! ⚠️</center> */}
            <p>Nøyaktig hva det høres ut som! En flaske som spinner og peker på deltakeren som må gjøre noe.
              Trykk på flasken for å få den til å spinne, og dere bestemmer
              reglene selv. For eksempel kan det være å ta en slurk, eller gjøre noe sprøtt!
              <br /><br />
            </p>
            <h3>🎨 Color Picker 🎨</h3>
            <p>I dette spillet kan man maks være 5 spillere. Hver spiller plasserer en finger på skjermen, hvor de får sin egen farge under fingertuppen.
              Når tiden går ut vil skjermen endre farge til en av spillernes farge, som betyr at vedkommende med fargen må ta en slurk eller shot!
              <br /><br />
            </p>
            <h3>🍾 Shake It 🍾</h3>
            <br />
            {/* <center>Work in progress! ⚠️</center> */}
            <p>Et enkelt spill hvor man rister en flaske med bobler og gir den videre til nestemann før den popper. Deltakeren som popper flasken må ta en chug eller shot!
              <br /><br />
            </p>
            <h3>⏱️ Flere spill på vei ⏱️</h3>
            <br /><br />
            <h3>Dette er hva jeg holder på med nå:</h3>
            <ul>
              <li>Ferdigstilling av spill, spesielt spill 3 og 5</li>
              <br></br>
              <li>Se på om jeg skal gjøre det mulig å endre språk, eller bare gjøre om siden til engelsk</li>
              <br></br>
              <li>Patche noen bugs med lyd (lyd fungerer generelt sett dårlig på nettsider)</li>
              <br></br>
              <li>Starte på Game 6</li>
              <br></br>
              <li>Legge inn regelside på hvert spill første gang man åpner spill, så man slipper å gå inn her</li>
            </ul>
          </div>

        </div>
        <div className="emptySpace"></div><div className="emptySpace"></div>

        <footer className="footer">
          <p>Laget av <a href="https://danielfaour.no" target="_blank">Daniel Faour🔗</a></p>
          <a href="https://www.buymeacoffee.com/danielfaour" target="_blank">
            <img src={bmcImage} alt="Kjøp meg en øl!" style={{ width: "160px" }} />
          </a>
          <p id="vipps">eller vipps: 47629779</p>
          <p id="copyright" style={{ opacity: 0.5 }}>Copyright © 2025</p>
        </footer>
      </div >
    </>
  );
}

export default GameInfo;
