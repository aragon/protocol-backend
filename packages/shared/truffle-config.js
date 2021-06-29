const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.ganache = Object.assign({}, { ...config.networks.rpc })

// copy rpc config for ganache
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { ganache, ropsten, rinkeby, staging, mainnet } } = config

ganache.protocol = undefined
staging.protocol = '0x3E5D4a431f955C1eaB2BF919e174426572c4714F'
ropsten.protocol = '0xc236205f7f1c4a4B0A857c350BF64bB0FF385702'
rinkeby.protocol = '0x3F5E248BB5cd3c1275304e692d6cacC708E004d0'
mainnet.protocol = undefined

module.exports = config
