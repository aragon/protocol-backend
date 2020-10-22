const logger = require('@aragon/protocol-backend-shared/helpers/logger')('deactivate')

const command = 'deactivate'
const describe = 'Deactivate tokens to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of tokens to deactivate', type: 'string', demand: true },
}

const handlerAsync = async (environment, { amount }) => {
  const court = await environment.getCourt()
  await court.deactivate(amount)
  logger.success(`Requested ${amount} tokens for deactivation`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
