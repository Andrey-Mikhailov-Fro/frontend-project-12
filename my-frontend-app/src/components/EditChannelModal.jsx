/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useEditChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { selectors } from '../slices/channelsSlice';

function EditChannelModal(props) {
  const [editChannel, { isLoading: isEditingChannel }] = useEditChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const { show, handleClose, toEdit } = props;

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      renamedChannel: '',
    },
    onSubmit: async (value) => {
      const { renamedChannel } = value;
      try {
        await validate(renamedChannel, channelsNames);
        const request = { id: toEdit, name: renamedChannel };
        editChannel(request);
        formik.values.renamedChannel = '';
        handleClose();
      } catch (validationError) {
        setError(...validationError.errors);
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Control type="name" name="renamedChannel" isInvalid={haveError} onChange={formik.handleChange} value={formik.values.renamedChannel} />
          {haveError ? <div className="invalid-feedback">{error}</div> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button type="submit" variant="primary" disabled={isEditingChannel}>
            Переименовать
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditChannelModal;
