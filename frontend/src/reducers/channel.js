import {
  CHANNEL_CONNECTED_TO_CHANNEL,
  USER_LEFT_CHANNEL,
  USER_JOINED_CHANNEL,
  MESSAGE_CREATED
} from "../actions/channel";

const initialState = {
  channel: null,
  userStatus: [],
  currentChannel: {}
};

const sortByUsername = (a, b) => (a.username > b.username ? 1 : 0);

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANNEL_CONNECTED_TO_CHANNEL:
      return {
        ...state,
        channel: action.channel,
        currentChannel: action.response.channel,
        userStatus: action.response.userStatus.sort(sortByUsername),
        messages: action.response.messages.reverse()
      };
    case USER_JOINED_CHANNEL:
      return {
        ...state,
        userStatus: [...state.userStatus, action.message].sort(sortByUsername)
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
