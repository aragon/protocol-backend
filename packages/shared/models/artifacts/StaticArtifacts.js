const BaseArtifacts = require('./BaseArtifacts')

const BUILDS = {
  '@aragon/erc20-faucet': {
    'ERC20Faucet': require('@aragonone/erc20-faucet/build/contracts/ERC20Faucet'),
  },
  '@aragon/protocol-evm': {
    'AragonProtocol': require('@aragon/protocol-evm/artifacts/AragonProtocol'),
    'DisputeManager': require('@aragon/protocol-evm/artifacts/DisputeManager'),
    'GuardiansRegistry': require('@aragon/protocol-evm/artifacts/GuardiansRegistry'),
    'PaymentsBook': require('@aragon/protocol-evm/artifacts/PaymentsBook'),
  }
}

class StaticArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    return BUILDS[dependency][contractName]
  }
}

module.exports = StaticArtifacts
