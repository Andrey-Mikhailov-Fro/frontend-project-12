import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, Field } from 'formik';

function MyForm() {
  const initialValues = { nickname: '', password: '' };

  return (
    <Formik
      initialValues={initialValues}
    >
      <Form>
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
        <Button variant="primary" type="submit">
          Войти
        </Button>
      </Form>
    </Formik>
  );
}

export default MyForm;
