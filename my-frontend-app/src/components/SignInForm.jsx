/* eslint-disable consistent-return */
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { Navigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../services/authApi';
import CommonHeader from './CommonHeader';

const MyForm = () => {
  const [singIn, { isLoading: isSingingIn }] = useLoginMutation();
  const [error, setError] = useState('');
  const userData = useSelector((state) => state.user);
  localStorage.setItem('token', userData.token);
  localStorage.setItem('user', userData.user);

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      nickname: '',
      password: '',
    },
    onSubmit: async (values) => {
      const { nickname, password } = values;
      const body = { username: nickname, password };
      const response = await singIn(body);
      if (Object.hasOwn(response, 'error')) {
        if (response.error.status === 401) setError(t('signInForm.error'));
      }
    },
  });

  const possibleError = error !== '';

  if (userData.token !== '') return <Navigate to="/" />;

  return (
    <>
      <CommonHeader />
      <Container fluid className="row justify-content-center align-content-center">
        <Card className="h-25 w-25 m-3 mb-1 p-5 shadow">
          <Card.Header as="h1" className="text-center m-4 border-0 bg-white flex-nowrap">{t('signInForm.button')}</Card.Header>
          <Card.Body>
            <Formik>
              <Form onSubmit={formik.handleSubmit}>
                <FloatingLabel className="mb-4" controlId="nickname" label={t('signInForm.username')}>
                  <Form.Control
                    type="name"
                    name="nickname"
                    className="w-100"
                    required
                    isInvalid={possibleError}
                    value={formik.values.nickname}
                    onChange={formik.handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel className="mb-4" controlId="password" label={t('signInForm.password')}>
                  <Form.Control
                    type="password"
                    name="password"
                    className="w-100"
                    required
                    isInvalid={possibleError}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {possibleError ? t('signInForm.error') : ''}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSingingIn}
                  className="w-100 border-primary bg-white text-primary"
                >
                  {t('signInForm.button')}
                </Button>
              </Form>
            </Formik>
          </Card.Body>
          <Card.Footer className="text-center m-1 p-1 bg-white">
            <span>{t('signInForm.haveAccount')}</span>
            <a href="/signup">{t('signInForm.registration')}</a>
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default MyForm;
