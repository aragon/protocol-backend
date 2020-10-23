const { ethers } = require('ethers')
const Environment = require('./Environment')
const TruffleConfig = require('@truffle/config')
const JsonRpcSigner = require('../providers/JsonRpcSigner')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')

class TruffleEnvironment extends Environment {
  constructor(network, sender = undefined) {
    super(network)
    this.sender = sender
  }

  async getProtocol(address = undefined) {
    if (address) return super.getProtocol(address)
    if (process.env.PROTOCOL_ADDRESS) return super.getProtocol(process.env.PROTOCOL_ADDRESS)
    const config = require('../../truffle-config')
    const { protocol } = config.networks[this.network] || { protocol: undefined }
    if (!protocol) throw Error(`Missing protocol address for network ${this.network}`)
    return super.getProtocol(protocol)
  }

  async _getProvider() {
    const { provider } = this._getNetworkConfig()
    return new ethers.providers.Web3Provider(provider)
  }

  async _getSigner() {
    const { from, gas, gasPrice } = this._getNetworkConfig()
    const provider = await this.getProvider()
    return new JsonRpcSigner(provider, this.sender || from, { gasLimit: gas, gasPrice })
  }

  async _getArtifacts() {
    const signer = await this.getSigner()
    return new DynamicArtifacts(signer)
  }

  _getNetworkConfig() {
    if (!this.config) {
      this.config = TruffleConfig.detect({ logger: console })
      this.config.network = this.network
    }
    return this.config
  }
}

module.exports = TruffleEnvironment
