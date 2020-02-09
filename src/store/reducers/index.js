import { combineReducers } from 'redux';

import hello from './hello';
import user from './user';
import authorization from './authorization';

export default combineReducers({
  hello,
  user,
  authorization
});
