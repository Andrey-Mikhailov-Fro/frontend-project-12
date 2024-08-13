/* eslint-disable react/prop-types */
import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAddChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { setActive, selectors } from '../slices/channelsSlice';
import AppContext from '../services/AppContext';
import { hide } from '../slices/modalSlice';

const CreateChannelModal = () => {
  const [createChannel,
    { isLoading: isCreatingChannel }] = useAddChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const filter = useContext(AppContext);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(hide());

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
        await validate(newChannel.trim(), channelsNames);
        const newActive = await createChannel({ name: checkedChannel.trim() });
        dispatch(setActive(newActive.data.id));
        formik.values.newChannel = '';
        setError('');
        handleClose();
      } catch (validationError) {
        if (validationError.errors === undefined) return;
        const [errorText] = validationError.errors;
        setError(t(errorText));
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
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.createHeader')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Control
            ref={inputRef}
            type="name"
            name="newChannel"
            id="newChannel"
            isInvalid={haveError}
            onChange={formik.handleChange}
            value={formik.values.newChannel}
          />
          <label htmlFor="newChannel" className="visually-hidden">{t('labels.channelName')}</label>
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
    </>
  );
};

export default CreateChannelModal;
