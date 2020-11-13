import { bn } from './numbers'
import { soliditySha3 } from 'web3-utils'
import { BigNumber, BigNumberish } from 'ethers/utils'

const hashVote = (outcome: string, salt: string): string | null => {
  return soliditySha3({ t: 'uint8', v: outcome }, { t: 'bytes32', v: salt })
}

const encodeVoteId = (disputeId: BigNumberish, roundId: BigNumberish): BigNumber => {
  return bn(2).pow(bn(128)).mul(bn(disputeId)).add(bn(roundId))
}

interface decodedVoteId { disputeId: BigNumber, roundId: BigNumber }
const decodeVoteId = (voteId: BigNumberish): decodedVoteId => {
  const mask = bn(2).pow(bn(128))
  const disputeId = bn(voteId).div(mask)
  const roundId = bn(voteId).sub(disputeId.mul(mask))
  return { disputeId, roundId }
}

export {
  hashVote,
  encodeVoteId,
  decodeVoteId,
}
