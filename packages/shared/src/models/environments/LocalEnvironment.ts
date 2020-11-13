import { Wallet, GasParams } from '../providers/Wallet'
import { Network, Environment, Protocol } from './Environment'
import JsonRpcProvider from '../providers/JsonRpcProvider'
import DynamicArtifacts from '../artifacts/DynamicArtifacts'

require('dotenv').config() // Load env vars from .env file

/**
 * Requires the following env variables to be defined:
 *   - NETWORK: Network to connect to: rpc, rinkeby, mainnet, ...
 *   - PRIVATE_KEY: Private key of the account used
 *   - RPC: RPC endpoint, like "https://host:port/..."
 *   - PROTOCOL_ADDRESS: Address of the target Protocol contract to interact with
 *   - GAS_PRICE: Default gas price value
 *   - GAS: Default gas limit value
 *   - WEB3_POLLING_INTERVAL: Milliseconds interval for blocks polling
 */

const { NETWORK, PROTOCOL_ADDRESS, RPC, PRIVATE_KEY, GAS, GAS_PRICE, WEB3_POLLING_INTERVAL } = process.env

export default class LocalEnvironment extends Environment {
  constructor() {
    super(NETWORK as Network)
  }

  async getProtocol(): Promise<Protocol> {
    return super.getProtocol(PROTOCOL_ADDRESS as string)
  }

  async _getProvider(): Promise<JsonRpcProvider> {
    const provider = new JsonRpcProvider(RPC)
    provider.pollingInterval = parseInt(WEB3_POLLING_INTERVAL as string)
    return provider
  }

  async _getSigner(): Promise<Wallet> {
    const provider = await this.getProvider()
    return new Wallet(PRIVATE_KEY as string, provider, { gasPrice: GAS_PRICE, gasLimit: GAS } as GasParams)
  }

  async _getArtifacts(): Promise<DynamicArtifacts> {
    const signer = await this._getSigner()
    return new DynamicArtifacts(signer)
  }
}

export {
  LocalEnvironment,
  Protocol
}
