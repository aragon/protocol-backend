import { Reporter, Metrics } from '@aragon/protocol-backend-shared/build/helpers/metrics-reporter'

const COUNTER_METRICS: Metrics = {
  db: [
    { name: 'queries', help: 'DB queries per table' },
    { name: 'errors', help: 'DB errors' },
  ],
  email: [
    { name: 'errors', help: 'Total email errors' },
  ]
}

class MetricsReporter extends Reporter {
  
  dbQuery(): void {
    this.counters.db.queries.inc()
  }
  dbError(): void {
    this.counters.db.errors.inc()
  }
  emailError(): void {
    this.counters.email.errors.inc()
  }
}

export default new MetricsReporter(COUNTER_METRICS)
