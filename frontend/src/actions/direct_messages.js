import api from "../helpers/api";

export function fetchUsers() {
  return dispatch =>
    api.fetch("/users").then(response => {
      dispatch({ type: "FETCH_USERS_SUCCESS", response });
    });
}

export function createDirectMessage(data, router) {
  return dispatch =>
    api.post("/channels/dm", data).then(response => {
      dispatch({ type: "CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS", response });
      router.history.push(`/channel/${response.data.id}`);
    });
}

export function fetchUserDirectMessageChannels() {
  return dispatch =>
    api.fetch(`/users/direct_messages`).then(response => {
      dispatch({ type: "FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS", response });
    });
}
