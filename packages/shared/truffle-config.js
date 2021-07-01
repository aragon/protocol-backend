const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.ganache = Object.assign({}, { ...config.networks.rpc })

// copy rpc config for ganache
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { ganache, ropsten, rinkeby, staging, mainnet } } = config

ganache.court = undefined
staging.court = '0xD2c15eCd1751C2cE8b02ab2D95db32E662517D61'
ropsten.court = '0x7639480251C12f8168eeEc5e815Ab96072E5fe62'
rinkeby.court = '0xC464EB732A1D2f5BbD705727576065C91B2E9f18'
mainnet.court = '0xFb072baA713B01cE944A0515c3e1e98170977dAF'

module.exports = config
