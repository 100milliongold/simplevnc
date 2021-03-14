var io = require('socket.io');
var rfb = require('rfb2');
var PNG = require('pngjs').PNG;
var EventEmitter = require('events');

/* Helper Functions */
const brgaToRgb = function(src: string | any[]){
    var rgb = Buffer.allocUnsafe(src.length / 4 * 3);
    for (var i = 0, o = 0; i < src.length; i += 4) {
      rgb[o++] = src[i + 2];
      rgb[o++] = src[i + 1];
      rgb[o++] = src[i];
    }
    return rgb;
}
  
const brgaToRgba = function(src: string | any[]){
    var rgba = Buffer.allocUnsafe(src.length)
    for (var i = 0; i < src.length; i += 4) {
      rgba[i] = src[i + 2];
      rgba[i + 1] = src[i + 1];
      rgba[i + 2] = src[i];
      rgba[i + 3] = 0xff;
    }
    return rgba;
}
  
class Server {
  #clients: any
  #options: any
  #currentFrame:any
  #event: any
  on: any
  #io: any
  
  /* Constructor */
  constructor(server: any, options: {}) {
    this.#options = options || {};
    this.#clients = [];
    this.#currentFrame = null;
    this.#event = new EventEmitter();
    this.on = this.#event.on.bind(this.#event);
    this.#io = io(server, {log: false});
    this.#io.sockets.on('connection', this.connectClient);

  }

  error = (err: any) =>{
    if(!this.#event.emit('error', err))
      throw err
  }

  encodeFrame = (rect: { data: string | any[]; width: any; height: any; }, cb: (arg0: { encoding: string; data: string | Buffer; }) => void) => {
    // raw transmission
    if(!this.#options.png) {
      cb({
        encoding: 'raw',
        data: brgaToRgba(rect.data)
      });
  
    // png encoded frames
    } else {
      var rgba = brgaToRgba(rect.data),
        buffers: any[] | Uint8Array[] = [],
        png = new PNG({
          width: rect.width,
          height: rect.height
        });
      rgba.copy(png.data, 0, 0, rgba.length);
      png.on('error', (error: { message: string; }) =>{
        this.error(new Error('PNG error: ' + error.message));
      })
      png.on('data', function(buf: any) {
        buffers.push(buf);
      });
      png.on('end', function() {
        cb({
          encoding: 'png',
          data: Buffer.concat(buffers).toString('base64')
        })
      });
      png.pack();
    }
  }


  addEventHandlers = (client: any) => {
    var socket = client.socket,
      rfbc = client.rfbc,
      initialFrame = false,
      last = 0;
  
    var handleConnection = () => {
      rfbc.autoUpdate = true;
      socket.emit('init', {
        width: rfbc.width,
        height: rfbc.height
      });
      client.interval= setInterval(function() {
        if(!initialFrame){
          rfbc.requestUpdate(false, 0, 0, rfbc.width, rfbc.height);
        }
      }, 300);
      this.#clients.push(client);
      this.#event.emit('connect', client)
    }
  
    rfbc.on('connect', handleConnection);
    rfbc.on('error', (error: any) => {
      this.error(new Error('RFB error: ' + error.message));
      socket.emit('error', error.message);
      this.disconnectClient(client);
    });
    rfbc.on('bell', socket.emit.bind(socket, 'bell'));
    rfbc.on('clipboard', function(newPasteBufData: any) {
      console.log('remote clipboard updated!', newPasteBufData);
    });
    rfbc.on('*', (error: any) => {
      this.error(new Error('rfb things: ' + error.message));
    });
    rfbc.on('rect', (rect: any) => {
      if(!initialFrame)
        initialFrame = true;
  
      var now = +new Date();
      last = now;
  
      var sendFrame = function(image: any){
        socket.emit('frame', {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          image: image
        });
      }
  
      switch(rect.encoding) {
      case rfb.encodings.raw:
        // rect.x, rect.y, rect.width, rect.height, rect.data
        // pixmap format is in rfbc.bpp, rfbc.depth, rfbc.redMask, greenMask, blueMask, redShift, greenShift, blueShift
        this.encodeFrame(rect, sendFrame);
        break;
      case rfb.encodings.copyRect:
        socket.emit('copyFrame', {
          x: rect.x,
          y: rect.y,
          src: rect.src,
          width: rect.width,
          height: rect.height
        });
        // pseudo-rectangle
        // copy rectangle from rect.src.x, rect.src.y, rect.width, rect.height, to rect.x, rect.y
        break;
      case rfb.encodings.hextile:
        rect.on('tile', function() {
          throw new Error('Hextile not implemented');
        }); // emitted for each subtile
        break;
      }
    });
  }

  createConnection = (config: any, socket: any) => {
    return new Promise((resolve, reject) => {
      try {
        var rfbc = rfb.createConnection({
          host: config.host,
          port: config.port,
          password: config.password
        });
        resolve(rfbc);
      } catch(err) {
        this.error(new Error('RFB error: ' + err.message))
        reject(err);
      }
    });
  }

  connectClient = (socket: any) =>{
    socket.on('init', (config: any) => {
      var client: any = {
        config: config,
        socket: socket,
      };
      console.log(client);
      
      this.createConnection(config, socket).then((rfbc: any) => {
        client.rfbc = rfbc;
        this.addEventHandlers(client);
        socket.on('mouse', function(event: any) {
          rfbc.pointerEvent(event.x, event.y, event.button);
        });
        socket.on('keyboard', function(event: any) {
          rfbc.keyEvent(event.keyCode, event.isDown);
        });
        socket.on('disconnect', () => {
          this.disconnectClient(client);
        });
        this.#event.emit('establishing', client);
      }).catch(function(err) {
        socket.emit('error', err);
      })
    });
  }

  disconnectClient = (client: any) => {
    for(var i = 0; i < this.#clients.length; i++) {
      var c = this.#clients[i];
      if (c == client) {
        c.rfbc.end();
        clearInterval(c.interval);
        this.#event.emit('disconnect', client, this.#clients)
        this.#clients.splice(i, 1);
        break;
      }
    }
  }
}



export default Server;
