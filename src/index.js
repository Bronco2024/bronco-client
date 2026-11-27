import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

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

// Sentry is heavy — init after first paint so home/LCP is not blocked.
const bootSentry = () => {
  import("@sentry/react")
    .then((Sentry) => {
      import("@/helpers/sentry-noise")
        .then(({ isFirestoreConnectionNoise }) => {
          Sentry.init({
            dsn: "https://c5e3bf17fddb68ed25f1fb52b0d0a914@o4509877957689344.ingest.de.sentry.io/4509877959065680",
            sendDefaultPii: true,
            tracesSampleRate: 0,
            ignoreErrors: [
              /Java object is gone/i,
              /Error invoking postMessage: Java/i,
              /Database deleted by request of the user/i,
              /Connection to Indexed Database server lost/i,
              /Can't find variable: EmptyRanges/i,
              /EmptyRanges is not defined/i,
              /^FirebaseError:\s*Connection failed\.?$/i,
            ],
            beforeSend(event, hint) {
              const error = hint?.originalException;
              const message = String(
                (error && error.message) ||
                  event?.exception?.values?.[0]?.value ||
                  ""
              );
              const frames =
                event?.exception?.values?.[0]?.stacktrace?.frames || [];
              const frameFiles = frames.map((frame) =>
                String(frame?.filename || frame?.abs_path || "")
              );
              const fromGtag = frameFiles.some((file) =>
                file.includes("gtag/js")
              );
              const fromFbAndroidBridge = frameFiles.some((file) =>
                file.includes("navigation_performance_logger_android")
              );

              if (
                message.includes("undefined is not an object") &&
                (/\[.*\.Pd\]/.test(message) || message.includes("Firebase"))
              ) {
                return null;
              }

              if (
                fromGtag ||
                message.includes("is_legacy_loaded") ||
                (message.includes("gtag") && message.includes("undefined"))
              ) {
                return null;
              }

              if (
                fromFbAndroidBridge ||
                message.includes("Java object is gone") ||
                /Error invoking \w+: Java object is gone/i.test(message)
              ) {
                return null;
              }

              if (
                message.includes("Database deleted by request of the user") ||
                message.includes("Connection to Indexed Database server lost") ||
                (/Indexed Database/i.test(message) &&
                  /UnknownError|Internal error/i.test(message))
              ) {
                return null;
              }

              if (/EmptyRanges/i.test(message)) {
                return null;
              }

              if (isFirestoreConnectionNoise(error, event)) {
                return null;
              }

              return event;
            },
          });
        })
        .catch(() => {});
    })
    .catch(() => {});
};

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(bootSentry, { timeout: 3500 });
  } else {
    window.setTimeout(bootSentry, 2000);
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
