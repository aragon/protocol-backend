const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.ganache = Object.assign({}, { ...config.networks.rpc })

// copy rpc config for ganache
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { ganache, ropsten, rinkeby, staging, mainnet } } = config

ganache.protocol = undefined
staging.protocol = '0x2057Fa53c5c85bB2cff125f9DB2D0cA7E4eeBE02'
ropsten.protocol = '0x7639480251C12f8168eeEc5e815Ab96072E5fe62'
rinkeby.protocol = '0xDB56c4d44ba23133805A38d837aBeC811D6c28b9'
mainnet.protocol = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
