import { Reveal } from '../models/objection'
import Network from '../web3/Network'
import BaseValidator from './BaseValidator'
const { hashVote } = require('@aragon/protocol-backend-shared/helpers/voting')

class RevealsValidator extends BaseValidator {
  async validateForCreate({ guardian, voteId, outcome, salt }) {
    this._validateGuardian(guardian)
    await this._validateVoteId(guardian, voteId)
    await this._validateOutcome(voteId, outcome)
    await this._validateSalt(guardian, voteId, outcome, salt)
    return this.resetErrors()
  }

  _validateGuardian(guardian) {
    if (!guardian) return this.addError({ guardian: 'A guardian address value must be given' })
  }

  async _validateVoteId(guardian, voteId) {
    if (!voteId) return this.addError({ voteId: 'A vote ID must be given' })

    const protocol = await Network.getProtocol()
    const exists = await protocol.existsVote(voteId)
    if (!exists) this.addError({ voteId: `Vote with ID ${voteId} does not exist` })

    if (guardian) {
      const reveal = await Reveal.findOne({ guardian, voteId })
      if (reveal) this.addError({ voteId: `Vote with ID ${voteId} was already registered to be revealed for guardian ${guardian}` })
    }
  }

  async _validateOutcome(voteId, outcome) {
    if (!outcome) return this.addError({ outcome: 'An outcome must be given' })

    if (voteId) {
      const protocol = await Network.getProtocol()
      const isValid = await protocol.isValidOutcome(voteId, outcome)
      if (!isValid) this.addError({ outcome: `Outcome ${outcome} is not valid for the given voteId` })
    }
  }

  async _validateSalt(guardian, voteId, outcome, salt) {
    if (!salt) return this.addError({ salt: 'A salt value must be given' })

    if (guardian && voteId && outcome) {
      const protocol = await Network.getProtocol()
      const actualCommitment = await protocol.getCommitment(voteId, guardian)
      const expectedCommitment = hashVote(outcome, salt)
      if (expectedCommitment !== actualCommitment) this.addError({ salt: 'Signature does not correspond to the guardian address provided' })
    }
  }
}

export default new RevealsValidator()
