
import { useNavigate } from 'react-router-dom';
import './styles/buttons.css'

function GamesCards() {
  const navigate = useNavigate();
  const Button = ({ label, border, bg, text, onClick }) => {
    return (
      <button className='menu_btn' onClick={onClick} style={{ "--btn-border": border, "--btn-bg": bg, "--btn-text": text }}>
        {label}
      </button>
    );
  };
  return (
    <>
      <Button onClick={() => navigate('/games/Game1')} label="💣 1/16 Minesweeper 💣" border="#FFCD9A" bg="#FFCD9A" text="black" />
      <Button onClick={() => navigate('/games/Game2')} label="🥛 Shot Roulette 🥛" border="#FF9A9A" bg="#FF9A9A" text="black" />
      <Button onClick={() => navigate('/')} label="🎨 Color Picker 🔒" border="#FF9AF8" bg="#FF9AF8" text="black" />
      <Button onClick={() => navigate('/')} label="🍾 Shake it 🔒" border="#9AA8FF" bg="#9AA8FF" text="black" />
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
      <Button label={"test"}></Button>
    </>
  )
}

export default GamesCards