import * as ActionTypes from '../actions/types'

const initialState = { module: null, list: [], current: {}, guardianDrafts: [], guardianStaging: [], guardianAccounting: [] }

const GuardiansReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_GUARDIANS_LIST:
      return Object.assign({}, state, { list: action.list })
    case ActionTypes.RECEIVE_GUARDIAN:
      return Object.assign({}, state, { current: action.guardian })
    case ActionTypes.RECEIVE_GUARDIAN_DRAFTS:
      return Object.assign({}, state, { guardianDrafts: action.guardianDrafts })
    case ActionTypes.RECEIVE_GUARDIAN_STAKING:
      return Object.assign({}, state, { guardianStaking: action.guardianStaking })
    case ActionTypes.RECEIVE_GUARDIAN_ACCOUNTING:
      return Object.assign({}, state, { guardianAccounting: action.guardianAccounting })
    case ActionTypes.RECEIVE_GUARDIANS_MODULE:
      return Object.assign({}, state, { module: action.module })
    default:
      return state
  }
}

export default GuardiansReducer
