import { FETCH_TOKEN } from '../types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TOKEN:
      return action.payload;

    default:
      return state;
  }
};
