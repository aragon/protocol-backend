import { ethers } from 'ethers'
import { TransactionRequest, TransactionResponse, JsonRpcSigner as SignerType } from 'ethers/providers'
import { bn, BigNumberish } from '../../helpers/numbers'

export default class JsonRpcSigner extends ethers.Signer {

  address?: string
  provider: ethers.providers.JsonRpcProvider
  signer: ethers.providers.JsonRpcSigner
  gasPrice?: BigNumberish
  gasLimit?: BigNumberish

  constructor(
    provider: ethers.providers.JsonRpcProvider, 
    address?: string, 
    { gasPrice, gasLimit }: { gasPrice?: BigNumberish, gasLimit?: BigNumberish } = {}
  ) {
    super()
    this.address = address
    this.provider = provider
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit
    this.provider = provider
    this.signer = provider.getSigner(this.address)
  }

  async sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    if (!transaction.gasLimit && this.gasLimit) transaction.gasLimit = bn(this.gasLimit).toHexString()
    if (!transaction.gasPrice && this.gasPrice) transaction.gasPrice = bn(this.gasPrice).toHexString()
    const tx = await this.signer.sendTransaction(transaction)
    await tx.wait(1)
    return tx
  }

  // need to assign methods through this.signer because ethers.providers.JsonRpcSigner cannot be extended directly
  getAddress: SignerType['getAddress'] = async () => this.signer.getAddress()
  getBalance: SignerType['getBalance'] = async (blockTag?) => this.signer.getBalance(blockTag)
  getTransactionCount: SignerType['getTransactionCount'] = async (blockTag?) => this.signer.getTransactionCount(blockTag)
  sendUncheckedTransaction: SignerType['sendUncheckedTransaction'] = async (transaction) => this.signer.sendUncheckedTransaction(transaction)
  signMessage: SignerType['signMessage'] = async (message) => this.signer.signMessage(message)
  unlock: SignerType['unlock'] = async (password) => this.signer.unlock(password)
}
