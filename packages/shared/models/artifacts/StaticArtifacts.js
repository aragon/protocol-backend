const BaseArtifacts = require('./BaseArtifacts')

const BUILDS = {
  '@aragon/erc20-faucet': {
    'ERC20Faucet': require('@aragonone/erc20-faucet/build/contracts/ERC20Faucet'),
  },
  '@aragon/court-evm': {
    'ERC20Mock': require('@aragon/court-evm/artifacts/ERC20Mock'),
    'AragonCourt': require('@aragon/court-evm/artifacts/AragonCourt'),
    'DisputeManager': require('@aragon/court-evm/artifacts/DisputeManager'),
    'GuardiansRegistry': require('@aragon/court-evm/artifacts/GuardiansRegistry'),
    'PaymentsBook': require('@aragon/court-evm/artifacts/PaymentsBook'),
  }
}

class StaticArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    return BUILDS[dependency][contractName]
  }
}

module.exports = StaticArtifacts
