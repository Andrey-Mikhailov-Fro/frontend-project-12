import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import SingInForm from './SignInForm';
import Home from './Home';
import NotFound from './NotFound';
import SingUpForm from './SignUpForm';
import routes from '../services/routes';
import 'react-toastify/dist/ReactToastify.css';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: process.env.NODE_ENV,
};

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path={routes.signUp} element={<SingUpForm />} />
            <Route path={routes.login} element={<SingInForm />} />
            <Route path={routes.home} element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <ToastContainer />
    </Provider>
  );
}

export default App;
