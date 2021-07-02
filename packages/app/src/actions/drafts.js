import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const DraftActions = {
  find(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardianDraft (id: "${id}") {
            id
            weight
            rewarded
            commitment
            outcome
            leaker
            createdAt
            guardian {
              id 
            }
            round {
              id
              number
              dispute {
                id
              }
            }
          }
        }`)
        dispatch(DraftActions.receiveDraft(result.guardianDraft))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          guardianDrafts (orderBy: createdAt, orderDirection: desc) {
            id
            weight
            rewarded
            commitment
            outcome
            leaker
            createdAt
            guardian {
              id 
            }
            round {
              id
              number
              dispute {
                id
              }
            }
          }
        }`)
        dispatch(DraftActions.receiveAll(result.guardianDrafts))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_DRAFTS_LIST, list }
  },

  receiveDraft(draft) {
    return { type: ActionTypes.RECEIVE_DRAFT, draft }
  },
}

export default DraftActions
