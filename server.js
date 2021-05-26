// server.js
const next = require('next');
const cors = require('cors');
const path = require('path');
const express = require('express');
const axios = require('axios');

const routes = require('./routes');

const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);

// With express
app.prepare().then(() => {
  const server = express();
  const options = {
    root: path.join(__dirname, process.env.NEXT_STATIC_PATH || '/static'),
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
  };
  server.get('/robots.txt', (req, res) => (
    res.status(200).sendFile('robots.txt', options)
  ));
  server.get('/sitemap.xml', (req, res) => (
    axios.get('https://rockpeaksassets.s3.amazonaws.com/sitemap/sitemap.xml')
      .then(function (response) {
        res.header("Content-Type", "application/xml;charset=UTF-8").status(200).send(response.data)
      })
      .catch(function (error) {
        // Keep as fallback.
        res.header("Content-Type", "application/xml;charset=UTF-8").status(200).sendFile('sitemap.xml', {
          root: path.join(__dirname, '/static'),
        })
      })
  ));
  server.get('/yandex_36e15084861bd2ac.html', (req, res) => (
    res.status(200).sendFile('yandex_36e15084861bd2ac.html', {
      root: path.join(__dirname, '/static'),
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      }
    })
  ));
  const port = process.env.PORT || 3000;
  console.log(`Starting server on port ${port}`);
  server.use(handler).use(cors()).listen(port);
});
