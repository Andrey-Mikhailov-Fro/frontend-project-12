/* eslint-disable react/prop-types */
import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEditChannelMutation } from '../services/channelsApi';
import validate from '../services/validationChannel';
import { selectors } from '../slices/channelsSlice';
import AppContext from '../services/AppContext';
import { hide } from '../slices/modalSlice';

const EditChannelModal = () => {
  const [editChannel, { isLoading: isEditingChannel }] = useEditChannelMutation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const [error, setError] = useState('');
  const filter = useContext(AppContext);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(hide());
  const { channelToEdit } = useSelector((state) => state.modal);

  const { t } = useTranslation();

  const haveError = error !== '';

  const formik = useFormik({
    initialValues: {
      renamedChannel: channelToEdit.name,
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      const { renamedChannel } = value;
      const checkedRenamedChannel = filter.clean(renamedChannel);
      try {
        await validate(renamedChannel.trim(), channelsNames);
        const request = { id: channelToEdit.id, name: checkedRenamedChannel.trim() };
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
        inputRef.current.select();
      }
    };

    focus();
  }, []);

  return (
    <>
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
    </>
  );
};

export default EditChannelModal;
