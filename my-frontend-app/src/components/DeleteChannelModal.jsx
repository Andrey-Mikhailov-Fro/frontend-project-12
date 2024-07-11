/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { useRemoveChannelMutation } from '../services/channelsApi';
import { selectors } from '../slices/messagesSlice';
import { useRemoveMessageMutation } from '../services/messagesApi';

function DeleteChannelModal(props) {
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();
  const [removeMessage] = useRemoveMessageMutation();
  const {
    show, handleClose, toDelete, activeChnl, changeChnl,
  } = props;
  const messagesToDelete = useSelector(selectors.selectAll)
    .filter((message) => message.channelId === toDelete);

  const hanleRemove = (id) => () => {
    if (activeChnl === id) changeChnl('1');
    removeChannel(id);
    messagesToDelete.forEach((message) => removeMessage(message.id));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>Уверены?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отменить
        </Button>
        <Button variant="danger" disabled={isRemovingChannel} onClick={hanleRemove(toDelete)}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteChannelModal;
