const logger = require('@aragon/court-backend-shared/helpers/logger')('activate')

const command = 'activate'
const describe = 'Activate tokens to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to activate', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Optional address of the guardian activating the tokens for', type: 'string' },
}

const handlerAsync = async (environment, { from, guardian, amount }) => {
  const court = await environment.getCourt()

  if (!guardian || guardian === from) {
    await court.activate(amount)
    logger.success(`Activated ${amount}`)
  }
  else {
    await court.activateFor(guardian, amount)
    logger.success(`Activated ${amount} for ${guardian}`)
  }
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
