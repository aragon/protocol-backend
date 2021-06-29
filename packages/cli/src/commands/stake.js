const logger = require('@aragon/protocol-backend-shared/helpers/logger')('stake')

const command = 'stake'
const describe = 'Stake tokens for a guardian'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to stake', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Address of the guardian staking the tokens for (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount }) => {
  const protocol = await environment.getProtocol()
  const to = guardian || await protocol.environment.getSender()
  await protocol.stake(to, amount)
  logger.success(`Staked ${amount} for ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
