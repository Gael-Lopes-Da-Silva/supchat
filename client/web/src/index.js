import * as react from 'react';
import * as reactdom from 'react-dom/client';

import App from './App';

import './index.css';

const root = reactdom.createRoot(document.getElementById('root'));
root.render(
        <App />
);