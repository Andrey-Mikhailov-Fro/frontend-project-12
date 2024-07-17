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
import { useSingupMutation } from '../services/authApi';
import validationSchema from '../services/validationSingUp';
import CommonHeader from './CommonHeader';

function SingUpForm() {
  const [singUp, { isLoading: isSingingUp }] = useSingupMutation();
  const [errorUsername, setErrorUsername] = useState('');
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

  if (userData.token !== '') return <Navigate to="/" />;

  return (
    <>
      <CommonHeader />
      <Container fluid className="row justify-content-center align-content-center">
        <Card className="h-50 w-50 m-3 mb-1 p-5 shadow">
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel className="mb-3" label={t('signUpForm.username')}>
              <Form.Control
                type="name"
                name="username"
                isInvalid={(errorUsername !== '') || formik.errors.username}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errorUsername !== '' ? errorUsername : t(formik.errors.username)}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel className="mb-3" label={t('signUpForm.password')}>
              <Form.Control
                type="password"
                name="password"
                isInvalid={formik.errors.password}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.password)}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel className="mb-4" label={t('signUpForm.confirmPassword')}>
              <Form.Control
                type="password"
                name="confirmPassword"
                isInvalid={formik.errors.confirmPassword}
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
}

export default SingUpForm;
