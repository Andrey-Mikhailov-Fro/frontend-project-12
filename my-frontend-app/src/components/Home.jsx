/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import io from 'socket.io-client';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import CreateChannelModal from './CreateChannelModal';

const socket = io('http://localhost:5001');

function Home() {
  const [activeChannel, setActive] = useState('1');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';

  const handleClose = (shownFunc) => () => shownFunc(false);
  const handleShow = (shownFunc) => () => shownFunc(true);

  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <Container className="container d-flex flex-row">
      <CreateChannelModal
        show={showCreateChannel}
        handleClose={handleClose(setShowCreateChannel)}
      />
      <Card className="d-flex flex-column">
        <Card className="d-flex mt-1 justify-content-between flex-row mb-2 ps-4 pe-2 p-4">
          <Card.Body>Каналы</Card.Body>
          <Button className="text-primary btn btn-group-vertical" onClick={handleShow(setShowCreateChannel)} />
        </Card>
        <ChannelsList socket={socket} active={activeChannel} onChangeChannel={setActive} />
      </Card>
      <Card className="d-flex flex-column">
        <MessagesList socket={socket} active={activeChannel} />
      </Card>
    </Container>
  );
}

export default Home;
