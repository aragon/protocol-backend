const logger = require('@aragon/protocol-backend-shared/helpers/logger')('arbitrable')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Protocol'
const builder = {}

const handlerAsync = async (environment, {}) => {
  const protocol = await environment.getProtocol()
  const arbitrable = await protocol.deployArbitrable()
  logger.success(`Created Arbitrable instance ${arbitrable.address}`)
  console.log(arbitrable.address)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
