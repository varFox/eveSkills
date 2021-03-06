import { FETCH_ATTRIBUTES } from '../types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ATTRIBUTES:
      return action.payload;

    default:
      return state;
  }
};
