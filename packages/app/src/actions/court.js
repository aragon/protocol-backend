import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const HEARTBEAT_MAX_TRANSITIONS = 20

const CourtActions = {
  async findCourtAddress() {
    const result = await Network.query('{ courts { id } }')
    if (result.courts.length === 0) throw Error('Missing Aragon Court deployment')
    if (result.courts.length > 1) throw Error('Found more than Aragon Court deployment')
    return result.courts[0].id
  },

  findCourt() {
    return async function(dispatch) {
      try {
        const courtAddress = await CourtActions.findCourtAddress()
        const result = await Network.query(`{
          court(id: "${courtAddress}") {
            id
            termDuration
            currentTerm
            token {
              id
              symbol
              name
              decimals 
            }
            feeToken {
              id 
              symbol
              name
              decimals
            }
            guardianFee
            draftFee
            settleFee
            evidenceTerms
            commitTerms
            revealTerms
            appealTerms
            appealConfirmationTerms
            penaltyPct
            finalRoundReduction
            firstRoundGuardiansNumber
            appealStepFactor
            maxRegularAppealRounds
            finalRoundLockTerms
            appealCollateralFactor
            appealConfirmCollateralFactor
            minActiveBalance
            fundsGovernor
            configGovernor
            modulesGovernor
            paymentsBook {
              id
              currentPeriod
              periodDuration
              governorSharePct
            }
            modules {
              id
              type
              moduleId
            }
          }
        }`)

        let neededTransitions = '(cannot fetch info)'

        if (await Network.isEnabled()) {
          if (await Network.isCourtAt(courtAddress)) {
            const court = await Network.getCourt(courtAddress)
            neededTransitions = await court.neededTransitions()
          } else {
            dispatch(ErrorActions.show(new Error(`Could not find Aragon Court at ${courtAddress}, please make sure you're in the right network`)))
          }
        }

        const court = { ...result.court, neededTransitions, address: courtAddress }
        dispatch(CourtActions.receiveCourt(court))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  heartbeat() {
    return async function(dispatch) {
      try {
        const court = await Network.getCourt()
        await court.heartbeat(HEARTBEAT_MAX_TRANSITIONS)
        dispatch(CourtActions.findCourt())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveCourt(court) {
    return { type: ActionTypes.RECEIVE_COURT, court }
  },
}

export default CourtActions
