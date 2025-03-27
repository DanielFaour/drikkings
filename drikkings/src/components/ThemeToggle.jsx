import { useState, useEffect } from 'react';

function ThemeToggle() {
  // Get theme from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button id="btnTheme" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '🌚' : '🌞'}
    </button>
  );
}

export default ThemeToggle;
