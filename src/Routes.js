import Home from './pages/Home';
import About from './pages/About';
import User from './pages/User';
import NotFound from './pages/NotFound';
import App from './App';
import Login from './pages/Login';

export default [
  {
    ...App,
    routes: [
      {
        ...Home,
        path: '/',
        exact: true
      },
      {
        ...About,
        path: '/about'
      },
      {
        ...User,
        path: '/user'
      },
      {
        ...Login,
        path: '/login'
      },
      {
        ...NotFound
      }
    ]
  }
];
