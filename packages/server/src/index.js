import app from './app'
import metrics from './helpers/metrics-reporter'

const serverPort = process.env.SERVER_PORT || 8000
app.listen(serverPort, error => {
  if (error) return console.error(error)
  metrics.setExpressMiddlewareUp()
  console.log(`Server listening on port ${serverPort}`)
})

// Start Prometheus metrics
const metricsPort = Number(process.env.SERVER_METRICS_PORT) || 9091
metrics.createServer(metricsPort).then()
