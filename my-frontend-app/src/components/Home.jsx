/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import io from 'socket.io-client';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import CommonHeader from './CommonHeader';

const socket = io('http://localhost:5001');

function Home() {
  const [activeChannel, setActive] = useState('1');
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';

  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <>
      <CommonHeader />
      <Container className="container d-flex flex-row">
        <Card className="d-flex flex-column">
          <ChannelsList socket={socket} active={activeChannel} onChangeChannel={setActive} />
        </Card>
        <Card className="d-flex flex-column">
          <MessagesList socket={socket} active={activeChannel} />
        </Card>
      </Container>
    </>
  );
}

export default Home;
