import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { AuthProvider } from './lib/AuthContext';
import { DesignProvider } from './lib/DesignContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DesignProvider>
        <App />
      </DesignProvider>
    </AuthProvider>
  </StrictMode>,
);
