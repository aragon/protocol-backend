import React from 'react'
import Court from '../court/Court.react'
import AccountBalances from '../account/AccountBalances.react'

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Court/>
        <AccountBalances/>
      </div>
    )
  }
}
