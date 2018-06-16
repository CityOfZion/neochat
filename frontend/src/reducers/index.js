import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import session from './session';
import channels from './channels';
import direct_messages from './direct_messages';

const appReducer = combineReducers({
  form,
  session,
  channels,
  direct_messages,
});

export default function (state, action) {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
}
