
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Disable scroll restoration globally
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Prevent default behavior for all hash links
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest('a');
  
  if (anchor && anchor.getAttribute('href') === '#') {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

// Fix for iOS Safari and other mobile browsers that reset scroll position
document.addEventListener('touchmove', (e) => {
  // Only prevent default for non-input elements
  if (e.target && 
      (e.target as HTMLElement).tagName !== 'INPUT' && 
      (e.target as HTMLElement).tagName !== 'TEXTAREA') {
    // Allow the user to scroll but prevent browser's native scrolling behavior
    if (!document.documentElement.classList.contains('scrolling')) {
      document.documentElement.classList.add('scrolling');
    }
  }
}, { passive: true });

document.addEventListener('touchend', () => {
  document.documentElement.classList.remove('scrolling');
}, { passive: true });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
