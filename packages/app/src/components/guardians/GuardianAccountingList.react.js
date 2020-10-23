import React from 'react'
import Store from '../../store/store'
import { fromWei } from 'web3-utils'
import { toDate } from '../../helpers/toDate'
import { summarize } from '../../helpers/summarize'
import GuardiansActions from '../../actions/guardians'

export default class GuardianAccountingList extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: this.props.match.params.address, accounting: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(GuardiansActions.findAccounting(this.state.address))
  }

  render() {
    const { address, accounting } = this.state
    return (
      <div ref="guardianAccountingList">
        <h3>Accounting of Guardian {address}</h3>
        { (!accounting) ? <em>Loading...</em> : accounting.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>When</th>
            </tr>
            </thead>
            <tbody>
            {this._buildList()}
            </tbody>
          </table>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.accounting.map((movement, index) => {
      return (
        <tr key={index}>
          <td>{summarize(movement.id)}</td>
          <td>{movement.type}</td>
          <td>{fromWei(movement.amount)}</td>
          <td>{toDate(movement.createdAt)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.guardianAccountingList) {
      const { guardianAccounting } = Store.getState().guardians
      this.setState({ accounting: guardianAccounting })
    }
  }
}
