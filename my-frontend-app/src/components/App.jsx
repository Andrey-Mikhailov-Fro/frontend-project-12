import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SingInForm from './SignInForm';
import Home from './Home';
import NotFound from './NotFound';
import SingUpForm from './SignUpForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SingUpForm />} />
        <Route path="/login" element={<SingInForm />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
