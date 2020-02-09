import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import express from 'express';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import '@babel/polyfill';
import axios from 'axios';
import { Base64 } from 'js-base64';
import dotenv from 'dotenv';

import Routes from './Routes';
import { store } from './store';
import { assetsByChunkName } from '../dist/public/stats.json';

const app = express();
const fs = require('fs');
dotenv.config();
let objTokens = {
  users: []
};
let postBody, character;
app.use(express.static('dist/public'))
   .use(express.json());

app.get("/callback", function(req,res, next){

  const data = {
    grant_type: 'authorization_code',
    code: `${req.query.code}` 
  };

  const config =  {
    headers: {
      'Authorization': `Basic ${Base64.encode(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_KEY}`)}`,
      'Content-Type': 'application/json'
    }
  };

  axios.post('https://login.eveonline.com/oauth/token', data, config).then((r) => {
    postBody = {
      code: req.query.code,
      token: r.data.access_token,
      refresh: r.data.refresh_token,
      expires_in: r.data.expires_in,
      date: new Date()
    };
    fs.readFile('db.json', function readFileCallback(err, d) {
      if (err) {
        // console.log(err);
      } else {
        objTokens = JSON.parse(d);
        objTokens.users.push(postBody);
        fs.writeFileSync('db.json', JSON.stringify(objTokens));
      }
    });

      
const configGet =  {
          headers: {
            'Authorization': `Bearer ${postBody.token}`
          }
        };

    axios.get(`https://login.eveonline.com/oauth/verify`, configGet)
          .then(r => {
            character = r.data.CharacterName;
            res.redirect('/');
          });
    
  });

  
  // console.log(getToken);
  // .catch(err => console.log(err));
});

app.use("/info/", function(req, res, next) {
  console.log(character);
  if (character) {res.json({ character: character })}
  else next();
});

// eslint-disable-next-line no-shadow
const renderer = (req, store, context) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>{renderRoutes(Routes)}</div>
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
    .map(({ route }) => {
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
