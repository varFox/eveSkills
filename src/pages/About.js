import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setHello } from '../store/actions';

// eslint-disable-next-line no-shadow
const About = ({ hello, setHello }) => {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link>
      <br />
      {hello}
      <br />
      <button type="button" onClick={() => setHello(`${window.location.href}`)}>
        Hello
      </button>
      <a href="https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3001/about&client_id=3c079079c2974f3ab6631d09b21cea73&scope=esi-skills.read_skills.v1">
      https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3001/about&client_id=3c079079c2974f3ab6631d09b21cea73&scope=esi-skills.read_skills.v1
      </a>
    </div>
  );
};

const mapStateToProps = state => ({
  hello: state.hello
});

const mapDispatchToProps = { setHello };

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(About)
};
