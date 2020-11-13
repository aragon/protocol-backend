import Protocol from '../Protocol'
import { request } from 'graphql-request'
import { JsonRpcProvider, TransactionReceipt } from 'ethers/providers'
import { Signer } from 'ethers'

import { BaseArtifacts, ArtifactBuilder } from '../artifacts/BaseArtifacts'

const SUBGRAPH_LOCAL = 'http://127.0.0.1:8000'
const SUBGRAPH_REMOTE = 'https://api.thegraph.com'

type Network = 'ganache' | 'rpc' | 'rinkeby' | 'ropsten' | 'staging' | 'mainnet'

export default abstract class Environment {

  network: Network
  provider?: JsonRpcProvider
  signer?: Signer
  artifacts?: BaseArtifacts

  constructor(network: Network) {
    this.network = network
  }

  getSubgraph(): string {
    const base = this.network === 'ganache' ? SUBGRAPH_LOCAL : SUBGRAPH_REMOTE
    return `${base}/subgraphs/name/aragon/aragon-protocol-${this.network}`
  }

  async query(query: string): Promise<any> {
    const subgraph = this.getSubgraph()
    return request(subgraph, query)
  }

  async getProtocol(address: string): Promise<Protocol> {
    const AragonProtocol = await this.getArtifact('AragonProtocol', '@aragon/protocol-evm')
    const protocol = await AragonProtocol.at(address)
    return new Protocol(protocol, this)
  }

  async getTransaction(hash: string): Promise<TransactionReceipt> {
    const provider = await this.getProvider()
    return provider.waitForTransaction(hash)
  }

  async getProvider(): Promise<JsonRpcProvider> {
    if (!this.provider) this.provider = await this._getProvider()
    return this.provider
  }

  async getSigner(): Promise<Signer> {
    if (!this.signer) this.signer = await this._getSigner()
    return this.signer
  }

  async getArtifacts(): Promise<BaseArtifacts> {
    if (!this.artifacts) this.artifacts = await this._getArtifacts()
    return this.artifacts
  }

  async getArtifact(contractName: string, dependency?: string): Promise<ArtifactBuilder> {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getAccounts(): Promise<string[]> {
    const provider = await this.getProvider()
    return provider.listAccounts()
  }

  async getSender(): Promise<string> {
    const signer = await this.getSigner()
    return signer.getAddress()
  }

  abstract async _getProvider(): Promise<JsonRpcProvider>
  abstract async _getSigner(): Promise<Signer>
  abstract async _getArtifacts(): Promise<BaseArtifacts>
}

export { 
  Network,
  Environment,
  Protocol,
  JsonRpcProvider,
}
