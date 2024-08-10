/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRemoveChannelMutation } from '../services/channelsApi';
import { selectors } from '../slices/messagesSlice';
import { useRemoveMessageMutation } from '../services/messagesApi';

const DeleteChannelModal = (props) => {
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();
  const [removeMessage] = useRemoveMessageMutation();
  const {
    show, handleClose, toDelete,
  } = props;
  const messagesToDelete = useSelector(selectors.selectAll)
    .filter((message) => message.channelId === toDelete);

  const { t } = useTranslation();

  const hanleRemove = (id) => () => {
    removeChannel(id);
    messagesToDelete.forEach((message) => removeMessage(message.id));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.deleteHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('modals.deleteBody')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modals.cancel')}
        </Button>
        <Button variant="danger" disabled={isRemovingChannel} onClick={hanleRemove(toDelete)}>
          {t('modals.confirmDelete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;
