const logger = require('@aragon/protocol-backend-shared/helpers/logger')('stake')

const command = 'stake'
const describe = 'Stake tokens for a guardian'

const builder = {
  guardian: { alias: 'g', describe: 'Address of the guardian staking the tokens', type: 'string' },
  amount: { alias: 'a', describe: 'Number of tokens to stake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount, data }) => {
  const protocol = await environment.getCourt()
  const to = guardian || await protocol.environment.getSender()
  await protocol.stake(to, amount, data)
  logger.success(`Staked ${amount} for ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
