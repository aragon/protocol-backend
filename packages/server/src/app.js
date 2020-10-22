import 'core-js/stable'
import 'regenerator-runtime/runtime'

import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import { createMiddleware } from '@promster/express'

import routes from './routes'
import errorHandler from './errors/error-handler'
import corsMiddleware from './helpers/cors-middleware'
import sessionMiddleware from './helpers/session-middleware'
import notFoundMiddleware from './helpers/not-found-middleware'

// Load env variables
dotenv.config()

// Set up express layers
const app = express()
app.set('trust proxy', 1) // required for secure sessions
app.use(createMiddleware({ app }))
app.use(helmet())
app.use(morgan('dev'))
app.use(corsMiddleware)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(sessionMiddleware())
routes(app)
app.use(notFoundMiddleware())
app.use(errorHandler(app))

export default app
