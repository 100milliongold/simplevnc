simplevnc
===================

NodeJs 기반 VNC 클라이언트 입니다. [simplevnc](https://github.com/iSchluff/simplevnc)


## Usage

#### Run Example
```
npm run-script example
node example/server.js
```

Then open up http://localhost:8000 in your browser.

##### Serverside
```js
var http = require('http');
var express = require('express');
var svnc = require('simplevnc');

/* serve your app */
var app = express();
var httpServer = http.createServer(app);
app.use(express.static(__dirname + '/static/'));
httpServer.listen(8080);
console.log('Listening on port', 8080);

/* fire up simplevnc server */
var server = new svnc.Server(httpServer);
server.on('connect', function(client){
  console.log('svnc client connected');
})
server.on('disconnect', function(client){
  console.log('svnc client disconnected');
})
server.on('error', function(err){
  console.error('svnc error', err)
})

```

##### Clientside (with Browserify)
```js
var svnc = require('simplevnc');

/* attach screen to canvas, create client */
var canvas = document.getElementsByTagName('canvas')[0],
  screen = new svnc.Screen(canvas),
  client = new svnc.Client(screen);

/* connect to a vnc server */
client.connect({
  host: '192.168.178.123',
  port: '5900',
  password: 'foobar'
}).then(function(){
  console.log('hooray')
})

setTimeout(function(){
  client.disconnect();
}, 10000);
```
**Important:** Please add ```--ignore ./node_modules/simplevnc/server/Server.js``` to your browserify commandline, to avoid cluttering your bundle with serverside dependencies.


## TODO

### Server side

[] kubernetes 연동
[] docker image 빌드

### Client side

[] react.js 으로 포팅