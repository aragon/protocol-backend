import BaseArtifacts from './BaseArtifacts'

const BUILDS: { [repo: string]: { [contract: string]: any } } = {
  '@aragon/erc20-faucet': {
    'ERC20Faucet': require('@aragonone/erc20-faucet/build/contracts/ERC20Faucet'),
  },
  '@aragon/protocol-evm': {
    'ERC20Mock': require('@aragon/protocol-evm/artifacts/ERC20Mock'),
    'AragonProtocol': require('@aragon/protocol-evm/artifacts/AragonProtocol'),
    'DisputeManager': require('@aragon/protocol-evm/artifacts/DisputeManager'),
    'GuardiansRegistry': require('@aragon/protocol-evm/artifacts/GuardiansRegistry'),
    'PaymentsBook': require('@aragon/protocol-evm/artifacts/PaymentsBook'),
  }
}

export default class StaticArtifacts extends BaseArtifacts {
  getContractSchema(contractName: string, dependency: string): any {
    if (!BUILDS[dependency]) throw Error(`Could not find artifact for ${dependency}/${contractName}`)
    return BUILDS[dependency][contractName]
  }
}
