const logger = require('@aragon/protocol-backend-shared/helpers/logger')('commit')

const command = 'commit'
const describe = 'Commit vote for a dispute round'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute committing a vote for', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Voting outcome', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password to hash the vote to commit', type: 'string', demand: true },
  voter: { alias: 'v', describe: 'Address of the voter committing a vote for (sender by default)', type: 'string' },
}

const handlerAsync = async (environment, { dispute, voter, outcome, password }) => {
  const protocol = await environment.getProtocol()
  const to = voter || await protocol.environment.getSender()
  await protocol.commit(dispute, voter, outcome, password)
  logger.success(`Committed vote for dispute #${dispute} for voter ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
