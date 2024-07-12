import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { quit } from '../slices/authSlice';

function CommonHeader() {
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';
  const dispatch = useDispatch();

  const clickhandler = () => {
    dispatch(quit());
  };

  return (
    <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <Container>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        {isLoggedIn ? <Button onClick={clickhandler}>Выйти</Button> : null}
      </Container>
    </Navbar>
  );
}

export default CommonHeader;
