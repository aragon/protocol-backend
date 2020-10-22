const logger = require('@aragon/protocol-backend-shared/helpers/logger')('confirm-appeal')

const command = 'confirm-appeal'
const describe = 'Confirm an existing appeal for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome confirming the appeal in favor of', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute, outcome }) => {
  const protocol = await environment.getCourt()
  await protocol.confirmAppeal(dispute, outcome)
  logger.success(`Confirmed appeal for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
