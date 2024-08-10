/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CreateChannelModal from './CreateChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import { useGetChannelsQuery } from '../services/channelsApi';
import { setActive, selectors } from '../slices/channelsSlice';
import EditChannelModal from './EditChannelModal';

const ChannelsList = () => {
  const { isLoading } = useGetChannelsQuery();
  const [channelToEdit, setChannelToEdit] = useState(1);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showDeleteModal, setShowDelete] = useState(false);
  const [showEditModal, setShowEdit] = useState(false);
  const active = useSelector((state) => state.channels.active);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const channels = useSelector(selectors.selectAll);

  const editingChannelName = () => channels
    .find((channel) => channel.id === channelToEdit.toString())
    ?.name;

  useEffect(() => {
    const scroll = () => {
      if (!isLoading) {
        const activeChannelButton = document.querySelector(`#channel-${active}`);
        activeChannelButton.scrollIntoView();
      }
    };
    scroll();
  }, [active]);

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
    dispatch(setActive(id));
  };

  const renderListItem = (item) => {
    const isActive = active === item.id;

    const activeState = isActive ? 'active' : 'nonActive';

    const itemsClassConfig = {
      active: {
        dropdown: 'flex-grow-0 p-0 m-0 dropdown-toggle-split btn btn-secondary',
        dropdownVariant: 'secondary',
        channelNameBtn: 'w-100 rounded-0 text-start text-truncate btn btn-secondary',
        listItem: 'd-flex dropdown btn-group p-0 bg-secondary',
      },
      nonActive: {
        dropdown: 'flex-grow-0 p-0 m-0 dropdown-toggle-split btn btn-light',
        dropdownVariant: 'light',
        channelNameBtn: 'w-100 rounded-0 text-start text-truncate btn',
        listItem: 'd-flex dropdown btn-group p-0',
      },
    };

    const dropdownBtn = (
      <DropdownButton
        as={ButtonGroup}
        title={<span className="visually-hidden p-0 m-0 align-self-start">{t('chat.dropdownButton.hiddenLabel')}</span>}
        id="bg-nested-dropdown"
        className={itemsClassConfig[activeState].dropdown}
        variant={itemsClassConfig[activeState].dropdownVariant}
        size="sm"
      >
        <Dropdown.Item eventKey="1" className="bg-danger rounded text-light" onClick={deleteHandler(item.id)}>{t('chat.dropdownButton.delete')}</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={updateHandler(item.id)}>{t('chat.dropdownButton.edit')}</Dropdown.Item>
      </DropdownButton>
    );

    return (
      <ListGroup.Item as="li" key={item.id} className={itemsClassConfig[activeState].listItem}>
        <button
          type="button"
          id={`channel-${item.id}`}
          onClick={isActive ? null : clickHandler(item.id)}
          className={itemsClassConfig[activeState].channelNameBtn}
        >
          {`# ${item.name}`}
        </button>
        {item.removable ? dropdownBtn : null}
      </ListGroup.Item>
    );
  };

  return (
    <>
      <CreateChannelModal
        show={showCreateChannel}
        handleClose={closeModalHandler(setShowCreateChannel)}
      />
      <DeleteChannelModal
        show={showDeleteModal}
        handleClose={closeModalHandler(setShowDelete)}
        toDelete={channelToEdit}
      />
      <EditChannelModal
        show={showEditModal}
        handleClose={closeModalHandler(setShowEdit)}
        toEdit={channelToEdit}
        nameToEdit={editingChannelName()}
      />
      <div className="d-flex mt-1 flex-row justify-content-between p-4">
        <b className="align-content-center text-center col mx-3 w-auto">{t('chat.channels')}</b>
        <Button
          style={{ maxWidth: '50px' }}
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
};

export default ChannelsList;
