import { FETCH_CHARACTER_SKILLS } from '../types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHARACTER_SKILLS:
      return action.payload;

    default:
      return state;
  }
};
