const logger = require('@aragon/protocol-backend-shared/helpers/logger')('unstake')

const command = 'unstake'
const describe = 'Unstake tokens for a guardian'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to unstake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async (environment, { amount, data }) => {
  const protocol = await environment.getProtocol()
  await protocol.unstake(amount, data)
  logger.success(`Unstaked ${amount} tokens`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
