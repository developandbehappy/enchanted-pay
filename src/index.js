import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';


const root = ReactDOM.createRoot(document.getElementById('pay'));
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://enchantedworld.io/manifest-ton.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
