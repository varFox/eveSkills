import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SkillService from '../services/skillService';

import { fetchToken } from '../store/actions';

const url = `https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_CALLBACK}&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${process.env.REACT_APP_SCOPES}`

const Home = ({ authorization, fetchToken }) => {

  const skills = new SkillService();

  useEffect(() => {
    fetchToken();
    // skills.getResource();
  }, []);

  // function f() {
  //   skills.
  // }
  


  return (
    <div>
      <h1>Home</h1>
      {authorization ? <p>{authorization}</p> : <a href={url}>Login</a>}
      <br />
      {/* <p>{skills.getResource()}</p> */}
      <button
        type="button"
        onClick={() => {
          
        // getCharacterId(authorization.token);
        console.log('fetchToken')
      }}>
        asdasdasd
      </button>
    </div>
  );
};

const loadData = (store, param) => {
  return store.dispatch(fetchToken(param));
};

const mapStateToProps = state => ({
  authorization: state.authorization
});

const mapDispatchToProps = { fetchToken };

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home),
  loadData
};

// export default { component: Home };