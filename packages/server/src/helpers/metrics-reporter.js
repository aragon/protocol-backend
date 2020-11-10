import { Reporter } from '@aragon/protocol-backend-shared/build/helpers/metrics-reporter'

const COUNTER_METRICS = {
  db: [
    { name: 'queries', help: 'DB queries per table' },
    { name: 'errors', help: 'DB errors' },
  ],
  email: [
    { name: 'errors', help: 'Total email errors' },
  ]
}

class MetricsReporter extends Reporter {
  dbQuery() {
    this.counters.db.queries.inc()
  }
  dbError() {
    this.counters.db.errors.inc()
  }
  emailError() {
    this.counters.email.errors.inc()
  }
}

export default new MetricsReporter(COUNTER_METRICS)
