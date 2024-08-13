import React, { useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetChannelsQuery } from '../services/channelsApi';
import { setActive, selectors } from '../slices/channelsSlice';
import { setChannelToEdit, setType, show } from '../slices/modalSlice';

const ChannelsList = () => {
  const { isLoading } = useGetChannelsQuery();
  const active = useSelector((state) => state.channels.active);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const channels = useSelector(selectors.selectAll);

  useEffect(() => {
    const scroll = () => {
      if (!isLoading) {
        const activeChannelButton = document.querySelector(`#channel-${active}`);
        if (activeChannelButton === null) {
          scroll();
        } else {
          activeChannelButton.scrollIntoView();
        }
      }
    };
    scroll();
  }, [active]);

  const modalHandler = (type, data = { name: '', id: '' }) => () => {
    dispatch(setChannelToEdit(data));
    dispatch(setType(type));
    dispatch(show());
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

    const dropdownItemsClassConfig = {
      deleteButton: 'bg-danger mt-1 mb-1 rounded text-white',
      editButton: 'bg-secondary rounded text-white',
    };

    const dataForEdit = {
      name: item.name,
      id: item.id,
    };

    const dropdownBtn = (
      <DropdownButton
        as={ButtonGroup}
        title={<span className="visually-hidden p-0 m-0 align-self-start">{t('chat.dropdownButton.hiddenLabel')}</span>}
        id="bg-nested-dropdown"
        className={itemsClassConfig[activeState].dropdown}
        variant={itemsClassConfig[activeState].dropdownVariant}
        menuVariant="m-0 p-0 rounded"
        size="sm"
      >
        <Dropdown.Item
          eventKey="1"
          className={dropdownItemsClassConfig.deleteButton}
          onClick={modalHandler('delete', dataForEdit)}
        >
          {t('chat.dropdownButton.delete')}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="2"
          className={dropdownItemsClassConfig.editButton}
          onClick={modalHandler('edit', dataForEdit)}
        >
          {t('chat.dropdownButton.edit')}
        </Dropdown.Item>
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
      <div className="d-flex mt-1 flex-row justify-content-between p-4">
        <b className="align-content-center text-center col mx-3 w-auto">{t('chat.channels')}</b>
        <Button
          style={{ maxWidth: '50px' }}
          className="p-1 border-primary bg-white text-primary col m-0 pb-2"
          onClick={modalHandler('create')}
        >
          <b>+</b>
        </Button>
      </div>
      <ListGroup className="nav flex-column nav-pills nav-fill px-2 mb-3 m-0 overflow-auto h-100 d-block">
        {isLoading ? <Spinner animation="border" role="status" /> : channels.map(renderListItem)}
      </ListGroup>
    </>
  );
};

export default ChannelsList;
