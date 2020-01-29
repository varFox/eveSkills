import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchToken } from '../store/actions';

const url = `https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_CALLBACK}&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${process.env.REACT_APP_SCOPES}`

// eslint-disable-next-line no-shadow
const User = ({ fetchToken }) => {
  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  return (
    
    <div>
      <h1>Todo</h1>
      <Link to="/">Home</Link>
      <br />
      <button
        type="button"
        onClick={() => {
        if ((/code=([^&]+)/).exec(document.location.search)) {
          localStorage.setItem('code', (/code=([^&]+)/).exec(document.location.search)[1]);
        }
        return (<Redirect to='/user' />)
      }}
      >
        Сохранить код
      </button>
      
      <button
        type="button"
        onClick={() => {
          
        fetchToken(localStorage.getItem('code'));
        // console.log(fetchToken)
      }}
      >
        Отправить код
      </button>
      <br />
      <a href={url}>{url}</a>
      {/* <p>{(/code=([^&]+)/).exec(document.location.search)[1]}</p> */}
    </div>
  );
};

const loadData = (store, param) => {
  return store.dispatch(fetchToken(param));
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = { fetchToken };

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(User),
  loadData
};
