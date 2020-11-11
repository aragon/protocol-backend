import { Prometheus } from '@promster/metrics'
import { createServer } from '@promster/server'
import { signalIsUp, createMiddleware } from '@promster/express'
import { Server } from 'http'

export interface Metrics {
  [group: string]: {
    name: string
    help: string
    labelNames?: string[]
    type?: 'gauge' | 'counter'
  }[]
}

export class Reporter {

  server: Server | null = null

  counters: {
    [group: string]: {
      [name: string]: Prometheus.Counter<string>
    }
  }

  gauges: {
    [group: string]: {
      [name: string]: Prometheus.Gauge<string>
    }
  }

  constructor(metrics: Metrics, globalLabelNames?: string[]) {
    this.counters = {}
    this.gauges = {}
    this._initializeMetrics(metrics, globalLabelNames)
  }

  private _initializeMetrics(metrics: Metrics, globalLabelNames?: string[]) {
    const { Counter, Gauge } = Prometheus
    Object.keys(metrics).forEach((group: string) => {
      metrics[group].forEach(({ name, help, labelNames=[], type }) => {
        if (globalLabelNames) labelNames.push(...globalLabelNames)
        if (type == 'gauge') {
          if (!this.gauges[group]) this.gauges[group] = {}
          this.gauges[group][name] = new Gauge({ name: `${group}_${name}`, help, labelNames })
        }
        else {
          if (!this.counters[group]) this.counters[group] = {}
          this.counters[group][name] = new Counter({ name: `${group}_${name}`, help, labelNames })
        }
      })
    })
  }

  async createServer(port: number): Promise<void> {
    this.server = await createServer({port})
    console.log(`Prometheus metrics server started on port ${port}`)
  }

  createExpressMiddleware: typeof createMiddleware = (options) => createMiddleware(options)
  setExpressMiddlewareUp(): void { signalIsUp() }
}
