const logger = require('@aragon/protocol-backend-shared/helpers/logger')('settle-guardian')

const command = 'settle-guardian'
const describe = 'Settle guardian for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  guardian: { alias: 'g', describe: 'Address of the guardian to be settled', type: 'string', demand: true }
}

const handlerAsync = async (environment, { dispute, guardian }) => {
  const protocol = await environment.getProtocol()
  await protocol.settleGuardian(dispute, guardian)
  logger.success(`Settled guardian ${guardian} for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
