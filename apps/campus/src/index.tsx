import * as React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ColorModeScript } from '@chakra-ui/react';

import App from './App';

import TagManager from 'react-gtm-module';

// TagManager.initialize({
//   gtmId: process.env.REACT_APP_GTM_ID || '',
// });

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_ID,
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="system" />

    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
