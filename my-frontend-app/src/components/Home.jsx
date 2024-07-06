import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Home() {
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';

  if (!isLoggedIn) return <Navigate to="/login" />;
  return (<div>Hello there!</div>);
}

export default Home;
