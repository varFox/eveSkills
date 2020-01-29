import React from 'react';
import { Link } from 'react-router-dom';


// eslint-disable-next-line no-shadow
const Login = () => {

  return (
    <div>
      <h1>Login</h1>
      <Link to="/">home</Link>
    </div>
  );
};

export default { component: Login };