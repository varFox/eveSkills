/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';
import {
  renderToString
} from 'react-dom/server';
import {
  StaticRouter
} from 'react-router-dom';
import {
  matchRoutes,
  renderRoutes
} from 'react-router-config';
import express from 'express';
import {
  Provider
} from 'react-redux';
import serialize from 'serialize-javascript';
import '@babel/polyfill';
import axios from 'axios';
import {
  Base64
} from 'js-base64';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';


import Routes from './Routes';
import {
  store
} from './store';
import {
  assetsByChunkName
} from '../dist/public/stats.json';

const app = express();
const fs = require('fs');
dotenv.config();
let user = {
  users: []
};
app.use(express.static('dist/public'))
  .use(express.json())
  .use(cors({origin: true, credentials: true}))
  .use(session({
    secret: 'as%ASDWEHK^asd9231edd1ASD&AW23',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false
    }
  }));

app.get("/callback", function (req, res, next) {

  if (req.query.code) {

    const data = {
      grant_type: 'authorization_code',
      code: `${req.query.code}`
    };

    const config = {
      headers: {
        'Authorization': `Basic ${Base64.encode(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_KEY}`)}`,
        'Content-Type': 'application/json'
      }
    };

    axios.post('https://login.eveonline.com/oauth/token', data, config).then((r) => {

      // const code = +(new Date()) * Math.floor(Math.random() * (4000 - 50 + 1)) + 50;
      // console.log('code', code)
      req.session.code = Base64.encode(+(new Date()) * Math.floor(Math.random() * (4000 - 50 + 1)) + 50);
      req.session.token = Base64.encode(r.data.access_token);
      const postBody = {
        code: req.session.code,
        token: r.data.access_token,
        refresh: r.data.refresh_token,
        date: +new Date()
      };
      
      const configGet = {
        headers: {
          'Authorization': `Bearer ${postBody.token}`
        }
      };

      axios.get(`https://login.eveonline.com/oauth/verify`, configGet)
        .then(r => {

          postBody.idChar = r.data.CharacterID;
          postBody.char = r.data.CharacterName;

          fs.readFile('db.json', (err, d) => {
            if (!err) {
              user = JSON.parse(d);
              user.users.push(postBody);
              fs.writeFileSync('db.json', JSON.stringify(user));
            }
          });

          req.session.save(() => res.redirect('http://127.0.0.1:3001/'))
        });

    })
    .catch(error => console.log(error));

  } else next();

});


// тут происходит основная работа с базой (а точнее db.json)
app.get("/info", function (req, res, next) {

  // в любом случае сначала читаем файл
  fs.readFile('db.json', (err, d) => {
    if (!err) {
      const data = JSON.parse(d);
      const index = data.users.findIndex(user => user.code === req.session.code);
      
      // действия на случай, если пользователь хочет разлогинится
      if (Object.keys(req.query).length !== 0 && req.query.logout && index > -1) { 
        data.users.splice(index, 1);
        fs.writeFileSync('db.json', JSON.stringify(data));
        req.session.destroy();
        res.json({ })
      } 

      // для того, чтобы обновить токен на info нужно отправить токен
      else if (Object.keys(req.query).length !== 0 && req.query.token && index > -1) { 
        const user = data.users[index];
        data.users.splice(index, 1);
        const postData = {
          grant_type: 'refresh_token',
          refresh_token: `${user.refresh}`
        };

        const config = {
          headers: {
            'Authorization': `Basic ${Base64.encode(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_KEY}`)}`,
            'Content-Type': 'application/json'
          }
        };

        axios.post('https://login.eveonline.com/oauth/token', postData, config).then((r) => {

          user.token = r.data.access_token;
          user.date = +new Date();
          
          data.users.push(user);

          fs.writeFileSync('db.json', JSON.stringify(data));
          console.log('обновление токена')
          res.json({
            character: {
              charId: user.idChar,
              char: user.char,
              token: user.token,
              date: user.date
            }
          })

        })
        .catch(error => console.log(error));

      } 
      
      // первый раз получаем токен
      else if (index > -1) {
        console.log('уже есть токен')
        res.json({
          character: {
            charId: data.users[index].idChar,
            char: data.users[index].char,
            token: data.users[index].token,
            date: data.users[index].date
          }
        })
      } else next();
    } else next();
  });
});

// eslint-disable-next-line no-shadow
const renderer = (req, store, context) => {
  const content = renderToString( 
    <Provider store={store}>
      <StaticRouter 
        location={req.path}
        context={context}>
        <div> {renderRoutes(Routes)} </div> 
      </StaticRouter>
    </Provider>
  );

  return `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" type="text/css" href="/${
        assetsByChunkName.main[0]
      }" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,500|Staatliches&display=swap" rel="stylesheet">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap-grid.min.css" rel="stylesheet">
      <title>Document</title>
    </head>
    <body>
      <div id="root">${content}</div>
      <script>
      window.__PRELOADED_STATE__ = ${serialize(store.getState()).replace(
        /</g,
        '\\u003c'
      )}
      </script>
      <script src="/${assetsByChunkName.main[1]}"></script>
    </body>
  </html>`;
};

app.get('*', (req, res, next) => {
  const params = req.params[0].split('/');
  const id = params[2];

  const routes = matchRoutes(Routes, req.path);

  const promises = routes
    .map(({
      route
    }) => {
      return route.loadData ? route.loadData(store, id) : null;
    })
    .map(promise => {
      if (promise) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
      return null;
    });

  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);

    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
  // next();
});

app.listen(3000, () => {
  console.log('Server on port 3000');
});