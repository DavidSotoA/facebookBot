const express = require('express'),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      http = require('http'),
      https = require('https');

var app = express();
var port_http = 443,
    port_https = 80;

var options = {
  key: fs.readFileSync('ssl/client-key.pem', 'utf8'),
  cert: fs.readFileSync('ssl/client-cert.pem', 'utf8')
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(port_http , () => {
    console.log('Express server http listening on port %d in %s mode', port_http, app.settings.env);
});

https.createServer(options, app).listen(port_https, () =>{
     console.log('Express server https listening on port %d in %s mode', port_https, app.settings.env);
});

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
