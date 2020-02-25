import Home from './pages/Home';
import NotFound from './pages/NotFound';
import App from './App';
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
        ...Callback,
        path: '/callback'
      },
      {
        ...NotFound
      }
    ]
  }
];
