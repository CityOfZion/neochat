import {
  CHANNEL_CONNECTED_TO_CHANNEL,
  USER_LEFT_CHANNEL,
  MESSAGE_CREATED
} from "../actions/channel";

const initialState = {
  channel: null,
  userStatus: [],
  currentChannel: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANNEL_CONNECTED_TO_CHANNEL:
      console.log(action);
      return {
        ...state,
        channel: action.channel,
        currentChannel: action.response.channel,
        userStatus: action.response.userStatus,
        messages: action.response.messages.reverse()
      };
    case USER_LEFT_CHANNEL:
      return initialState;
    case MESSAGE_CREATED:
      return {
        ...state,
        messages: [...state.messages, action.message]
      };
    default:
      return state;
  }
}
