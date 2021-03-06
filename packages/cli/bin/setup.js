const yargs = require('yargs')
const { bn } = require('@aragon/court-backend-shared/helpers/numbers')
const { execSync } = require('child_process')
const errorHandler = require('../src/helpers/error-handler')
const Logger = require('@aragon/court-backend-shared/helpers/logger')
const Environment = require('@aragon/court-backend-shared/models/environments/TruffleEnvironment')

Logger.setDefaults(false, false)
const logger = Logger('setup')

const { network, guardians: guardiansNumber, disputes } = yargs
  .help()
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('guardians', { alias: 'j', describe: 'Number of guardians to activate', type: 'string', default: 5 })
  .option('disputes', { alias: 'd', describe: 'Number of disputes to create', type: 'string', default: 5 })
  .strict()
  .argv

async function setup() {
  const environment = new Environment(network)
  const court = await environment.getCourt()
  const allAccounts = await environment.getAccounts()
  const sender = allAccounts[0]
  const guardians = allAccounts.slice(1, Math.min(parseInt(guardiansNumber) + 1, allAccounts.length))

  // update term if necessary
  execSync(`node ./bin/index.js heartbeat -n ${network}`)

  // mint, stake and activate tokens for every guardian
  execSync(`node ./bin/index.js mint -t ant -a 100000000 -r ${sender} -n ${network}`)
  for (let i = 0; i < guardians.length; i++) {
    const guardian = guardians[i]
    const amount = (i + 1) * 10000
    execSync(`node ./bin/index.js stake -a ${amount} -j ${guardian} -n ${network}`)
    execSync(`node ./bin/index.js activate -a ${amount} -f ${guardian} -n ${network}`)
  }

  // check court has started
  const currentTermId = await court.currentTermId()
  const neededTransitions = await court.neededTransitions()
  if (currentTermId.eq(bn(0)) && neededTransitions.eq(bn(0))) {
    logger.warn('court has not started yet, please make sure court is at term 1 to create disputes and run the script again.')
  } else {
    // create disputes
    for (let i = 0; i < disputes; i++) {
      const arbitrable = arbitrables[i]
      execSync(`node ./bin/index.js mint -t fee -a 5000 -r ${arbitrable} -n ${network}`)
      execSync(`node ./bin/index.js dispute -a ${arbitrable} -m 'Testing dispute #${i}' -e 'http://github.com/aragon/protocol' -c -n ${network}`)
    }
  }
}

setup().then(() => process.exit(0)).catch(errorHandler)
