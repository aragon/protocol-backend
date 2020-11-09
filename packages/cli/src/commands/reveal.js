const logger = require('@aragon/protocol-backend-shared/helpers/logger')('reveal')

const command = 'reveal'
const describe = 'Reveal committed vote'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Committed outcome to reveal', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password used to commit the vote', type: 'string', demand: true },
  voter: { alias: 'v', describe: 'Address of the voter revealing for (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { voter, dispute, outcome, password }) => {
  const protocol = await environment.getProtocol()
  const to = voter || await protocol.environment.getSender()
  await protocol.reveal(dispute, to, outcome, password)
  logger.success(`Vote revealed for dispute #${dispute} for ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
