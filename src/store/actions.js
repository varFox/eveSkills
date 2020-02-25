import axios from 'axios';
import Swagger from 'swagger-client';
import { refreshToken } from '../services/serverService';

import {
  FETCH_TOKEN,
  FETCH_PUBLIC_INFO,
  FETCH_ATTRIBUTES
} from './types';

const specUrl = 'https://esi.evetech.net/_latest/swagger.json';

export const fetchToken = () => async dispatch => {
  let response;
  axios.defaults.withCredentials = true;
  await axios.get('http://127.0.0.1:3000/info')
    .then(res => {
      if (res.data.character) {
        response = res.data.character
      };
    });
  if(!response) response = '';
  dispatch({
    type: FETCH_TOKEN,
    payload: response
  });

};

export const getPublicInfo = (idChar) => async dispatch => {
  const response = await new Swagger(specUrl)
    .then(asd => asd.apis.Character.get_characters_character_id({'character_id': idChar, 'datasource': 'tranquility'}));
    
  response.body.portrait = await new Swagger(specUrl)
    .then(asd => asd.apis.Character.get_characters_character_id_portrait({'character_id': idChar, 'datasource': 'tranquility'}))
    .then(res => res.body.px256x256);

  response.body.corporation_name = await new Swagger(specUrl)
    .then(asd => asd.apis.Corporation.get_corporations_corporation_id({'corporation_id': response.body.corporation_id, 'datasource': 'tranquility'}))
    .then(res => res.body.name);

  dispatch({
    type: FETCH_PUBLIC_INFO,
    payload: response.body
  });
}

export const getAttributes = ({ charId, token }) => async dispatch => {
  if (charId && token) {

      const response = await new Swagger(specUrl)
        .then(client => client.apis.Skills.get_characters_character_id_attributes({'character_id': charId, 'datasource': 'tranquility', 'token': token}))

    dispatch({
      type: FETCH_ATTRIBUTES,
      payload: response.body
    });
  }
} 