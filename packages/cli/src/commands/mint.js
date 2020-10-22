const logger = require('@aragon/protocol-backend-shared/helpers/logger')('mint')
const { bigExp } = require('@aragon/protocol-backend-shared/helpers/numbers')

const command = 'mint'
const describe = 'Mint tokens for a certain address'

const builder = {
  token: { alias: 't', describe: 'Token symbol', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Amount to mint (without decimals)', type: 'string', demand: true },
  recipient: { alias: 'r', describe: 'Recipient address (will use default address if missing)', type: 'string' },
}

const handlerAsync = async (environment, { recipient, token: symbol, amount }) => {
  const protocol = await environment.getCourt()
  const to = recipient || await protocol.environment.getSender()

  let token
  if (symbol.toLowerCase() === 'ant') token = await protocol.token()
  if (symbol.toLowerCase() === 'fee') token = await protocol.feeToken()
  if (!token) throw new Error(`Minting ${symbol} is not supported yet`)

  logger.info(`Minting ${symbol} ${amount} to ${to}...`)
  const decimals = await token.decimals()
  await token.generateTokens(to, bigExp(amount, decimals))
  logger.success(`Minted ${symbol} ${amount} to ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
