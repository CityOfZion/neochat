import {
  FETCH_CHANNELS_SUCCESS,
  FETCH_USER_CHANNELS_SUCCESS,
  CHANNEL_CONNECTED_TO_PHX_CHANNEL,
  MESSAGE_CREATED,
  USER_JOINED_CHANNEL,
  MESSAGES_READED,
  ROOM_PRESENCE_UPDATE,
  CREATE_CHANNEL_SUCCESS,
  CHANNEL_JOINED,
  MESSAGE_DELETED,
  MESSAGE_UPDATED,
  LEFT_CHANNEL,
} from "../actions/channels";

const initialState = {
  all: [],
  currentUserChannels: [],
  channels: {},
  currentChannel: {},
};

const getUserStatus = (userList, presentUsers) => {
  const presentUsersId = presentUsers.map(({ id }) => id);
  const onlineUsers = userList
    .filter(({ id }) => presentUsersId.includes(id))
    .map(user => ({ ...user, status: "online" }))
    .sort(sortByUsername);
  const offlineUsers = userList
    .filter(({ id }) => !presentUsersId.includes(id))
    .map(user => ({ ...user, status: "offline" }))
    .sort(sortByUsername);

  return { offline: offlineUsers, online: onlineUsers };
};
const sortByUsername = (a, b) => (a.username > b.username ? 1 : 0);

export default function (state = initialState, action) {
  let newUserList = [];
  switch (action.type) {
    case FETCH_CHANNELS_SUCCESS:
      return {
        ...state,
        all: action.response.data,
      };
    case FETCH_USER_CHANNELS_SUCCESS:
      return {
        ...state,
        currentUserChannels: action.response.data,
      };
    case CHANNEL_CONNECTED_TO_PHX_CHANNEL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.response.channel.id]: {
            phx_channel: action.phx_channel,
            userList: action.response.userList,
            userStatus: getUserStatus(action.response.userList, []),
            presentUsers: [],
            messages: action.response.messages.reverse(),
            newMessages: [],
            channel: action.response.channel,
          },
        },
      };
    case MESSAGE_CREATED:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            newMessages: [
              ...state.channels[action.channelId].newMessages,
              action.message,
            ],
          },
        },
      };
    case MESSAGE_DELETED:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            messages: state.channels[action.channelId].messages
              .filter(message => message.id !== action.messageId),
          },
        },
      };
    case MESSAGE_UPDATED:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            messages: state.channels[action.channelId].messages
              .map(message => (message.id !== action.message.id ? message : action.message)),
          },
        },
      };
    case MESSAGES_READED:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            messages: state.channels[action.channelId].messages
              .concat(state.channels[action.channelId].newMessages),
            newMessages: [],
          },
        },
      };
    case USER_JOINED_CHANNEL:
      newUserList = [
        ...state.channels[action.channelId].userList,
        action.message,
      ];
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            userList: newUserList,
            userStatus: getUserStatus(
              newUserList,
              state.channels[action.channelId].presentUsers,
            ),
          },
        },
      };
    case ROOM_PRESENCE_UPDATE:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            presentUsers: action.presentUsers,
            userStatus: getUserStatus(
              state.channels[action.channelId].userList,
              action.presentUsers,
            ),
          },
        },
      };
    case CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        all: [action.response.data, ...state.all],
        currentUserChannels: [
          ...state.currentUserChannels,
          action.response.data,
        ],
      };
    case CHANNEL_JOINED:
      return {
        ...state,
        currentUserChannels: [
          ...state.currentUserChannels,
          action.response.data,
        ],
      };
    case LEFT_CHANNEL:
      return {
        ...state,
        currentUserChannels: state.currentUserChannels
          .filter(channel => channel.id !== action.channelId),
      };
    default:
      return state;
  }
}
