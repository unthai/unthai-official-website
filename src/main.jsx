import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import '@fontsource-variable/inter'
import '@fontsource-variable/outfit'
import './index.css'
import App from './App.jsx'

window.addEventListener('error', (event) => {
  console.error('GLOBAL_ERROR_DETECTED:', event.error);
  if (document.getElementById('root')) {
    document.getElementById('root').innerHTML = `<div style="color:white;padding:20px;background:red;">Startup Error: ${event.error?.message || 'Unknown'}</div>`;
  }
});

try {
  console.log('Mounting React application...');
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );
  console.log('React mount initiated.');
} catch (e) {
  console.error('MOUNT_CRASHED:', e);
}
