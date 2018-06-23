import api from "../helpers/api";

export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS =
  "CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS";
export const FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS =
  "FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS";

export function fetchUsers() {
  return dispatch =>
    api.fetch("/users").then((response) => {
      dispatch({ type: FETCH_USERS_SUCCESS, response });
    });
}

export function createDirectMessage(data, router) {
  return dispatch =>
    api.post("/channels/direct_messages", data).then((response) => {
      dispatch({ type: CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS, response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function fetchUserDirectMessageChannels() {
  return dispatch =>
    api.fetch("/users/direct_messages").then((response) => {
      dispatch({ type: FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS, response });
    });
}
