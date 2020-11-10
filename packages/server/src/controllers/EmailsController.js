import { User } from '@aragon/protocol-backend-shared/build/models/objection'
import emailClient from '@aragon/protocol-backend-shared/build/helpers/email-client'
import sleep from '@aragon/protocol-backend-shared/build/helpers/sleep'

export default {
  async send(req, res) {
    const { TemplateModel, testEmail, notifyAllGuardians } = req.body
    let users = []
    if (notifyAllGuardians) {
      users = await User.findWithoutDisabledNotifications()
    }
    else if (testEmail) {
      users = [{
        email: { email: testEmail },
        address: '0x0000000000000000000000000000000000000000'
      }]
    }
    await sendEmails(users, TemplateModel, res)
  }
}

async function sendEmails(users, TemplateModel, res) { 
  const emails = new Set()
  for (const user of users) {
    const { email: { email }, address } = user
    if (emails.has(email.toLowerCase())) continue
    emails.add(email.toLowerCase())
    try {
      await emailClient.sendEmailWithTemplate({
        To: email,
        From: 'notifications@protocol.aragon.org',
        TemplateAlias: 'generic',
        TemplateModel,
      })
      console.log(`sent email to ${email} for address ${address}`)
      res.write(`sent email to ${email} for address ${address}`)
    } catch (err) {
      console.log(err.message)
      res.write(err.message)
    }
  }
  console.log(`Total emails: ${emails.size}`)
  await sleep(100) // sleep to make sure Total emails is in the next chunk
  res.write(`Total emails: ${emails.size}`)
  res.end()
}
