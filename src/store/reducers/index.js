import { combineReducers } from 'redux';

import authorization from './authorization';
import publicInfo from './publicInfo';
import attributes from './attributes';

export default combineReducers({
  authorization,
  publicInfo,
  attributes
});
