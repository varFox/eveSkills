import { combineReducers } from 'redux';

import authorization from './authorization';
import publicInfo from './publicInfo';
import attributes from './attributes';
import characterSkills from './characterSkills';
import universe from './universe';

const appReducer = combineReducers({
  authorization,
  publicInfo,
  attributes,
  characterSkills,
  universe
})

export default (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}