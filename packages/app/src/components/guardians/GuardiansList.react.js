import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import GuardiansActions from '../../actions/guardians'
import { fromWei } from 'web3-utils'
import { toDate } from '../../helpers/toDate'

export default class GuardiansList extends React.Component {
  constructor(props){
    super(props)
    this.state = { guardians: null, module: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(GuardiansActions.findAll())
    Store.dispatch(GuardiansActions.findModule())
  }

  render() {
    const { guardians, module } = this.state
    return (
      <div ref="guardiansList">
        <h3>Guardians</h3>
        { (!guardians || !module) ? <em>Loading...</em> : guardians.length === 0 ?
          <em>None</em> :
          <div ref="guardiansWrapper">
            <div ref="guardiansSummary">
              <p>Total staked balance: {fromWei(module.totalStaked)} </p>
              <p>Total active balance: {fromWei(module.totalActive)} </p>
              <p>Total deactivation balance: {fromWei(module.totalDeactivation)} </p>
              <p>Total number of guardians: {guardians.length} </p>
              <p>Total number of active guardians: {guardians.filter(guardian => guardian.activeBalance > 0).length} </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Address</th>
                  <th>Active balance</th>
                  <th>Locked balance</th>
                  <th>Staked balance</th>
                  <th>Deactivating balance</th>
                  <th>Created at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this._buildList()}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.guardians.map((guardian, index) => {
      return (
        <tr key={index}>
          <td><Link to={`/guardians/${guardian.id}/detail`}><b>{guardian.treeId}</b></Link></td>
          <td>{guardian.id}</td>
          <td>{fromWei(guardian.activeBalance)}</td>
          <td>{fromWei(guardian.lockedBalance)}</td>
          <td>{fromWei(guardian.availableBalance)}</td>
          <td>{fromWei(guardian.deactivationBalance)}</td>
          <td>{toDate(guardian.createdAt)}</td>
          <td>
            <Link to={`/guardians/${guardian.id}/drafts`}><b>drafts</b></Link> | <Link to={`/guardians/${guardian.id}/staking`}><b>staking</b></Link> | <Link to={`/guardians/${guardian.id}/accounting`}><b>accounting</b></Link>
          </td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.guardiansList) {
      const { list, module } = Store.getState().guardians
      this.setState({ guardians: list, module })
    }
  }
}
