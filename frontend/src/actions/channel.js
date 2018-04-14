import { reset } from "redux-form";

export const CHANNEL_CONNECTED_TO_PHX_CHANNEL =
  "CHANNEL_CONNECTED_TO_PHX_CHANNEL";
export const MESSAGE_CREATED = "MESSAGE_CREATED";
export const USER_LEFT_CHANNEL = "USER_LEFT_CHANNEL";
export const USER_JOINED_CHANNEL = "USER_JOINED_CHANNEL";

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

// export function leaveChannel(channel) {
//   return dispatch => {
//     if (channel) {
//       channel.leave();
//     }
//     dispatch({type: USER_LEFT_CHANNEL});
//   };
// }
