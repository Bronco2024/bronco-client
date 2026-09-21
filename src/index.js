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
  ignoreErrors: [
    // Facebook/Instagram Android in-app WebView native bridge teardown.
    /Java object is gone/i,
    /Error invoking postMessage: Java/i,
    // Safari / WKWebView IndexedDB eviction (ITP, private mode, in-app browsers).
    /Database deleted by request of the user/i,
    /Connection to Indexed Database server lost/i,
    // Safari WebKit MediaController bug (NullMedia → EmptyRanges).
    /Can't find variable: EmptyRanges/i,
    /EmptyRanges is not defined/i,
  ],
  beforeSend(event, hint) {
    const error = hint?.originalException;
    const message = String(
      (error && error.message) || event?.exception?.values?.[0]?.value || ""
    );
    const frames =
      event?.exception?.values?.[0]?.stacktrace?.frames || [];
    const frameFiles = frames.map((frame) =>
      String(frame?.filename || frame?.abs_path || "")
    );
    const fromGtag = frameFiles.some((file) => file.includes("gtag/js"));
    const fromFbAndroidBridge = frameFiles.some((file) =>
      file.includes("navigation_performance_logger_android")
    );

    // Known noisy WebKit/Firebase Auth internal TypeError during Google OAuth.
    if (
      message.includes("undefined is not an object") &&
      (/\[.*\.Pd\]/.test(message) || message.includes("Firebase"))
    ) {
      return null;
    }

    // Google Analytics / gtag race (legacy dual-load noise).
    if (
      fromGtag ||
      message.includes("is_legacy_loaded") ||
      (message.includes("gtag") && message.includes("undefined"))
    ) {
      return null;
    }

    // Facebook/Instagram Android WebView injected logger calls a destroyed
    // Java bridge during navigation/teardown — not app code.
    if (
      fromFbAndroidBridge ||
      message.includes("Java object is gone") ||
      /Error invoking \w+: Java object is gone/i.test(message)
    ) {
      return null;
    }

    // Safari / iOS WKWebView clears IndexedDB (privacy / storage pressure).
    // Firebase Auth then rejects; not an app bug.
    if (
      message.includes("Database deleted by request of the user") ||
      message.includes("Connection to Indexed Database server lost") ||
      (/Indexed Database/i.test(message) && /UnknownError|Internal error/i.test(message))
    ) {
      return null;
    }

    // Safari WebKit media controls bug on item pages with video.
    if (/EmptyRanges/i.test(message)) {
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
