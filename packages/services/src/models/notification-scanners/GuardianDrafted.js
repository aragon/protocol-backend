import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragon/court-backend-server/build/web3/Network'

class GuardianDrafted extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const query = `
    {
      adjudicationRounds(where: {state: Committing}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        guardians {
          guardian {id}
        } 
      }
    }
    `
    const { adjudicationRounds } = await Network.query(query)
    console.log(adjudicationRounds, ' adjucation rounds here');
    for (const adjudicationRound of adjudicationRounds) {
      const { 
        id: adjudicationRoundId,
        dispute: { id: disputeId },
        guardians
      } = adjudicationRound
      console.log(guardians, ' guardian');
      for (const guardian of guardians) {
        notifications.push({ 
          address: guardian.guardian.id,
          details: {
            emailTemplateModel: {
              disputeId,
              disputeUrl: this.disputeUrl(disputeId)
            },
            adjudicationRoundId
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'drafted' }
  get scanPeriod() { return this._MINUTES }
}

export default new GuardianDrafted()
