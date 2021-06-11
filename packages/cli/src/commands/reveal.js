const logger = require('@aragon/court-backend-shared/helpers/logger')('reveal')

const command = 'reveal'
const describe = 'Reveal committed vote'

const builder = {
  guardian: { alias: 'g', describe: 'Address of the guardian revealing for', type: 'string' },
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Committed outcome to reveal', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password used to commit the vote', type: 'string', demand: true },
}

const handlerAsync = async (environment, { guardian, dispute, outcome, password }) => {
  const court = await environment.getCourt()
  const onBehalfOf = guardian || await court.environment.getSender()
  await court.reveal(dispute, onBehalfOf, outcome, password)
  logger.success(`Vote revealed for dispute #${dispute} for guardian ${onBehalfOf}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
