import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyForm from './SingInForm';
import Home from './Home';
import NotFound from './NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MyForm />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
