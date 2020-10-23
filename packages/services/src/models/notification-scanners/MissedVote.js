import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragon/protocol-backend-server/build/web3/Network'
import { draftTermIdFor } from '../../helpers/term-id-getter'

class MissedVote extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const termId = await draftTermIdFor('revealing')
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2], draftedTermId_lte: ${termId}}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        guardians (where: {commitment: null}) {
          guardian {id}
        } 
      }
    }
    `
    const { adjudicationRounds } = await Network.query(query)
    for (const adjudicationRound of adjudicationRounds) {
      const {
        id: adjudicationRoundId,
        dispute: { id: disputeId },
        guardians
      } = adjudicationRound
      for (const guardian of guardians) {
        notifications.push({
          address: guardian.guardian.id,
          details: {
            emailTemplateModel: {
              disputeId,
              disputeUrl: this.disputeUrl(disputeId),
              lockedAnjBalanceUrl: this.dashboardUrl
            },
            adjudicationRoundId
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'missed-vote' }
  get scanPeriod() { return this._MINUTES }
}

export default new MissedVote()
