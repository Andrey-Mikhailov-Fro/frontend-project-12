/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/esm/Container';
import { toast } from 'react-toastify';
import CreateChannelModal from './CreateChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import { useGetChannelsQuery } from '../services/channelsApi';
import {
  newChannel, updateChannel, removeChannel, selectors,
} from '../slices/channelsSlice';
import EditChannelModal from './EditChannelModal';

function ChannelsList(props) {
  const { isLoading } = useGetChannelsQuery();
  const [channelToEdit, setChannelToEdit] = useState(0);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showDeleteModal, setShowDelete] = useState(false);
  const [showEditModal, setShowEdit] = useState(false);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const channels = useSelector(selectors.selectAll);

  const { active, onChangeChannel, socket } = props;

  socket.on('newChannel', (channel) => {
    dispatch(newChannel(channel));
    toast.success(t('toasts.create'), { closeOnClick: true, toastId: '1' });
  });
  socket.on('removeChannel', ({ id }) => {
    dispatch(removeChannel(id));
    toast.success(t('toasts.delete'), { toastId: '2' });
  });
  socket.on('renameChannel', (channel) => {
    const changes = { name: channel.name };
    dispatch(updateChannel({ id: channel.id, changes }));
    toast.success(t('toasts.edit'), { toastId: '3' });
  });

  const openModalHandler = (shownFunc) => () => shownFunc(true);
  const closeModalHandler = (shownFunc) => () => shownFunc(false);

  const deleteHandler = (id) => () => {
    setChannelToEdit(id);
    setShowDelete(true);
  };
  const updateHandler = (id) => () => {
    setChannelToEdit(id);
    setShowEdit(true);
  };
  const clickHandler = (id) => () => {
    onChangeChannel(id);
  };

  const renderListItem = (item) => {
    const isActive = active === item.id;

    const dropdownBtn = (
      <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown" className="btn w-25 btn-group-vertical p-0">
        <span className="visually-hidden">{t('chat.dropdownButton.hiddenLabel')}</span>
        <Dropdown.Item eventKey="1" onClick={deleteHandler(item.id)}>{t('chat.dropdownButton.delete')}</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={updateHandler(item.id)}>{t('chat.dropdownButton.edit')}</Dropdown.Item>
      </DropdownButton>
    );

    const classNameListItem = item.removable ? 'w-75 rounded-lg' : 'w-100';

    if (isActive) {
      return (
        <Container key={item.id} className="m-1 p-0 w-auto row">
          <ListGroup.Item
            as="button"
            id={item.id}
            active
            className={classNameListItem}
          >
            {`# ${item.name}`}
          </ListGroup.Item>
          {item.removable ? dropdownBtn : null}
        </Container>
      );
    }

    return (
      <Container key={item.id} className="m-1 p-0 w-auto row">
        <ListGroup.Item
          as="button"
          id={item.id}
          action
          onClick={clickHandler(item.id)}
          className={classNameListItem}
        >
          {`# ${item.name}`}
        </ListGroup.Item>
        {item.removable ? dropdownBtn : null}
      </Container>
    );
  };

  return (
    <>
      <CreateChannelModal
        show={showCreateChannel}
        handleClose={closeModalHandler(setShowCreateChannel)}
        activeChnl={active}
        changeChnl={onChangeChannel}
      />
      <DeleteChannelModal
        show={showDeleteModal}
        handleClose={closeModalHandler(setShowDelete)}
        toDelete={channelToEdit}
        activeChnl={active}
        changeChnl={onChangeChannel}
      />
      <EditChannelModal
        show={showEditModal}
        handleClose={closeModalHandler(setShowEdit)}
        toEdit={channelToEdit}
      />
      <div className="d-flex mt-1 flex-row justify-content-between p-4">
        <b className="align-content-center col mx-3 w-auto">{t('chat.channels')}</b>
        <Button
          className="p-1 border-primary bg-white text-primary col m-0 pb-2"
          onClick={openModalHandler(setShowCreateChannel)}
        >
          <b>+</b>
        </Button>
      </div>
      <ListGroup className="nav flex-column nav-pills nav-fill px-2 mb-3 m-0 overflow-auto h-100 d-block">
        {isLoading ? 'Loading' : channels.map(renderListItem)}
      </ListGroup>
    </>
  );
}

export default ChannelsList;
