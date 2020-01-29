import { combineReducers } from 'redux';

import hello from './hello';
import user from './user';

export default combineReducers({
  hello,
  user
});
