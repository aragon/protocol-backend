import { Reporter } from '@aragon/protocol-backend-shared/build/helpers/metrics-reporter'

const generalMetrics = {
  worker: [
    { name: 'runs', help: 'Total worker runs' },
    { name: 'success', help: 'Total successful worker runs' },
    { name: 'errors', help: 'Total worker run errors' },
  ]
}
const workerMetrics = {
  heartbeat: { ... generalMetrics },
  reveal: { ... generalMetrics },
  settlements: { ... generalMetrics },
  'monitor-keeper': { ... generalMetrics },
  'notification-scanner': {
    ... generalMetrics,
    notifications: [
      { name: 'scanned', help: 'Total notifications scanned', labelNames: ['scannerName'] },
    ]
  },
  'notification-sender': {
    ... generalMetrics,
    notifications: [
      { name: 'sent', help: 'Total notifications sent', labelNames: ['scannerName'] },
    ]
  },
  'contract-monitor': {
    ... generalMetrics,
    transaction: [
      { name: 'errors', help: 'Total recent transaction errors', labelNames: ['type'], type: 'gauge' },
    ]
  }
}

class MetricsReporter extends Reporter {
  constructor(workerName, port) {
    super(workerMetrics[workerName], ['workerName'])
    this._defaultLabels = { workerName }
    this.createServer(Number(port))
  }
  workerRun() {
    this.counters.worker.runs.inc(this._defaultLabels)
  }
  workerSuccess() {
    this.counters.worker.success.inc(this._defaultLabels)
  }
  workerError() {
    this.counters.worker.errors.inc(this._defaultLabels)
  }
  notificationScanned(scannerName) {
    this.counters.notifications.scanned.inc({
      ... this._defaultLabels,
      scannerName
    })
  }
  notificationSent(scannerName) {
    this.counters.notifications.sent.inc({
      ... this._defaultLabels,
      scannerName
    })
  }
  transactionErrors(type, count) {
    this.gauges.transaction.errors.set({ type }, count)
  }
}

export default MetricsReporter
