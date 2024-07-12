/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useAddChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { selectors } from '../slices/channelsSlice';

function CreateChannelModal(props) {
  const [createChannel, { isLoading: isCreatingChannel }] = useAddChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const { show, handleClose } = props;

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      newChannel: '',
    },
    onSubmit: async (value) => {
      const { newChannel } = value;
      try {
        await validate(newChannel, channelsNames);
        createChannel({ name: newChannel });
        formik.values.newChannel = '';
        handleClose();
      } catch (validationError) {
        setError(...validationError.errors);
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Control type="name" name="newChannel" isInvalid={haveError} onChange={formik.handleChange} value={formik.values.newChannel} />
          {haveError ? <div className="invalid-feedback">{error}</div> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button type="submit" variant="primary" disabled={isCreatingChannel}>
            Создать
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateChannelModal;
