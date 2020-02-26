import { FETCH_TOKEN, DELETE_TOKEN } from '../types';


const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TOKEN:
      return action.payload;
    case DELETE_TOKEN:
      return '';

    default:
      return state;
  }
};
