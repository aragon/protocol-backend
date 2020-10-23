const logger = require('@aragon/protocol-backend-shared/helpers/logger')('arbitrable')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Protocol'

const builder = {
  owner: { alias: 'o', describe: 'Address owner of the Arbitrable', type: 'string' },
}

const handlerAsync = async (environment, { owner }) => {
  const protocol = await environment.getProtocol()
  const arbitrable = await protocol.deployArbitrable(owner)
  logger.success(`Created Arbitrable instance ${arbitrable.address}`)
  console.log(arbitrable.address)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
