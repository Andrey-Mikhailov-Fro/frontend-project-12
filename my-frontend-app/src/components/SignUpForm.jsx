/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useSignupMutation } from '../services/authApi';
import validationSchema from '../services/validationSingUp';
import CommonHeader from './CommonHeader';
import routes from '../services/routes';

const SingUpForm = () => {
  const [singUp, { isLoading: isSingingUp }] = useSignupMutation();
  const [errorUsername, setErrorUsername] = useState('');
  const [focusUsername, setFocusedUsername] = useState(false);
  const [focusPassword, setFocusedPassword] = useState(false);
  const [focusConfirm, setFocusedConfirm] = useState(false);
  const userData = useSelector((state) => state.user);
  localStorage.setItem('token', userData.token);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { username, password } = values;

      const response = await singUp({ username, password });
      if (Object.hasOwn(response, 'error')) {
        if (response.error.status === 409) setErrorUsername(t('signUpForm.errors.alreadyExist'));
      }
    },
  });

  const focus = {
    username: () => {
      setFocusedUsername(true);
      formik.validateField('username');
    },
    password: () => {
      setFocusedPassword(true);
      formik.validateField('password');
    },
    confirm: () => {
      setFocusedConfirm(true);
      formik.validateField('confirmPassword');
    },
  };

  if (userData.token !== '') return <Navigate to={routes.home} />;

  return (
    <>
      <CommonHeader />
      <Container fluid className="row justify-content-center align-content-center">
        <Card className="h-50 w-25 m-3 mb-1 p-5 shadow">
          <Card.Header as="h2" className="bg-white border-0 m-2 text-center">{t('signUpForm.title')}</Card.Header>
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel className="mb-3" label={t('signUpForm.username')} controlId="username">
              <Form.Control
                type="name"
                name="username"
                className="w-100"
                onBlur={focus.username}
                isInvalid={focusUsername && (formik.errors.username || errorUsername)}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errorUsername !== '' ? errorUsername : t(formik.errors.username)}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel className="mb-3" label={t('signUpForm.password')} controlId="password">
              <Form.Control
                type="password"
                name="password"
                className="w-100"
                onBlur={focus.password}
                isInvalid={focusPassword && formik.errors.password}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.password)}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel className="mb-4" label={t('signUpForm.confirmPassword')} controlId="confirmPassword">
              <Form.Control
                type="password"
                name="confirmPassword"
                className="w-100"
                onBlur={focus.confirm}
                isInvalid={focusConfirm && formik.errors.confirmPassword}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.confirmPassword)}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button
              className="w-100 border-primary bg-white text-primary"
              type="submit"
              disabled={isSingingUp}
            >
              {t('signUpForm.button')}
            </Button>
          </Form>
        </Card>

      </Container>
    </>

  );
};

export default SingUpForm;
