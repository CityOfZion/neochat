import { reset } from "redux-form";
import api from "../helpers/api";

export const CHANNEL_CONNECTED_TO_PHX_CHANNEL =
  "CHANNEL_CONNECTED_TO_PHX_CHANNEL";
export const MESSAGE_CREATED = "MESSAGE_CREATED";
export const USER_LEFT_CHANNEL = "USER_LEFT_CHANNEL";
export const USER_JOINED_CHANNEL = "USER_JOINED_CHANNEL";

export function fetchChannels() {
  return dispatch =>
    api.fetch("/channels").then(response => {
      dispatch({ type: "FETCH_CHANNELS_SUCCESS", response });
    });
}

export function fetchUserChannels() {
  return dispatch =>
    api.fetch(`/users/channels`).then(response => {
      dispatch({ type: "FETCH_USER_CHANNELS_SUCCESS", response });
    });
}

export function createChannel(data, router) {
  return dispatch =>
    api.post("/channels", data).then(response => {
      dispatch({ type: "CREATE_CHANNEL_SUCCESS", response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function joinChannel(channelId, router) {
  return dispatch =>
    api.post(`/channels/${channelId}/join`).then(response => {
      dispatch({ type: "CHANNEL_JOINED", response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function getOptedOutUserChannel(channelId) {
  return api.fetch(`/channels/${channelId}/opted_out`);
}

export function optInUserForChannel(channelId, user_id) {
  return api.post(`/channels/${channelId}/opt_in`, { user_id });
}

export function connectToChannel(socket, channelId) {
  return dispatch => {
    if (!socket) {
      return false;
    }
    const phx_channel = socket.channel(`channels:${channelId}`);

    phx_channel.on("message_created", message => {
      dispatch({ type: MESSAGE_CREATED, message, channelId });
    });

    phx_channel.on("USER_JOINED_CHANNEL", message => {
      dispatch({ type: USER_JOINED_CHANNEL, message, channelId });
    });

    phx_channel.join().receive("ok", response => {
      dispatch({
        type: CHANNEL_CONNECTED_TO_PHX_CHANNEL,
        response,
        phx_channel
      });
    });

    return false;
  };
}

export function createMessage(phx_channel, data) {
  return dispatch =>
    new Promise((resolve, reject) => {
      phx_channel
        .push("new_message", data)
        .receive("ok", () => resolve(dispatch(reset("newMessage"))))
        .receive("error", () => reject());
    });
}
