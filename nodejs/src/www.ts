var http = require('http');
import App from './App'
import * as express from 'express'
// import { Server } from 'utils'

import { Server, Socket } from "socket.io";
import { createServer } from "http";


const port: number = Number(process.env.PORT) || 8080
const app: express.Application = new App().app

var httpServer = createServer(app);

const io = new Server(httpServer);


app
  .listen(port, () => console.log(`Express server listening at ${port}`))
  .on('error', (err) => console.error(err))


  // var httpServer = http.createServer(app);

  // var server = new Server(httpServer, {});
  // server.on('connect', function(client: any){
  //   console.log('svnc client connected');
  // })
  // server.on('disconnect', function(client: any){
  //   console.log('svnc client disconnected');
  // })
  // server.on('error', function(err: any){
  //   console.error('svnc error', err)
  // })