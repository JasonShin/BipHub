// Express requirements
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import graphqlHTTP from 'express-graphql'
import controllers from './controllers'
import db from './bookshelf'
import config from './config'
import middleware from './middleware'
import graphqlSchema from './middleware/graphql/schema'
import logger from './logger'
// Webpack requirements
import vuepackMiddleware from './middleware/vuepack'

// Initiating express
const app = express()
const server = http.Server(app)
const port = config.get('port')
app.server = server
app.set('port', port)

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.get('web:corsHeaders')
}))

app.use(bodyParser.json({
  limit: config.get('web:bodyLimit')
}))

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => 'Hello from Bipflow!'
}

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: root,
  pretty: true,
  graphiql: true
}))

// internal middleware
app.use(middleware())

// Runs latest migration
db.migrate().fork(
  (e) => {
    console.error('Failed migration! ', e)
  },
  () => {
    // Set up controllers
    controllers(app)
    // Webpack requirements
    vuepackMiddleware(app, config)

    server.listen(app.get('port'), '0.0.0.0', () => {
      logger.info(`App is running at http://localhost:${app.get('port')} in ${config.getEnv()} mode `)
      logger.info('Press CTRL-C to stop\n')
    })
  }
)
export default app
