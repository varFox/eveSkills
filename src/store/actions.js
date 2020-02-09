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




export const fetchToken = () => async dispatch => {
  let response; 
  await axios.get('http://127.0.0.1:3000/info')
    .then(res => {
      if (res.data.character) response = res.data.character;
    });
  if(!response) response = '';
  dispatch({
    type: FETCH_TOKEN,
    payload: response
  });

  
};

export const getCharacterId = (token) => async dispatch => {

  const config =  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await axios.get(`https://login.eveonline.com/oauth/verify`, config)
    .then(res => console.log(res));
  

  dispatch({
    type: FETCH_USER,
    payload: response
  });
};
