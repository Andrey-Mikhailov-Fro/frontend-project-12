import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider } from 'react-i18next';
import App from './components/App';
import store from './slices/index';
import i18nextInstance from './services/i18nextInstance';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18nextInstance} defaultNS="translation">
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>

  </React.StrictMode>,
);
