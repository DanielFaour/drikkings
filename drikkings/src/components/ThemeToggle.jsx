import { useState, useEffect } from 'react';

function ThemeToggle() {
  // Initialize theme based on localStorage or the system's preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if a theme is set in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // If no theme in localStorage, use system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update theme based on darkMode state and save to localStorage
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
    <button id="btnTheme" onPointerUp={() => setDarkMode(!darkMode)}>
      {darkMode ? '🌞' : '🌚'}
    </button>
  );
}

export default ThemeToggle;
