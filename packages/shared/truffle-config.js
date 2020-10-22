const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { rpc, ropsten, rinkeby, staging, mainnet } } = config

rpc.protocol = undefined
staging.protocol = '0x52180af656a1923024d1accf1d827ab85ce48878'
ropsten.protocol = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.protocol = '0xf7970965489f4d4eafcf5fad55ca5ea57fb4bfcb'
mainnet.protocol = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
