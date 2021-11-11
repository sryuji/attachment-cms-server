import { MailDataRequired, ClientResponse } from '@sendgrid/mail'

export async function sendMail(message: MailDataRequired): Promise<[ClientResponse, unknown]> {
  return Promise.resolve([{ statusCode: 200, body: {}, headers: {} }, {}])
}
