import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchToken } from '../store/actions';

// eslint-disable-next-line no-shadow
const Callback = ({ fetchToken }) => {
  useEffect(() => {
    fetchToken();
  }, []);

  return (
    
    <div>
      <h1>Callback</h1>
      <Link to="/">Home</Link>
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
  )(Callback),
  loadData
};
