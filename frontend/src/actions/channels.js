import api from "../helpers/api";

export function fetchChannels() {
  return dispatch =>
    api.fetch("/channels").then(response => {
      dispatch({ type: "FETCH_CHANNELS_SUCCESS", response });
    });
}

export function fetchUserChannels(userId) {
  return dispatch =>
    api.fetch(`/users/channels`).then(response => {
      dispatch({ type: "FETCH_USER_CHANNELS_SUCCESS", response });
    });
}

export function createChannel(data, router) {
  return dispatch =>
    api.post("/channels", data).then(response => {
      dispatch({ type: "CREATE_CHANNEL_SUCCESS", response });
      router.history.push(`/r/${response.data.id}`);
    });
}

export function joinChannel(channelId, router) {
  return dispatch =>
    api.post(`/channels/${channelId}/join`).then(response => {
      dispatch({ type: "CHANNEL_JOINED", response });
      router.history.push(`/r/${response.data.id}`);
    });
}

export function getOptedOutUserChannel(channelId) {
  return api.fetch(`/channels/${channelId}/opted_out`);
}

export function optInUserForChannel(channelId, user_id) {
  return api.post(`/channels/${channelId}/opt_in`, { user_id });
}
