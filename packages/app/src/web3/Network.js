import Protocol from '@aragon/protocol-backend-shared/models/Protocol'
import Environment from '@aragon/protocol-backend-shared/models/environments/BrowserEnvironment'

const FAUCET = {
  staging: '0x19420Cf68cf6a8d18882730c8e8BAd169eeb1bdC',
  ropsten: '0xeBB0e629958469f28508d13f8497f9473AAd1A49',
  rinkeby: '0x555Fc80D37b7Cd5Bc13E27BD899539BB6280aa58',
}

const Network = {
  get environment() {
    return new Environment(this.getNetworkName())
  },

  async query(query) {
    return this.environment.query(query)
  },

  async isEnabled() {
    return this.environment.isEnabled()
  },

  async getAccount() {
    return this.environment.getSender()
  },

  async getBalance(address) {
    const provider = await this.environment.getProvider()
    return provider.getBalance(address)
  },

  async getProtocol(address) {
    if (!this.protocol) {
      const AragonProtocol = await this.environment.getArtifact('AragonProtocol', '@aragon/protocol-evm')
      const protocol = await AragonProtocol.at(address)
      this.protocol = new Protocol(protocol, this.environment)
    }
    return this.protocol
  },

  async getFaucet() {
    const faucetAddress = FAUCET[this.getNetworkName()]
    if (!this.faucet && faucetAddress) {
      const ERC20Faucet = await this.environment.getArtifact('ERC20Faucet', '@aragon/erc20-faucet')
      this.faucet = await ERC20Faucet.at(faucetAddress)
    }
    return this.faucet
  },

  async isProtocolAt(address) {
    try {
      await this.getProtocol(address)
      return true
    } catch (error) {
      if (error.message.includes(`no code at address ${address}`)) return false
      else throw error
    }
  },

  async isFaucetAvailable() {
    try {
      await this.getFaucet()
      return true
    } catch (error) {
      if (error.message.includes(`no code at address`)) return false
      else throw error
    }
  },

  getNetworkName() {
    const network = process.env.REACT_APP_NETWORK
    if (!network) throw Error('A network must be specified through a NETWORK env variables')
    return network
  },
}

export default Network
