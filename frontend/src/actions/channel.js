import { reset } from "redux-form";

export function connectToChannel(socket, channelId) {
  return dispatch => {
    if (!socket) {
      return false;
    }
    const channel = socket.channel(`channels:${channelId}`);

    channel.on("message_created", message => {
      dispatch({ type: "MESSAGE_CREATED", message });
    });

    channel.join().receive("ok", response => {
      dispatch({ type: "CHANNEL_CONNECTED_TO_CHANNEL", response, channel });
    });

    return false;
  };
}

export function leaveChannel(channel) {
  return dispatch => {
    if (channel) {
      channel.leave();
    }
    dispatch({ type: "USER_LEFT_CHANNEL" });
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
