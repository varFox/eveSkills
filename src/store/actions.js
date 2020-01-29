import axios from 'axios';


import {
  SET_HELLO,
  FETCH_USER,
  FETCH_TOKEN
} from './types';

export const setHello = payload => ({
  type: SET_HELLO,
  payload
});

export const fetchUser = () => async dispatch => {
  const response = await axios.get(
    `https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_CALLBACK}&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${process.env.REACT_APP_SCOPES}`
  );

  dispatch({
    type: FETCH_USER,
    payload: response.data
  });
};



export const fetchToken = (code) => async dispatch => {

  const data = {
    grant_type: 'authorization_code',
    code: `${code}` 
  };
  const config =  {
    headers: {
      'Authorization': `Basic ${Base64.encode(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_KEY}`)}`,
      'Content-Type': 'application/json'
    }
  };
  const response = await axios.post('https://login.eveonline.com/oauth/token', data, config)
    .then(() => console.log('Всё good'))
    .catch(err => console.log(err))

  dispatch({
    type: FETCH_TOKEN,
    payload: response
  });

  
};



