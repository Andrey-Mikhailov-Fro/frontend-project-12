/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { useEditChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { selectors } from '../slices/channelsSlice';

filter.loadDictionary(navigator.language);

const EditChannelModal = (props) => {
  const [editChannel, { isLoading: isEditingChannel }] = useEditChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const {
    show, handleClose, toEdit, nameToEdit,
  } = props;

  const { t } = useTranslation();

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      renamedChannel: nameToEdit,
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      const { renamedChannel } = value;
      const checkedRenamedChannel = filter.clean(renamedChannel);
      try {
        await validate(renamedChannel.trim(), channelsNames);
        const request = { id: toEdit, name: checkedRenamedChannel.trim() };
        editChannel(request);
        formik.values.renamedChannel = '';
        handleClose();
      } catch (validationError) {
        setError(t(...validationError.errors));
      }
    },
  });

  const inputRef = useRef(null);

  useEffect(() => {
    const focus = () => {
      if (inputRef.current === null) {
        setTimeout(focus, 100);
      } else {
        inputRef.current.focus();
      }
    };

    focus();
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.editHeader')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Control
            type="name"
            name="renamedChannel"
            id="renamedChannel"
            isInvalid={haveError}
            onChange={formik.handleChange}
            value={formik.values.renamedChannel}
            ref={inputRef}
          />
          <label htmlFor="renamedChannel" className="visually-hidden">{t('labels.channelName')}</label>
          {haveError ? <div className="invalid-feedback">{error}</div> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isEditingChannel}>
            {t('modals.confirmEdit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditChannelModal;
