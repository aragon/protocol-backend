import app from './app'
import { createServer } from '@promster/server'
import { signalIsUp } from '@promster/express'

const serverPort = process.env.SERVER_PORT || 8000
app.listen(serverPort, error => {
  if (error) return console.error(error)
  signalIsUp()
  console.log(`Server listening on port ${serverPort}`)
})

// Start Prometheus metrics
const metricsPort = process.env.SERVER_METRICS_PORT || 9091
createServer({ port: metricsPort }).then(() =>
  console.log(`Metrics server started on port ${metricsPort}`)
)
