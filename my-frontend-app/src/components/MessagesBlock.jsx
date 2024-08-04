/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import * as messagesApi from '../services/messagesApi';
import { selectors as messagesSelectors, newMessage, removeMessage } from '../slices/messagesSlice';
import { selectors as channelsSelectors } from '../slices/channelsSlice';

filter.loadDictionary(navigator.language);

function MessagesList(props) {
  const { isLoading } = messagesApi.useGetMessagesQuery();
  const [sendMessage, { isLoading: isSendingMessage }] = messagesApi.useAddMessageMutation();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { active, socket } = props;

  const userData = useSelector((state) => state.user);
  const messages = useSelector(messagesSelectors.selectAll);
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannel = channels.find((chan) => chan.id === active);

  useEffect(() => {
    const scroll = () => {
      if (isLoading) {
        setTimeout(scroll, 100);
      } else {
        const lastNumber = Math.max(...messages.map((message) => message.id));
        const lastMessage = document.querySelector(`#message-${lastNumber}`);
        lastMessage.scrollIntoView();
      }
    };

    scroll();
  }, [messages]);

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    const messageBody = e.target.message.value;
    const message = { body: messageBody, channelId: active, username: userData.user };
    e.target.message.value = '';
    sendMessage(message);
  };

  socket.on('newMessage', (message) => {
    dispatch(newMessage(message));
  });
  socket.on('removeMessage', ({ id }) => {
    dispatch(removeMessage(id));
  });

  const renderListItem = (item) => {
    const checkedMessage = filter.clean(item.body);
    return (
      <Container key={item.id} fluid="true" className="d-flex flex-row">
        <ListGroup.Item
          className="w-100 text-break mb-2"
          id={`message-${item.id}`}
        >
          {`${item.username}: ${checkedMessage}`}
        </ListGroup.Item>
      </Container>
    );
  };

  const currentChannelMessages = messages
    .filter((item) => item.channelId === active)
    .map(renderListItem);

  return (
    <Container className="d-flex h-100 w-100 p-0 flex-column justify-content-end">
      <div className="bg-secondary text-white w-100 mb-4 p-3 shadow-sm small">
        <p><b>{`# ${currentChannel?.name}` || 'Loading...'}</b></p>
        <span>{t('chat.count', { count: currentChannelMessages.length })}</span>
      </div>
      <ListGroup data-spy="scroll" className="chat-messages w-100 align-content-bottom overflow-auto m-0 px-5">
        {isLoading ? 'Loading...' : currentChannelMessages}
      </ListGroup>
      <div className="mt-auto m-0 p-3 w-100">
        <Formik initialValues={{ message: '' }}>
          <Form noValidate className="border rounded-2" onSubmit={messageSubmitHandler}>
            <div className="input-group has-validation">
              <Form.Control
                type="name"
                name="message"
                aria-label={t('labels.newMessage')}
                placeholder={t('chat.message')}
              />
              <Button
                type="submit"
                className="btn btn-group-vertical border-primary bg-white text-primary"
                disabled={isSendingMessage}
              >
                {t('chat.send')}
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </Container>

  );
}

export default MessagesList;
