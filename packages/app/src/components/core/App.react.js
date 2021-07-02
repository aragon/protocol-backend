import React from 'react'
import Home from '../home/Home'
import Store from '../../store/store'
import Modal from '../common/Modal.react'
import Error from '../common/Error.react'
import Navbar from './Navbar.react'
import Login from '../admin/Login.react'
import Logout from '../admin/Logout.react'
import PrivateRoute from './PrivateRoute.react'
import AdminsList from '../admin/AdminsList.react'
import UsersList from '../admin/UsersList.react'
import RevealsList from '../admin/RevealsList.react'
import EmailsForm from '../admin/EmailsForm.react'
import PeriodsList from '../payments/PeriodsList.react'
import PeriodDetail from '../payments/PeriodDetail.react'
import GuardiansList from '../guardians/GuardiansList.react'
import GuardianDetail from '../guardians/GuardianDetail.react'
import GuardianDraftsList from '../guardians/GuardianDraftsList.react'
import GuardianStakingList from '../guardians/GuardianStakingList.react'
import GuardianAccountingList from '../guardians/GuardianAccountingList.react'
import DraftsList from '../drafts/DraftsList.react'
import DisputesList from '../disputes/DisputesList.react'
import DisputeDetail from '../disputes/DisputeDetail.react'
import AdminActions from '../../actions/admin'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: false, admin: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.getCurrentAdmin())
  }

  render() {
    const { fetching, admin } = this.state
    return (
      <div ref="app">
        <Navbar admin={admin}/>
        <div className="main-container">
          <Error/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/disputes/" exact component={DisputesList}/>
            <Route path="/dispute/:id" component={DisputeDetail}/>
            <Route path="/guardians/" exact component={GuardiansList}/>
            <Route path="/guardians/:address/detail" component={GuardianDetail}/>
            <Route path="/guardians/:address/drafts" component={GuardianDraftsList}/>
            <Route path="/guardians/:address/staking" component={GuardianStakingList}/>
            <Route path="/guardians/:address/accounting" component={GuardianAccountingList}/>
            <Route path="/drafts/" component={DraftsList}/>
            <Route path="/periods/" component={PeriodsList}/>
            <Route path="/period/:id" component={PeriodDetail}/>

            <Route path="/admin" exact render={
              props => admin.id
                ? <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
                : React.createElement(Login, props)
              }
            />

            <PrivateRoute path="/logout" exact admin component={() => <Logout admin={admin}/>}/>
            <PrivateRoute path="/admins" exact admin component={AdminsList}/>
            <PrivateRoute path="/users" exact admin component={UsersList}/>
            <PrivateRoute path="/reveals" exact admin component={RevealsList}/>
            <PrivateRoute path="/emails" exact admin component={EmailsForm}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={fetching}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const { fetching, admin } = Store.getState()
      this.setState({ fetching, admin })
    }
  }
}

export default withRouter(App)
