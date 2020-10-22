const logger = require('@aragon/protocol-backend-shared/helpers/logger')('activate')

const command = 'activate'
const describe = 'Activate tokens to the Protocol'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to activate', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Optional address of the guardian activating the tokens for', type: 'string' },
}

const handlerAsync = async (environment, { from, guardian, amount }) => {
  const protocol = await environment.getProtocol()

  if (!guardian || guardian === from) {
    await protocol.activate(amount)
    logger.success(`Activated ${amount}`)
  }
  else {
    await protocol.activateFor(guardian, amount)
    logger.success(`Activated ${amount} for ${guardian}`)
  }
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
