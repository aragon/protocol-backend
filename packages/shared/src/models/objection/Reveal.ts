import BaseModel from './BaseModel'

export default class Reveal extends BaseModel {
  static get tableName() {
    return 'Reveals'
  }

  voteId?: string
  guardian?: string
  blockNumber?: string
  disputeId?: string
  roundNumber?: number
  outcome?: number
  salt?: string
  revealed?: boolean
  failedAttempts?: number
  expired?: boolean
}
