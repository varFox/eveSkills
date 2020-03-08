import { FETCH_ALL_SKILLS } from '../types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_SKILLS:
      return action.payload;

    default:
      return state;
  }
};
