import {
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  SOCKET_CONNECTED,
} from "../actions/session";

const initialState = {
  isAuthenticated: false,
  willAuthenticate: true,
  currentUser: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_REQUEST:
      return {
        ...state,
        willAuthenticate: true,
      };
    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        willAuthenticate: false,
        isAuthenticated: true,
        currentUser: action.response.data,
      };
    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        willAuthenticate: false,
      };
    case LOGOUT:
      return {
        ...state,
        willAuthenticate: false,
        isAuthenticated: false,
        currentUser: {},
      };
    case SOCKET_CONNECTED:
      return {
        ...state,
        socket: action.socket,
      };
    default:
      return state;
  }
}
