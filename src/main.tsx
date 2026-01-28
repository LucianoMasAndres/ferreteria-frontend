import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Attempting to mount App...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = "<h1>Fatal Error: #root not found</h1>";
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mount command sent.");
  } catch (err) {
    console.error("CRITICAL MOUNT ERROR:", err);
    rootElement.innerHTML = `
      <div style="color: red; padding: 20px; border: 2px solid red;">
        <h1>Application Crashing</h1>
        <pre>${err instanceof Error ? err.message + '\n' + err.stack : JSON.stringify(err)}</pre>
      </div>
    `;
  }
}
