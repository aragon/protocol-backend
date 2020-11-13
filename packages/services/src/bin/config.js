const ONE_MINUTE = 60

const workers = [
  {
    name: 'heartbeat',
    color: 'yellow',
    path: '../workers/heartbeat',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 10,
    metricsPort: process.env.SERVICE_PORT_HEARTBEAT
  },
  {
    name: 'reveal',
    color: 'pink',
    path: '../workers/reveal',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
    metricsPort: process.env.SERVICE_PORT_REVEAL
  },
  {
    name: 'settlements',
    color: 'cyan',
    path: '../workers/settlements',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 5,
    metricsPort: process.env.SERVICE_PORT_SETTLEMENTS
  },
  {
    name: 'monitor-keeper',
    color: 'green',
    path: '../workers/monitor-keeper',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 30,
    metricsPort: process.env.SERVICE_PORT_MONITOR_KEEPER
  },
  {
    name: 'notification-scanner',
    color: 'blue',
    path: '../workers/notification-scanner',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
    metricsPort: process.env.SERVICE_PORT_NOTIFICATION_SCANNER
  },
  {
    name: 'notification-sender',
    color: 'magenta',
    path: '../workers/notification-sender',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 5,
    metricsPort: process.env.SERVICE_PORT_NOTIFICATION_SENDER
  },
  {
    name: 'contract-monitor',
    path: '../workers/contract-monitor',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 5,
    metricsPort: process.env.SERVICE_PORT_CONTRACT_MONITOR
  },
]

export {
  workers
}