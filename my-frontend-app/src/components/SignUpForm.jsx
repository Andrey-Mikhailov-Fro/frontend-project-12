import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useSingupMutation } from '../services/authApi';
import validate from '../services/validationSingUp';
import CommonHeader from './CommonHeader';

function SingUpForm() {
  const [singUp, { isLoading: isSingingUp }] = useSingupMutation();
  const [error, setError] = useState('');
  const userData = useSelector((state) => state.user);
  localStorage.setItem('token', userData.token);

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      const { username, password } = values;

      try {
        await validate(values);
        const response = await singUp({ username, password });
        console.log(response);
        if (Object.hasOwn(response, 'error')) setError('Уже существует');
      } catch (validationError) {
        setError(validationError.errors);
      }
    },
  });

  if (userData.token !== '') return <Navigate to="/" />;

  return (
    <>
      <CommonHeader />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Control type="name" name="username" isInvalid={haveError} value={formik.values.username} onChange={formik.handleChange} />
        <Form.Control type="password" name="password" isInvalid={haveError} value={formik.values.password} onChange={formik.handleChange} />
        <Form.Control type="password" name="confirmPassword" isInvalid={haveError} value={formik.values.confirmPassword} onChange={formik.handleChange} />
        {haveError ? <div className="invalid-feedback">{error}</div> : null}
        <Button type="submit" disabled={isSingingUp}>Зарегистрировать</Button>
      </Form>
    </>

  );
}

export default SingUpForm;
