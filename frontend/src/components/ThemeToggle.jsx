import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

const resolveInitialTheme = () => {
  const stored = localStorage.getItem('smn-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const ThemeToggle = ({ compact = false }) => {
  const [theme, setTheme] = useState(resolveInitialTheme);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('smn-theme', theme);
  }, [theme]);

  return (
    <Form.Check
      type='switch'
      id={`theme-toggle-${compact ? 'compact' : 'full'}`}
      label={compact ? '' : theme === 'dark' ? 'Dark mode' : 'Light mode'}
      checked={theme === 'dark'}
      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
      className='theme-toggle'
    />
  );
};

export default ThemeToggle;
