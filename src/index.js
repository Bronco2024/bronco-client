import React from 'react';
import * as Sentry from "@sentry/react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

Sentry.init({
  dsn: "https://c5e3bf17fddb68ed25f1fb52b0d0a914@o4509877957689344.ingest.de.sentry.io/4509877959065680",
  sendDefaultPii: true,
  // Keep startup light — sample less noisy traffic.
  tracesSampleRate: 0,
  beforeSend(event, hint) {
    const error = hint?.originalException;
    const message = String(
      (error && error.message) || event?.exception?.values?.[0]?.value || ""
    );
    // Known noisy WebKit/Firebase Auth internal TypeError during Google OAuth.
    // We harden auth init separately; still drop this mangled noise from alerts.
    if (
      message.includes("undefined is not an object") &&
      (/\[.*\.Pd\]/.test(message) || message.includes("Firebase"))
    ) {
      return null;
    }
    return event;
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
