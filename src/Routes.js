import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import App from './App';
import Login from './pages/Login';
import Callback from './pages/Callback';


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
        ...Login,
        path: '/login'
      },
      {
        ...Callback,
        path: '/callback'
      },
      {
        ...NotFound
      }
    ]
  }
];
