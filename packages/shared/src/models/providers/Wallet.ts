import { ethers } from 'ethers'
import { TransactionRequest, TransactionResponse } from 'ethers/providers'
import { bn, BigNumberish } from '../../helpers/numbers'
import GasPriceOracle from '../../helpers/gas-price-oracle'

type GasParams = { gasPrice?: BigNumberish, gasLimit?: BigNumberish }

export default class Wallet extends ethers.Wallet {

  gasPrice?: BigNumberish
  gasLimit?: BigNumberish

  constructor(
    privateKey: string,
    provider: ethers.providers.Provider,
    { gasPrice, gasLimit }: GasParams = {}
  ) {
    super(privateKey, provider)
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit
  }

  async sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    if (!transaction.gasLimit && this.gasLimit) transaction.gasLimit = bn(this.gasLimit).toHexString()
    if (!transaction.gasPrice && this.gasPrice) transaction.gasPrice = bn(await this.getGasPrice()).toHexString()
    const tx = await super.sendTransaction(transaction)
    await this.provider.waitForTransaction(tx.hash!)
    return tx
  }

  async getGasPrice(): Promise<BigNumberish> {
    const network = await this.provider.getNetwork()
    const averageGasPrice = await GasPriceOracle.fetch(network.chainId)
    return averageGasPrice || this.gasPrice as BigNumberish
  }
}

export { 
  Wallet,
  GasParams
}
