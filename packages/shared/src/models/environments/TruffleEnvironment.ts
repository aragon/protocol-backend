import { ethers } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { Environment, Network, Protocol } from './Environment'
import TruffleConfig from '@truffle/config'
import JsonRpcSigner from '../providers/JsonRpcSigner'
import DynamicArtifacts from '../artifacts/DynamicArtifacts'

export default class TruffleEnvironment extends Environment {

  sender?: string
  config?: TruffleConfig

  constructor(network: Network, sender?: string) {
    super(network)
    this.sender = sender
  }

  async getProtocol(address?: string): Promise<Protocol> {
    if (address) return super.getProtocol(address)
    if (process.env.PROTOCOL_ADDRESS) return super.getProtocol(process.env.PROTOCOL_ADDRESS)
    const config = require('../../truffle-config')
    const { protocol } = config.networks[this.network] || { protocol: undefined }
    if (!protocol) throw Error(`Missing protocol address for network ${this.network}`)
    return super.getProtocol(protocol)
  }

  async _getProvider(): Promise<Web3Provider> {
    const { provider } = this._getNetworkConfig()
    return new Web3Provider(provider)
  }

  async _getSigner(): Promise<JsonRpcSigner> {
    const { from, gas, gasPrice } = this._getNetworkConfig()
    const provider = await this.getProvider()
    return new JsonRpcSigner(provider, this.sender || from, { gasLimit: gas, gasPrice })
  }

  async _getArtifacts() {
    const signer = await this.getSigner()
    return new DynamicArtifacts(signer)
  }

  _getNetworkConfig(): TruffleConfig {
    if (!this.config) {
      this.config = TruffleConfig.detect({ logger: console })
      this.config.network = this.network
    }
    return this.config
  }
}
