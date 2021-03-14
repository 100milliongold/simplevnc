import express from 'express'
import morgan from 'morgan'

import routes from 'routes'



class App {
  public app: express.Application
  /**
   * @ class App
   * @ method bootstrap
   * @ static
   *
   */
  public static bootstrap(): App {
    return new App()
  }

  constructor() {
    this.app = express()

    // http server를 socket.io server로 upgrade한다
    
    


    // log only 4xx and 5xx responses to console
    this.app.use(express.static(__dirname + '/static/'));
    this.app.use(
      morgan('dev', {
        skip: function (req, res) {
          return res.statusCode < 400
        },
      })
    )

    // this.app.use('/', routes)
  }
}

export default App