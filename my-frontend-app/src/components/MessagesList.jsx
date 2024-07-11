/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as messagesApi from '../services/messagesApi';
import { selectors, newMessage, removeMessage } from '../slices/messagesSlice';

function MessagesList(props) {
  const { isLoading } = messagesApi.useGetMessagesQuery();
  const [deleteMessage, { isLoading: isRemovingMessage }] = messagesApi.useRemoveMessageMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = messagesApi.useAddMessageMutation();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user);
  const messages = useSelector(selectors.selectAll);

  const { active, socket } = props;

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

  const handleDelete = (id) => () => {
    deleteMessage(id);
  };

  const renderListItem = (item) => (
    <Container key={item.id} fluid="true" className="d-flex flex-row justify-content-between">
      <ListGroup.Item
        className="w-100"
        id={item.id}
      >
        {`${item.username}: ${item.body}`}
      </ListGroup.Item>
      <Button className="btn-secondary" disabled={isRemovingMessage} onClick={handleDelete(item.id)} />
    </Container>
  );

  return (
    <>
      <ListGroup>
        {isLoading ? 'Loading...' : messages.filter((item) => item.channelId === active).map(renderListItem)}
      </ListGroup>
      <Formik initialValues={{ message: '' }}>
        <Form noValidate className="py-1 border rounded-2" onSubmit={messageSubmitHandler}>
          <div className="input-group has-validation">
            <Form.Control
              type="name"
              name="message"
            />
            <Button type="submit" className="btn btn-group-vertical" disabled={isSendingMessage} />
          </div>
        </Form>
      </Formik>
    </>

  );
}

export default MessagesList;
