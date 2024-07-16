/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { useAddChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { selectors } from '../slices/channelsSlice';

filter.loadDictionary(navigator.language);

function CreateChannelModal(props) {
  const [createChannel,
    { isLoading: isCreatingChannel }] = useAddChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const { show, handleClose } = props;

  const { t } = useTranslation();

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      newChannel: '',
    },
    onSubmit: async (value) => {
      const { newChannel } = value;
      const checkedChannel = filter.clean(newChannel);
      try {
        await validate(newChannel, channelsNames);
        await createChannel({ name: checkedChannel });
        formik.values.newChannel = '';
        handleClose();
      } catch (validationError) {
        if (validationError.errors === undefined) return;
        const [errorText] = validationError.errors;
        setError(t(errorText));
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.createHeader')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Control type="name" name="newChannel" isInvalid={haveError} onChange={formik.handleChange} value={formik.values.newChannel} />
          {haveError ? <div className="invalid-feedback">{error}</div> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isCreatingChannel}>
            {t('modals.confirmCreate')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateChannelModal;
