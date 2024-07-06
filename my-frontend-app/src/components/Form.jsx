/* eslint-disable consistent-return */
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Navigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { useSelector } from 'react-redux';
import { useLoginMutation } from '../api';

function MyForm() {
  // eslint-disable-next-line no-unused-vars
  const [singIn, { error: errorMessage, isLoading: isSingingIn }] = useLoginMutation();
  const userData = useSelector((state) => state.user);

  const submitHandler = async (e) => {
    e.preventDefault();
    const username = e.target.nickname.value;
    const password = e.target.password.value;
    const body = { username, password };
    await singIn(body);
  };

  const initialValues = { nickname: '', password: '' };

  if (userData.token !== '') return <Navigate to="/" />;

  return (
    <Formik
      initialValues={initialValues}
    >
      <Form onSubmit={submitHandler}>
        <Field
          type="name"
          name="nickname"
          className="form-control"
        />
        <Field
          type="password"
          name="password"
          className="form-control"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={isSingingIn}
        >
          Войти
        </Button>
        <div className="invalid">{errorMessage?.data.message || ''}</div>
      </Form>
    </Formik>
  );
}

export default MyForm;
