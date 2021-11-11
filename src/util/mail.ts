import mail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/mail'

mail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendMail(message: MailDataRequired) {
  return await mail.send(message)
}
