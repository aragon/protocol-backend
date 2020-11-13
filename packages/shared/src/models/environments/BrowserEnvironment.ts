import { Web3Provider } from 'ethers/providers'
import sleep from '../../helpers/sleep'
import { Network, Environment } from './Environment'
import JsonRpcSigner from '../providers/JsonRpcSigner'
import StaticArtifacts from '../artifacts/StaticArtifacts'

export default class BrowserEnvironment extends Environment {
  constructor(network: Network) {
    super(network)
  }

  async isEnabled(): Promise<boolean> {
    await sleep(2000)
    const { web3 } = (window as { web3?: any })
    return !!(web3 && web3.currentProvider && web3.currentProvider.selectedAddress)
  }

  async _getProvider(): Promise<Web3Provider> {
    const isEnabled = await this.isEnabled()
    if (!isEnabled) throw Error('Could not access to a browser web3 provider, please make sure to allow one.')
    const provider = (window as { web3?: any }).web3.currentProvider
    provider.setMaxListeners(300)
    return new Web3Provider(provider)
  }

  async _getSigner(): Promise<JsonRpcSigner> {
    const provider = await this.getProvider()
    return new JsonRpcSigner(provider)
  }

  async _getArtifacts(): Promise<StaticArtifacts> {
    const signer = await this.getSigner()
    return new StaticArtifacts(signer)
  }
}
