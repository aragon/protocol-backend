#! /usr/bin/env node

import path from 'path'
import { fork } from 'child_process'
import { workers } from './config'
import Logger from '@aragon/protocol-backend-shared/helpers/logger'

require('dotenv').config()

Logger.setDefaults(false, true)
const logger = Logger('services')

for (const { name, path: workerPath, processes, times, repeat, color = 'white', metricsPort } of workers) {
  for (let p = 1; p <= processes; p++) {
    logger.info(`Creating worker ${name} #${p}`)
    let execArgv = process.execArgv
    if (execArgv[0] && execArgv[0].includes('babel')) execArgv.push('--extensions', '.ts,.js')
    const child = fork(path.resolve(__dirname, './worker'), [workerPath, name, times, repeat, color, metricsPort], { execArgv })
    logger.success(`Created worker ${name} #${p} with pid #${child.pid}`)
  }
}
