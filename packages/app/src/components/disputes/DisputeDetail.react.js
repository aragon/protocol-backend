import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import { toDate } from '../../helpers/toDate'
import { fromWei } from 'web3-utils'
import { hexToAscii } from 'web3-utils'
import DisputeActions from '../../actions/disputes'

export default class DisputeDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { id: this.props.match.params.id, dispute: { } }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(DisputeActions.find(this.state.id))
  }

  render() {
    const { id, dispute } = this.state
    return (
      <div ref="disputeDetail">
        <h3>Dispute #{id}</h3>
          { !dispute.subject ? 'Loading...' :
            <div>
              <p>Subject: {dispute.subject}</p>
              <p>Metadata: {dispute.metadata}</p>
              <p>Term ID: {dispute.createTermId}</p>
              <p>Possible rulings: {dispute.possibleRulings}</p>
              <p>State: {dispute.state}</p>
              <p>Final ruling: {dispute.finalRuling}</p>
              <p>Created at: {toDate(dispute.createdAt)}</p>
              <p>Evidence:</p>
              <ul>{this._buildEvidenceList()}</ul>
              <p>Rounds:</p>
              <ul>{this._buildRoundsDetail()}</ul>
            </div>
          }
      </div>
    )
  }

  _buildEvidenceList() {
    return this.state.dispute.evidences.map((evidence, index) =>
      <li key={index}>
        Evidence #{evidence.id}
        <ul>
          <li>Data: {hexToAscii(evidence.data)}</li>
          <li>Submitter: {evidence.submitter}</li>
          <li>Created at: {toDate(evidence.createdAt)}</li>
        </ul>
      </li>
    )
  }

  _buildRoundsDetail() {
    return this.state.dispute.rounds.map((round, index) =>
      <li key={index}>
        Round #{parseInt(round.number) + 1}
        <ul>
          <li>State: {round.state}</li>
          <li>Vote ID: {round.vote ? round.vote.id : '...'}</li>
          <li>Winning outcome: {round.vote ? round.vote.winningOutcome : '...'}</li>
          <li>Delayed terms: {round.delayedTerms}</li>
          <li>Draft term ID: {round.draftTermId}</li>
          <li>Guardians number: {round.guardiansNumber}</li>
          <li>Selected guardians: {round.selectedGuardians}</li>
          <li>Coherent guardians: {round.coherentGuardians}</li>
          <li>Settled penalties: {round.settledPenalties ? 'Yes' : 'No'}</li>
          <li>Collected tokens: {fromWei(round.collectedTokens)}</li>
          <li>Created at: {toDate(round.createdAt)}</li>
          <li>Appeal:
            {!round.appeal ? ' None' : (
              <ul>
                <li>Appeal maker: {round.appeal.maker}</li>
                <li>Appeal maker ruling: {round.appeal.appealedRuling}</li>
                <li>Appeal taker: {round.appeal.taker}</li>
                <li>Appeal taker ruling: {round.appeal.opposedRuling}</li>
                <li>Appeal settled: {round.appeal.settled ? 'Yes' : 'No'}</li>
                <li>Appeal created at: {toDate(round.appeal.createdAt)}</li>
              </ul>
            )}
          </li>
          <li>Guardians:
            {round.guardians.length === 0 ? ' None' : (
              <ul>
                {round.guardians.map((guardian, index) =>
                  <li key={index}>
                    <Link to={`/guardians/${guardian.guardian.id}/detail`}>{guardian.guardian.id}</Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        </ul>
      </li>
    )
  }

  _onChange() {
    if(this.refs.disputeDetail) {
      const { current } = Store.getState().disputes
      this.setState({ dispute: current })
    }
  }
}
