const logger = require('@aragon/protocol-backend-shared/helpers/logger')('appeal')

const command = 'appeal'
const describe = 'Appeal dispute in favour of a certain outcome'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome appealing in favor of', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute, outcome }) => {
  const protocol = await environment.getCourt()
  await protocol.appeal(dispute, outcome)
  logger.success(`Appealed dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
