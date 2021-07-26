const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.ganache = Object.assign({}, { ...config.networks.rpc })

// copy rpc config for ganache
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { ganache, ropsten, rinkeby, staging, mainnet } } = config

ganache.court = undefined
staging.court = '0x9c003ec97676c30a041f128d671b3db2f790c3e7'
ropsten.court = '0x7639480251C12f8168eeEc5e815Ab96072E5fe62'
rinkeby.court = '0xC464EB732A1D2f5BbD705727576065C91B2E9f18'
mainnet.court = '0xFb072baA713B01cE944A0515c3e1e98170977dAF'

module.exports = config
