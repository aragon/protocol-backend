import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragon/court-backend-server/build/web3/Network'
const OUTCOMES = {
  0: 'Missing',
  1: 'Leaked',
  2: 'Refused to vote',
  3: 'Blocked',
  4: 'Allowed',
}

class DisputeRuled extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const twoDaysBeforeNow = Math.floor((Date.now()-(2*this._DAYS))/1000)
    const query = `
    {
      disputes(where: {ruledAt_gt: ${twoDaysBeforeNow}}, orderBy: createdAt) {
        id
        finalRuling
        guardians {
          guardian {id}
        }
      }
    }
    `
    const { disputes } = await Network.query(query)
    for (const dispute of disputes) {
      const { 
        id: disputeId,
        finalRuling,
        guardians
      } = dispute
      for (const guardian of guardians) {
        notifications.push({ 
          address: guardian.guardian.id,
          details: {
            emailTemplateModel: {
              disputeId,
              disputeUrl: this.disputeUrl(disputeId),
              disputeResult: OUTCOMES[finalRuling]
            },
          }
        })
      }
    }
    return notifications
  }

  get emailTemplateAlias() { return 'ruled' }
  get scanPeriod() { return this._MINUTES }
}

export default new DisputeRuled()
