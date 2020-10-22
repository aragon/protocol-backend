const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { toChecksumAddress } = require('web3-utils')
const { bn } = require('@aragon/protocol-backend-shared/helpers/numbers')
const Logger = require('@aragon/protocol-backend-shared/helpers/logger')
const Environment = require('@aragon/protocol-backend-shared/models/environments/TruffleEnvironment')
const errorHandler = require('../src/helpers/error-handler')

Logger.setDefaults(false, true)
const logger = Logger('fees')

const { network, period } = yargs
  .help()
  .option('period', { alias: 'p', describe: 'Period ID', type: 'string', default: '0' })
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true, default: 'mainnet' })
  .strict()
  .argv

async function setup() {
  const environment = new Environment(network)
  const court = await environment.getCourt()

  const result = await environment.query(`{ guardians (first: 1000) { id } }`)
  logger.info(`Checking ${result.guardians.length} guardians`)

  const { balanceCheckpoint } = await court.getPeriod(period)
  logger.info(`Using balance checkpoint: ${balanceCheckpoint}`)

  const eligibles = [], notEligibles = []
  const registry = await court.registry()
  const subscriptions = await court.subscriptions()

  for (const { id } of result.guardians) {
    const guardian = toChecksumAddress(id)
    const { guardianShare } = await subscriptions.getguardianShare(guardian, period)
    const activeBalance = await registry.activeBalanceOfAt(guardian, balanceCheckpoint)

    if (guardianShare.eq(bn(0))) {
      logger.info(`guardian ${guardian} is not eligible for fees`)
      notEligibles.push({ guardian, activeBalance: activeBalance.toString() })
      if (!activeBalance.eq(bn(0))) logger.warn(`guardian ${guardian} is not eligible but has ${activeBalance.toString()} active at term ${balanceCheckpoint}`)
    }
    else {
      logger.info(`guardian ${guardian} is eligible for fees`)
      const activeBalance = await registry.activeBalanceOfAt(guardian, balanceCheckpoint)
      eligibles.push({ guardian, activeBalance: activeBalance.toString() })
    }
  }

  logger.success(`There are ${eligibles.length} guardians eligible for fees: \n- ${eligibles.map(e => e.guardian).join('\n- ')}`)

  const outputPath = path.resolve(process.cwd(), `./subscription-fees.${network}.json`)
  const data = JSON.stringify({ eligibles, notEligibles }, null, 2)
  fs.writeFileSync(outputPath, data)
}

setup().then(() => process.exit(0)).catch(errorHandler)
