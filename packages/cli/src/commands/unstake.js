const logger = require('@aragon/protocol-backend-shared/helpers/logger')('unstake')

const command = 'unstake'
const describe = 'Unstake tokens for a guardian'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to unstake', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Address of the guardian unstaking the tokens for (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount }) => {
  const protocol = await environment.getProtocol()
  const from = guardian || await protocol.environment.getSender()
  await protocol.unstake(from, amount)
  logger.success(`Unstaked ${amount} tokens for ${from}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
