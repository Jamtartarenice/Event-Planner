import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import AppWrapper from './App'; 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
