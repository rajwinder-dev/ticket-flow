import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { api } from '@org/core';
import { apiUrl } from './config/apiconfig';

api.setContext({ getOrgId: getOrgIdFromUrl }).setApiUrl(apiUrl);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

function getOrgIdFromUrl() {
  const match = window.location.pathname.match(/org\/([^/]+)/);
  return match?.[1];
}
