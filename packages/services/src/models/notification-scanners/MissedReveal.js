import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragon/protocol-backend-shared/build/web3/Network'
import { draftTermIdFor } from '../../helpers/term-id-getter'

class MissedReveal extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const termId = await draftTermIdFor('appealing')
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2,3], draftedTermId_lte: ${termId}}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        guardians (where: {commitment_not: null, revealDate: null}) {
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
  get emailTemplateAlias() { return 'missed-reveal' }
  get scanPeriod() { return this._MINUTES }
}

export default new MissedReveal()
