import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const HEARTBEAT_MAX_TRANSITIONS = 20

const ProtocolActions = {
  async findProtocolAddress() {
    const result = await Network.query('{ courts { id } }')
    if (result.courts.length === 0) throw Error('Missing Aragon Court deployment')
    if (result.courts.length > 1) throw Error('Found more than Aragon Court deployment')
    return result.courts[0].id
  },

  findProtocol() {
    return async function(dispatch) {
      try {
        const protocolAddress = await ProtocolActions.findProtocolAddress()
        const result = await Network.query(`{
          court(id: "${protocolAddress}") {
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
          if (await Network.isProtocolAt(protocolAddress)) {
            const protocol = await Network.getProtocol(protocolAddress)
            neededTransitions = await protocol.neededTransitions()
          } else {
            dispatch(ErrorActions.show(new Error(`Could not find Aragon Court at ${protocolAddress}, please make sure you're in the right network`)))
          }
        }

        const protocol = { ...result.protocol, neededTransitions, address: protocolAddress }
        dispatch(ProtocolActions.receiveProtocol(protocol))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  heartbeat() {
    return async function(dispatch) {
      try {
        const protocol = await Network.getProtocol()
        await protocol.heartbeat(HEARTBEAT_MAX_TRANSITIONS)
        dispatch(ProtocolActions.findProtocol())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveProtocol(protocol) {
    return { type: ActionTypes.RECEIVE_PROTOCOL, protocol }
  },
}

export default ProtocolActions
