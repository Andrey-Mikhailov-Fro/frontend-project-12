import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { quit } from '../slices/authSlice';
import routes from '../services/routes';

const CommonHeader = () => {
  const userData = useSelector((state) => state.user);
  const isLoggedIn = userData.token !== '';
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const clickhandler = () => {
    dispatch(quit());
  };

  return (
    <Navbar className="shadow-sm bg-white">
      <Container>
        <Navbar.Brand href={routes.home}>{t('header.brand')}</Navbar.Brand>
        {isLoggedIn ? <Button onClick={clickhandler}>{t('header.button')}</Button> : null}
      </Container>
    </Navbar>
  );
};

export default CommonHeader;
