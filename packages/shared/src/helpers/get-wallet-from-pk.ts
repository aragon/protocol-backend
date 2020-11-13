import { isValidPrivate } from 'ethereumjs-util'
import Wallet from 'ethereumjs-wallet'

export default function (key: string): Wallet {
  const privateKey = Buffer.from(key.replace('0x', ''), 'hex')
  if (!isValidPrivate(privateKey)) throw Error('Given private key is not valid')
  return Wallet.fromPrivateKey(privateKey)
}
