import { ServerClient, Message, TemplatedMessage } from 'postmark'

const { env: {
  CLIENT_URL,
  EMAIL_FROM_DEFAULT,
  POSTMARK_SERVER_API_TOKEN,
  POSTMARK_TEMPLATE_ALIAS_VERIFY,
}} = process
const postmarkClient = new ServerClient(POSTMARK_SERVER_API_TOKEN!)

type MagicLinkPayload = { email: string, address: string, token: string }
type ToMaybeArray = { To?: string | string[] }
type EmailMessage = Message & ToMaybeArray
type EmailTemplatedMessage = Partial<TemplatedMessage> & ToMaybeArray
type SanitizedMessage<M extends EmailMessage | EmailTemplatedMessage> = M extends EmailMessage ? Message : TemplatedMessage

class EmailClient {
  async sendMagicLink({ email, address, token }: MagicLinkPayload): Promise<void> {
    const verifyEmailUrl = `${CLIENT_URL}?preferences=notifications&address=${address}&token=${token}`
    const message = {
      To: email,
      TemplateAlias: POSTMARK_TEMPLATE_ALIAS_VERIFY,
      TemplateModel: { verifyEmailUrl },
    }
    await this.sendEmailWithTemplate(message)
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    const sanitizedMessage = this._sanitizeMessage(message)
    await postmarkClient.sendEmail(sanitizedMessage)
  }

  async sendEmailWithTemplate(message: EmailTemplatedMessage): Promise<void> {
    const sanitizedMessage = this._sanitizeMessage(message)
    // simply check postmark endpoint when testing.
    // there is no way to run template test as of 2020-05-04:
    // https://github.com/wildbit/postmark.js/issues/56
    if (POSTMARK_SERVER_API_TOKEN == 'POSTMARK_API_TEST') {
      delete sanitizedMessage.TemplateAlias
      delete sanitizedMessage.TemplateModel
      const nonTemplateMessage = message as Message
      nonTemplateMessage.TextBody = 'test'
      return await this.sendEmail(nonTemplateMessage)
    }
    await postmarkClient.sendEmailWithTemplate(sanitizedMessage)
  }

  private _sanitizeMessage<M extends EmailMessage | EmailTemplatedMessage>(message: M): SanitizedMessage<M> {
    message.From = this._sanitizeFrom(message?.From)
    if (message.To) message.To = this._sanitizeTo(message.To)
    return message as any as SanitizedMessage<M>
  }

  private _sanitizeFrom(From: string | undefined): string {
    return From || EMAIL_FROM_DEFAULT!
  }

  private _sanitizeTo(To: string | string[]): string {
    return Array.isArray(To) ? To.join(', ') : To
  }
}

export default new EmailClient()
