import {
  CHANNEL_CONNECTED_TO_PHX_CHANNEL,
  MESSAGE_CREATED,
  USER_JOINED_CHANNEL
} from "../actions/channels";

const initialState = {
  all: [],
  currentUserChannels: [],
  channels: {},
  currentChannel: {}
};

const sortByUsername = (a, b) => (a.username > b.username ? 1 : 0);

export default function(state = initialState, action) {
  switch (action.type) {
    case "FETCH_CHANNELS_SUCCESS":
      return {
        ...state,
        all: action.response.data
      };
    case "FETCH_USER_CHANNELS_SUCCESS":
      return {
        ...state,
        currentUserChannels: action.response.data
      };
    case CHANNEL_CONNECTED_TO_PHX_CHANNEL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.response.channel.id]: {
            phx_channel: action.phx_channel,
            userStatus: action.response.userStatus.sort(sortByUsername),
            messages: action.response.messages.reverse(),
            channel: action.response.channel
          }
        }
      };
    case MESSAGE_CREATED:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            messages: [
              ...state.channels[action.channelId].messages,
              action.message
            ]
          }
        }
      };
    case USER_JOINED_CHANNEL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            userStatus: [
              ...state.channels[action.channelId].userStatus,
              action.message
            ].sort(sortByUsername)
          }
        }
      };
    case "CREATE_CHANNEL_SUCCESS":
      return {
        ...state,
        all: [action.response.data, ...state.all],
        currentUserChannels: [
          ...state.currentUserChannels,
          action.response.data
        ]
      };
    case "CHANNEL_JOINED":
      return {
        ...state,
        currentUserChannels: [
          ...state.currentUserChannels,
          action.response.data
        ]
      };
    default:
      return state;
  }
}
