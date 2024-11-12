import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './Navigation.tsx';
import './global.css';

createRoot(document.getElementById('core')).render(
  <StrictMode>
    <Navigation />
  </StrictMode>
)
