/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
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
import cors from 'cors';
import session from 'express-session';
import YAML from 'yaml';

import Routes from './Routes';
import { store } from './store';
import { assetsByChunkName } from '../dist/public/stats.json';

const app = express();
const fs = require('fs');
dotenv.config();
let user = {
  users: []
};

fs.readFile('skills.json', (err, d) => {
  if (!err) {
    const skills = JSON.parse(d);
    // файл skills.json обязательно должен быть, если файлы на еве обновились достаточно удалить данные из этого файла 
    if (!skills.categoryID) {
      // 16 id category it's skills
      const category = JSON.parse(JSON.stringify(YAML.parseDocument(fs.readFileSync('./fsd/categoryIDs.yaml', 'utf8'))))['16'];
      category.categoryID = 16;
      const groups = YAML.parseDocument(fs.readFileSync('./fsd/groupIDs.yaml', 'utf8'));      // все файлы взяты из ресурсов евы
      const types = YAML.parseDocument(fs.readFileSync('./fsd/typeIDs.yaml', 'utf8'));        // https://developers.eveonline.com/resource/resources
      const typeDogma = YAML.parseDocument(fs.readFileSync('./fsd/typeDogma.yaml', 'utf8'));  // при обновлении дынных в игре, стоих обновить эти файлы
      category.groups = groups.contents.items                     // добавляем массив группы скилов
        .filter(item => item.value.items[2].value.value === category.categoryID)
        .map(item => {
          const group = JSON.parse(JSON.stringify(item));
          group[Object.keys(group)].groupID = item.key.value;
          group[Object.keys(group)].types = types.contents.items  // группам скилов добавляем типы
            .filter(item => ((item.value.items[2].value.value === group[Object.keys(group)].groupID) && (item.value.items[2].key.value === 'groupID')))
            .map(item => {
              const type = JSON.parse(JSON.stringify(item));
              type[Object.keys(type)].typeID = item.key.value;
              typeDogma.contents.items                            // типам добовляем догма аттрибуты и эффекты
                .filter(item => item.key.value === type[Object.keys(type)].typeID)
                .map(item => {
                  const dogma = JSON.parse(JSON.stringify(item));
                  type[Object.keys(type)].dogmaAttributes = dogma[Object.keys(dogma)[0]].dogmaAttributes;
                  type[Object.keys(type)].dogmaEffects = dogma[Object.keys(dogma)[0]].dogmaEffects;
                });
              return type[Object.keys(type)] 
            });
          return group[Object.keys(group)] 
        });

      fs.writeFileSync('skills.json', JSON.stringify(category));
      console.log('готово');
    } else {
      console.log('и так сойдёт');
    }
  }
});


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
  fs.readFile('db.json', function (err, d) {
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

// app.get("/skills", (req, res, next) =>{
//   console.log('data')
//   fs.readFile('skills.json', async (err, d) => {
//     console.log('data2')
//     if (!err) {
//       const data = JSON.parse(d);
//       console.log(data.length)
//       if (data.length === undefined) {
//         const response = await new Swagger(specUrl)
//           .then(client => client.apis.Universe.get_universe_categories_category_id({
//             'category_id': '16',
//             'datasource': 'tranquility',
//             'language': 'en-us'
//           }))
//           .then(res => console.log(res.body));

//         console.log(response)
//       }

      
//     }
//   });

  
//       next()
// });

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