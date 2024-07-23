/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import io from 'socket.io-client';
import ChannelsBlock from './ChannelsBlock';
import MessagesBlock from './MessagesBlock';
import CommonHeader from './CommonHeader';

const socket = io();

function Home() {
  const [activeChannel, setActive] = useState('1');
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';

  socket.on('connect_error', (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
  });

  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <div style={{ height: '80vh' }}>
      <CommonHeader />
      <Container fluid className="container h-100 my-4 overflow-hidden rounded shadow align-self-stretch">
        <div className="row h-100 bg-white flex-md-row">
          <Card className="col-4 col-md-3 border-end px-0 bg-light flex-column h-100 d-flex">
            <ChannelsBlock socket={socket} active={activeChannel} onChangeChannel={setActive} />
          </Card>
          <Card className="col p-0 m-0 h-100 bg-light shadow-sm">
            <MessagesBlock socket={socket} active={activeChannel} />
          </Card>
        </div>
      </Container>
    </div>

  );
}

export default Home;
