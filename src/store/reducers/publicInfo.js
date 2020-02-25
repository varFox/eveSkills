import { FETCH_PUBLIC_INFO } from '../types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PUBLIC_INFO:
      return action.payload;

    default:
      return state;
  }
};
