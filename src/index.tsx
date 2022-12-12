import React from 'react';
import { createRoot } from 'react-dom/client';
import { initGlobal } from 'utils/global';
import { App } from './App/App';

import './index.css';

initGlobal();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
