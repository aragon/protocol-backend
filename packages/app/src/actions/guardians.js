import ErrorActions from './errors'
import Network from '../web3/Network'
import * as ActionTypes from '../actions/types'

const GuardiansActions = {
  find(address) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardian (id: "${address}") {
            treeId
            id
            activeBalance
            lockedBalance
            availableBalance
            deactivationBalance
            withdrawalsLockTermId
            createdAt
          }
        }`)
        dispatch(GuardiansActions.receiveGuardian(result.guardian))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardians (first: 1000, orderBy: createdAt, orderDirection: asc) {
            treeId
            id
            activeBalance
            lockedBalance
            availableBalance
            deactivationBalance
            createdAt
          }
        }`)
        dispatch(GuardiansActions.receiveAll(result.guardians))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findDrafts(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardian (id: "${id}") {
            treeId
            id
            drafts {
              id
              weight
              rewarded
              commitment
              outcome
              leaker
              createdAt
              round {
                id
                number
                dispute {
                  id
                }
              }
            }
          }
        }`)
        dispatch(GuardiansActions.receiveGuardianDrafts(result.guardian.drafts))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findStaking(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardian (id: "${id}") {
            anjMovements (orderBy: createdAt, orderDirection: desc) {
              id
              type
              amount
              effectiveTermId
              createdAt
            }
          }
        }`)
        dispatch(GuardiansActions.receiveGuardianStaking(result.guardian.anjMovements))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAccounting(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          feeMovements (where: { owner: "${id}" }, orderBy: createdAt, orderDirection: desc) {
            id
            type
            amount
            createdAt
          }
        }`)
        dispatch(GuardiansActions.receiveGuardianAccounting(result.feeMovements))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findModule() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardiansRegistryModules (first: 1) {
            id
            totalStaked
            totalActive
            totalDeactivation
          }
        }`)
        dispatch(GuardiansActions.receiveModule(result.guardiansRegistryModules[0]))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveGuardian(guardian) {
    return { type: ActionTypes.RECEIVE_GUARDIAN, guardian }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_GUARDIANS_LIST, list }
  },

  receiveGuardianDrafts(guardianDrafts) {
    return { type: ActionTypes.RECEIVE_GUARDIAN_DRAFTS, guardianDrafts }
  },

  receiveGuardianStaking(guardianStaking) {
    return { type: ActionTypes.RECEIVE_GUARDIAN_STAKING, guardianStaking }
  },

  receiveGuardianAccounting(guardianAccounting) {
    return { type: ActionTypes.RECEIVE_GUARDIAN_ACCOUNTING, guardianAccounting }
  },

  receiveModule(module) {
    return { type: ActionTypes.RECEIVE_GUARDIANS_MODULE, module }
  },
}

export default GuardiansActions
