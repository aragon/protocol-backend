const logger = require('@aragon/protocol-backend-shared/helpers/logger')('activate')

const command = 'activate'
const describe = 'Activate ANJ to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to activate', type: 'string', demand: true },
  guardian: { alias: 'j', describe: 'Optional address of the guardian activating the tokens for. If missing tokens will be activated for the sender.', type: 'string' },
}

const handlerAsync = async (environment, { from, guardian, amount }) => {
  const court = await environment.getCourt()

  if (!guardian || guardian === from) {
    await court.activate(amount)
    logger.success(`Activated ANJ ${amount}`)
  }
  else {
    await court.activateFor(guardian, amount)
    logger.success(`Activated ANJ ${amount} for ${guardian}`)
  }
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
