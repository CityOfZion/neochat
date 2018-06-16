import { reset } from 'redux-form';
import { Presence } from 'phoenix';
import api from '../helpers/api';

export const CHANNEL_CONNECTED_TO_PHX_CHANNEL =
  'CHANNEL_CONNECTED_TO_PHX_CHANNEL';
export const MESSAGE_CREATED = 'MESSAGE_CREATED';
export const USER_JOINED_CHANNEL = 'USER_JOINED_CHANNEL';
export const MESSAGES_READED = 'MESSAGE_READED';
export const ROOM_PRESENCE_UPDATE = 'ROOM_PRESENCE_UPDATE';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CHANNEL_JOINED = 'CHANNEL_JOINED';
export const FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
export const FETCH_USER_CHANNELS_SUCCESS = 'FETCH_USER_CHANNELS_SUCCESS';
export const MESSAGE_DELETED = 'MESSAGE_DELETED';

const syncPresentUsers = (dispatch, presences, channelId) => {
  const presentUsers = [];
  Presence.list(presences, (id, { metas: [first] }) => first.user).map(user =>
    presentUsers.push(user));
  dispatch({ type: ROOM_PRESENCE_UPDATE, channelId, presentUsers });
};

export function fetchChannels() {
  return dispatch =>
    api.fetch('/channels').then((response) => {
      dispatch({ type: FETCH_CHANNELS_SUCCESS, response });
    });
}

export function fetchUserChannels() {
  return dispatch =>
    api.fetch('/users/channels').then((response) => {
      dispatch({ type: FETCH_USER_CHANNELS_SUCCESS, response });
    });
}

export function createChannel(data, router) {
  return dispatch =>
    api.post('/channels', data).then((response) => {
      dispatch({ type: CREATE_CHANNEL_SUCCESS, response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function joinChannel(channelId, router) {
  return dispatch =>
    api.post(`/channels/${channelId}/join`).then((response) => {
      dispatch({ type: CHANNEL_JOINED, response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function getOptedOutUserChannel(channelId) {
  return api.fetch(`/channels/${channelId}/opted_out`);
}

export function optInUserForChannel(channelId, user_id) {
  return api.post(`/channels/${channelId}/opt_in`, { user_id });
}

export function connectToChannels(socket) {
  return (dispatch, getState) => {
    const { currentUserDirectMessageChannels } = getState().direct_messages;
    const { currentUserChannels } = getState().channels;

    currentUserDirectMessageChannels.forEach(({ id }) => {
      dispatch(connectToChannel(socket, id));
    });

    currentUserChannels.forEach(({ id }) => {
      dispatch(connectToChannel(socket, id));
    });
  };
}

export function connectToChannel(socket, channelId) {
  return (dispatch) => {
    if (!socket) {
      return false;
    }
    const phx_channel = socket.channel(`channels:${channelId}`);
    let presences = {};

    phx_channel.on('presence_state', (state) => {
      presences = Presence.syncState(presences, state);
      syncPresentUsers(dispatch, presences, channelId);
    });

    phx_channel.on('presence_diff', (diff) => {
      presences = Presence.syncDiff(presences, diff);
      syncPresentUsers(dispatch, presences, channelId);
    });

    phx_channel.on('message_created', (message) => {
      dispatch({ type: MESSAGE_CREATED, message, channelId });
    });

    phx_channel.on('message_deleted', (message) => {
      const { id: messageId } = message;
      dispatch({ type: MESSAGE_DELETED, messageId, channelId });
    });

    phx_channel.on(USER_JOINED_CHANNEL, (message) => {
      dispatch({ type: USER_JOINED_CHANNEL, message, channelId });
    });

    phx_channel.join().receive('ok', (response) => {
      dispatch({
        type: CHANNEL_CONNECTED_TO_PHX_CHANNEL,
        response,
        phx_channel,
      });
    });

    return false;
  };
}

export function messageReaded(channelId) {
  return (dispatch) => {
    dispatch({ type: MESSAGES_READED, channelId });
  };
}

export function uploadFile(phx_channel, files) {
  return dispatch =>
    api.upload('/upload', files[0]).then(object =>
      new Promise((resolve, reject) => {
        phx_channel
          .push('new_message', {
            text: JSON.stringify({ ...object, neochat: '' }),
          })
          .receive('ok', () => resolve(dispatch(reset('newMessage'))))
          .receive('error', () => reject());
      }));
}

export function createMessage(phx_channel, data) {
  return dispatch =>
    new Promise((resolve, reject) => {
      phx_channel
        .push('new_message', data)
        .receive('ok', () => resolve(dispatch(reset('newMessage'))))
        .receive('error', () => reject());
    });
}

export function deleteMessage(phx_channel, id) {
  return dispatch =>
    new Promise((resolve, reject) => {
      phx_channel
        .push('delete_message', { id })
        .receive('ok', () => resolve())
        .receive('error', () => reject());
    });
}
