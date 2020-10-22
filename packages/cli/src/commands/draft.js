const logger = require('@aragon/protocol-backend-shared/helpers/logger')('draft')

const command = 'draft'
const describe = 'Draft dispute and close evidence submission period if necessary'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute }) => {
  const protocol = await environment.getProtocol()
  const guardians = await protocol.draft(dispute)
  logger.success(`Drafted dispute #${dispute} with guardians ${guardians.join(', ')}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
