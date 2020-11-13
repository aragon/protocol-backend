import { utils } from 'ethers'
import { fromWei } from 'web3-utils'
import { BigNumber, BigNumberish } from 'ethers/utils'

const bn = (x: BigNumberish) => utils.bigNumberify(x)
const bigExp = (x: BigNumberish, y = 18) => bn(x).mul(bn(10).pow(bn(y)))
const maxUint = (e: BigNumberish) => bn(2).pow(bn(e)).sub(bn(1))
const tokenToString = (x: BigNumberish, symbol: string) => `${fromWei(bn(x).toString())} ${symbol}`

const MAX_UINT64 = maxUint(64)

export {
  bn,
  bigExp,
  maxUint,
  tokenToString,
  MAX_UINT64,
  BigNumber,
  BigNumberish
}
