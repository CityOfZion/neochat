import { reset } from 'redux-form';
import { Socket } from 'phoenix';
import api from '../helpers/api';
import { fetchUserChannels, connectToChannels } from './channels';
import { fetchUserDirectMessageChannels } from './direct_messages';

export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_REQUEST = 'AUTHENTICATION_REQUEST';
export const AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE';
export const LOGOUT = 'LOGOUT';

const WEBSOCKET_URL = process.env.REACT_APP_API_URL.replace(
  /(https|http)/,
  'ws',
).replace('/api', '');

function connectToSocket(dispatch) {
  const token = JSON.parse(localStorage.getItem('token'));
  const socket = new Socket(`${WEBSOCKET_URL}/socket`, {
    params: { token },
    logger: (kind, msg, data) => {
      // console.log(`${kind}: ${msg}`, data);
    },
  });
  socket.connect();
  dispatch({ type: SOCKET_CONNECTED, socket });
  return socket;
}

function setCurrentUser(dispatch, response) {
  localStorage.setItem('token', JSON.stringify(response.meta.token));
  dispatch({ type: AUTHENTICATION_SUCCESS, response });
  const userChannels = dispatch(fetchUserChannels());
  const userDirectMessage = dispatch(fetchUserDirectMessageChannels());
  const socket = connectToSocket(dispatch);
  Promise.all([userChannels, userDirectMessage]).then((f) => {
    dispatch(connectToChannels(socket));
  });
}

export function login(data, { history }) {
  return dispatch =>
    api.post('/sessions', data).then((response) => {
      setCurrentUser(dispatch, response);
      dispatch(reset('login'));
      history.push('/');
    });
}

export function signup(data, { history }) {
  return dispatch =>
    api.post('/users', data).then((response) => {
      setCurrentUser(dispatch, response);
      dispatch(reset('signup'));
      history.push('/');
    });
}

export function logout({ history }) {
  return dispatch =>
    api.delete('/sessions').then(() => {
      localStorage.removeItem('token');
      dispatch({ type: LOGOUT });
      history.push('/login');
    });
}

export function authenticate() {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATION_REQUEST });
    return api
      .post('/sessions/refresh')
      .then((response) => {
        setCurrentUser(dispatch, response);
      })
      .catch(() => {
        // console.warn("Failed to renew token");
        localStorage.removeItem('token');
        window.location = '/login';
      });
  };
}

export const unauthenticate = () => ({ type: AUTHENTICATION_FAILURE });
