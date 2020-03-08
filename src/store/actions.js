import axios from 'axios';
import Swagger from 'swagger-client';

import {
  FETCH_TOKEN,
  FETCH_PUBLIC_INFO,
  FETCH_ATTRIBUTES,
  FETCH_CHARACTER_SKILLS,
  FETCH_ALL_SKILLS
} from './types';

const specUrl = 'https://esi.evetech.net/_latest/swagger.json';

export const fetchToken = () => async dispatch => {
  let response;
  if (localStorage.getItem('autorization')) {
    response = JSON.parse(localStorage.getItem('autorization'));
  } else {
    axios.defaults.withCredentials = true;
    await axios.get('http://127.0.0.1:3000/info')
      .then(res => {
        if (res.data.character) {
          response = res.data.character;
          localStorage.setItem('autorization', JSON.stringify(response))
        };
      });
  }

  if (!response) response = '';
  dispatch({
    type: FETCH_TOKEN,
    payload: response
  });

};

export const deleteToken = () => dispatch => {

  localStorage.clear();
  localStorage.setItem('autorization', '');
  dispatch({
    type: 'USER_LOGOUT'
  });

};


export const getPublicInfo = (idChar) => async dispatch => {
  let response;
  if (localStorage.getItem('publicInfo')) {
    response = JSON.parse(localStorage.getItem('publicInfo'));
  } else {
    response = await new Swagger(specUrl)
      .then(asd => asd.apis.Character.get_characters_character_id({
        'character_id': idChar,
        'datasource': 'tranquility'
      }))
      .then(res => res.body);

    response.portrait = await new Swagger(specUrl)
      .then(asd => asd.apis.Character.get_characters_character_id_portrait({
        'character_id': idChar,
        'datasource': 'tranquility'
      }))
      .then(res => res.body.px256x256);

    response.corporation_name = await new Swagger(specUrl)
      .then(asd => asd.apis.Corporation.get_corporations_corporation_id({
        'corporation_id': response.corporation_id,
        'datasource': 'tranquility'
      }))
      .then(res => res.body.name);

    localStorage.setItem('publicInfo', JSON.stringify(response))
  }

  dispatch({
    type: FETCH_PUBLIC_INFO,
    payload: response
  });
};

export const getAttributes = ({ charId, token }) => async dispatch => {
  if (charId && token) {
    let response;
    if (localStorage.getItem('attributes')) {
      response = JSON.parse(localStorage.getItem('attributes'));
    } else {
      response = await new Swagger(specUrl)
        .then(client => client.apis.Skills.get_characters_character_id_attributes({
          'character_id': charId,
          'datasource': 'tranquility',
          'token': token
        }))
        .then(res => res.body);
      localStorage.setItem('attributes', JSON.stringify(response))
    }
    dispatch({
      type: FETCH_ATTRIBUTES,
      payload: response
    });

  }
};

export const getCharacterSkills = ({ charId, token }) => async dispatch => {

  if (charId && token) {
    let response;
    if (localStorage.getItem('characterSkills')) {
      response = JSON.parse(localStorage.getItem('characterSkills'));
    } else {
      response = await new Swagger(specUrl)
        .then(client => client.apis.Skills.get_characters_character_id_skills({
          'character_id': charId,
          'datasource': 'tranquility',
          'token': token
        }))
        .then(res => res.body);
      localStorage.setItem('characterSkills', JSON.stringify(response));
    }
    dispatch({
      type: FETCH_CHARACTER_SKILLS,
      payload: response
    });
  }

};

export const getAllSkills = () => async dispatch => {

  let response;
  if (localStorage.getItem('allSkills')) {
    response = JSON.parse(localStorage.getItem('allSkills'));
  } else {
    response = await axios.get('http://127.0.0.1:3000/skills');
    response = response.data;
    localStorage.setItem('allSkills', JSON.stringify(response));
  }
  dispatch({
    type: FETCH_ALL_SKILLS,
    payload: response
  });

};
