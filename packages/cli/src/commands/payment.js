const logger = require('@aragon/protocol-backend-shared/helpers/logger')('payment')

const command = 'payment'
const describe = 'Make Aragon Protocol payment'

const builder = {
  amount: { alias: 'a', describe: 'Amount to be paid', type: 'string', demand: true },
  token: { alias: 't', describe: 'Address of the token being paid', type: 'string', demand: true },
  payer: { alias: 'p', describe: 'Address of the user paying on belhaf of', type: 'string' },
  data: { alias: 'd', describe: 'Additional data to be logged', type: 'string' }
}

const handlerAsync = async (environment, { token, amount, payer, data }) => {
  const protocol = await environment.getProtocol()
  await protocol.pay(token, amount, payer, data)
  logger.success(`Paid ${amount} of tokens ${token} for ${payer} (${data})`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
