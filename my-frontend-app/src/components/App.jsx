import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import SingInForm from './SignInForm';
import Home from './Home';
import NotFound from './NotFound';
import SingUpForm from './SignUpForm';
import 'react-toastify/dist/ReactToastify.css';

const rollbarConfig = {
  accessToken: localStorage.getItem('token'),
  environment: 'production',
};

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SingUpForm />} />
            <Route path="/login" element={<SingInForm />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <ToastContainer />
    </Provider>
  );
}

export default App;
