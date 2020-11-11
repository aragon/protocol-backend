import { Reporter, Metrics } from '@aragon/protocol-backend-shared/build/helpers/metrics-reporter'

const generalMetrics: Metrics = {
  worker: [
    { name: 'runs', help: 'Total worker runs' },
    { name: 'success', help: 'Total successful worker runs' },
    { name: 'errors', help: 'Total worker run errors' },
  ]
}

interface WorkerMetrics {
  [workerName: string]: Metrics
}

const workerMetrics: WorkerMetrics = {
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

  private _defaultLabels: {
    [labelName: string]: string
  }

  constructor(workerName: string, port: number) {
    super(workerMetrics[workerName], ['workerName'])
    this._defaultLabels = { workerName }
    this.createServer(Number(port))
  }

  workerRun(): void {
    this.counters.worker.runs.inc(this._defaultLabels)
  }

  workerSuccess(): void {
    this.counters.worker.success.inc(this._defaultLabels)
  }

  workerError(): void {
    this.counters.worker.errors.inc(this._defaultLabels)
  }

  notificationScanned(scannerName: string): void {
    this.counters.notifications.scanned.inc({
      ... this._defaultLabels,
      scannerName
    })
  }

  notificationSent(scannerName: string): void {
    this.counters.notifications.sent.inc({
      ... this._defaultLabels,
      scannerName
    })
  }

  transactionErrors(type: string, count: number): void {
    this.gauges.transaction.errors.set({ type }, count)
  }
}

export default MetricsReporter
