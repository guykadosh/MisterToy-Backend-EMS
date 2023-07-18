import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import http from 'http'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
// app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.mjs'
import { userRoutes } from './api/user/user.routes.mjs'
import { reviewRoutes } from './api/review/review.routes.mjs'
import { toyRoutes } from './api/toy/toy.routes.mjs'
import { setupSocketAPI } from './services/socket.service.mjs'

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
setupSocketAPI(server)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/toy/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

import { logger } from './services/logger.service.mjs'
const port = process.env.PORT || 3030
server.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})
