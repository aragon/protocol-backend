import React from 'react'
import Store from '../../store/store'
import EmailActions from '../../actions/emails'

export default class EmailsForm extends React.Component {
  constructor(props) {
    super(props)
    this.fields = [
      {
        id: 'title',
        label: 'Title',
        required: true,
        default: 'New on Aragon Protocol',
      },
      {
        id: 'bannerHtml',
        label: 'Banner HTML (optional)',
        required: false,
        default: '',
        type: 'textarea',
      },
      {
        id: 'contentHtml',
        label: 'HTML Content',
        required: true,
        default: '<p>New feature description</p>',
        type: 'textarea',
      },
      {
        id: 'content',
        label: 'Text Content (for clients without HTML support)',
        required: true,
        default: 'New feature description',
        type: 'textarea',
      },
      {
        id: 'actionLabel',
        label: 'Action Button Label',
        required: true,
        default: 'Go to URL',
      },
      {
        id: 'actionUrl',
        label: 'Action Button URL',
        required: true,
        default: 'https://protocol.aragon.org/',
      },
      {
        id: 'testEmail',
        label: 'Test Email (required before notifying all guardians)',
        required: true,
        default: '',
      }
    ]
    this.state = {
      enabled: false,
      emailLogs: [],
    }
    this.fields.forEach(field => {
      this.state[field.id] = field.default
    })
  }

  render() {
    return (
      <div>
        <form id="emailsForm" onSubmit={this._sendEmail}>
          <h3>Send custom email</h3>
          {this.getFields()}
          <button onClick={this.sendTestEmail} id="submitTest">Send test email</button>
          <button onClick={this.sendGuardianEmails} id="submit" disabled={!this.state.enabled}>Notify all guardians</button>
          <div id="emailLogs">{this.getLogs()}</div>
        </form>
      </div>
    )
  }

  getFields() {
    return this.fields.map(field => {
      return (
      <div key={field.id}>
        <label htmlFor={field.id}>{field.label}</label>
        {this.getFieldInput(field)}
      </div>
      )
    })
  }

  getFieldInput(field) {
    if (field.type === 'textarea') {
      return <textarea ref={field.id} id={field.id} value={this.state[field.id]} onChange={this.updateField} required={field.required} />
    } else {
      return <input ref={field.id} id={field.id} type="text" value={this.state[field.id]} onChange={this.updateField} required={field.required} />
    }
  }

  getLogs() {
    return this.state.emailLogs.map((log, index) => {
      return <div key={index}>{log}</div>
    })
  }

  updateField = e => {
    e.preventDefault()
    this.setState({ 
      [e.target.id]: e.target.value,
    })
    Store.dispatch(EmailActions.emailFormEnabled(false))
  }

  componentDidMount() {
    this.unsubscribe = Store.subscribe(() => this.onStateChange())
    this.onStateChange()
  }

  onStateChange() {
    const { admin: { email }, emails: { emailLogs, enabled } } = Store.getState()
    if (!this.state.testEmail && email) this.setState({ testEmail: email })
    this.setState({ emailLogs, enabled })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  sendTestEmail = e => {
    e.preventDefault()
    let params = {
      testEmail: this.state.testEmail,
      TemplateModel: {},
    }
    this.sendEmails(params)
  }

  sendGuardianEmails = e => {
    e.preventDefault()
    if (!this.state.enabled) return
    let params = {
      notifyAllGuardians: true,
      TemplateModel: {},
    }
    this.sendEmails(params)
  }

  sendEmails = params => {
    for (const field of this.fields) {
      if (!this.refs[field.id].checkValidity()) {
        alert(`${field.label} cannot be empty!`)
        return
      }
      params.TemplateModel[field.id] = this.state[field.id]
    }
    Store.dispatch(EmailActions.emailFormEnabled(false))
    Store.dispatch(EmailActions.resetEmailLogs())
    Store.dispatch(EmailActions.sendEmails(params))
  }
}
