const logger = require('@aragon/protocol-backend-shared/helpers/logger')('deactivate')

const command = 'deactivate'
const describe = 'Deactivate tokens to the Protocol'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to deactivate', type: 'string', demand: true },
}

const handlerAsync = async (environment, { amount }) => {
  const protocol = await environment.getCourt()
  await protocol.deactivate(amount)
  logger.success(`Requested ${amount} tokens for deactivation`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
