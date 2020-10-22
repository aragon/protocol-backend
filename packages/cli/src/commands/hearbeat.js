const logger = require('@aragon/protocol-backend-shared/helpers/logger')('heartbeat')

const command = 'heartbeat'
const describe = 'Call protocol hearbeat'

const builder = {
  transitions: { alias: 't', describe: 'Max number of transitions', type: 'string' }
}

const handlerAsync = async (environment, { transitions }) => {
  const protocol = await environment.getCourt()
  const heartbeats = await protocol.heartbeat(transitions)
  logger.success(`Transitioned ${heartbeats} Protocol terms`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
