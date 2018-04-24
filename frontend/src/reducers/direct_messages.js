import {
  FETCH_USERS_SUCCESS,
  FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS,
  CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS
} from "../actions/direct_messages";

const initialState = {
  users: [],
  currentUserDirectMessageChannels: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.response.data
      };
    case FETCH_DIRECT_MESSSAGE_CHANNELS_SUCCESS:
      return {
        ...state,
        currentUserDirectMessageChannels: action.response.data
      };
    case CREATE_DIRECT_MESSAGE_CHANNEL_SUCCESS:
      return {
        ...state,
        currentUserDirectMessageChannels: [
          ...state.currentUserDirectMessageChannels,
          action.response.data
        ]
      };
    default:
      return state;
  }
}
