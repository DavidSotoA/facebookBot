const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('server-key.pem', 'utf8');
var certificate = fs.readFileSync('server-cert.pem', 'utf8');

var options = {
  key: privateKey,
  cert: certificate
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

https.createServer(options, app).listen(8000);


/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});
