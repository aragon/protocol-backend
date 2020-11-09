const logger = require('@aragon/protocol-backend-shared/helpers/logger')('deactivate')

const command = 'deactivate'
const describe = 'Deactivate tokens from the Protocol'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to deactivate', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Optional address of the guardian deactivating the tokens from (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount }) => {
  const protocol = await environment.getProtocol()
  const from = guardian || await protocol.environment.getSender()
  await protocol.deactivate(from, amount)
  logger.success(`Requested ${amount} tokens for deactivation for ${from}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
