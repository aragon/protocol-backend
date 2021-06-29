const logger = require('@aragon/protocol-backend-shared/helpers/logger')('activate')

const command = 'activate'
const describe = 'Activate tokens to the Protocol'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to activate', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Optional address of the guardian activating the tokens for (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount }) => {
  const protocol = await environment.getProtocol()
  const to = guardian || await protocol.environment.getSender()
  await protocol.activate(to, amount)
  logger.success(`Activated ${amount} for ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
