import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragon/protocol-backend-server/build/web3/Network'
import { draftTermIdFor, dueDateFor } from '../../helpers/term-id-getter'
import dateFormat from 'dateformat'

class DueTasks extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const committingTermId = await draftTermIdFor('commit-reminder')
    const revealingTermId = await draftTermIdFor('reveal-reminder')
    const query = `
    {
      committingRounds: adjudicationRounds(where: {state: Committing, draftedTermId_lte: ${committingTermId}}, orderBy: createdAt) {
        draftedTermId
        dispute {
          id
        }
        guardians (where: {commitment: null}) {
          guardian {id}
        } 
      }
     	revealingRounds: adjudicationRounds(where: {stateInt_in: [1,2], draftedTermId_lte: ${revealingTermId}}, orderBy: createdAt) {
        draftedTermId
        dispute {
          id
        }
        guardians (where: {commitment_not: null, revealDate: null}) {
          guardian {id}
        } 
      }
    }
    `
    const { committingRounds, revealingRounds } = await Network.query(query)
    let guardianTasks = {}
    await this._getTasks(guardianTasks, committingRounds, 'commit')
    await this._getTasks(guardianTasks, revealingRounds, 'reveal')
    for (const [address, tasks] of Object.entries(guardianTasks)) {
      notifications.push({
        address,
        details: {
          emailTemplateModel: {tasks}
        }
      })
    }
    return notifications
  }

  async _getTasks(guardianTasks, adjudicationRounds, type) {
    for (const adjudicationRound of adjudicationRounds) {
      const {
        draftedTermId,
        dispute: { id: disputeId },
        guardians
      } = adjudicationRound
      const dueDate = await this._dueDateString(draftedTermId, type)
      for (const guardian of guardians) {
        const address = guardian.guardian.id
        if (!guardianTasks[address]) guardianTasks[address] = []
        guardianTasks[address].push({
          name: type == 'commit' ? 'Commit vote' : 'Reveal vote',
          disputeId,
          disputeUrl: this.disputeUrl(disputeId),
          dueDate
        })
      }
    }
  }

  // Format: Monday, May 25, 2020, 7:36 PM UTC
  async _dueDateString(draftTermId, type) {
    const dueDateSeconds = await dueDateFor(draftTermId, type)
    const date = new Date(dueDateSeconds*1000)
    return dateFormat(date, 'dddd, mmmm d, yyyy, h:MMtt Z', true)
  }

  get emailTemplateAlias() { return 'due-tasks' }
  get scanPeriod() { return this._MINUTES }
}

export default new DueTasks()
