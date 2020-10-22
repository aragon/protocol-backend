const logger = require('@aragon/protocol-backend-shared/helpers/logger')('stake')

const command = 'stake'
const describe = 'Stake tokens for a guardian'

const builder = {
  guardian: { alias: 'j', describe: 'Address of the guardian staking the tokens', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Number of tokens to stake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async (environment, { guardian, amount, data }) => {
  const court = await environment.getCourt()
  await court.stake(guardian, amount, data)
  logger.success(`Staked ${amount} for ${guardian}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
