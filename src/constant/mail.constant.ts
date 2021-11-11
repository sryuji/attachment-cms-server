export const NO_REPLY_FROM = 'no-reply@attachment-cms.dev'

export const INVITATION_MAIL_SUBJECT = `attachment CMSのプロジェクトへのご招待`
export const INVITATION_MAIL_TEXT = (email: string, token: string) => `
${email} 様

attachment CMSのプロジェクトへの招待されました。

下記リンクからログインして、プロジェクトへの参加をお願いします。
https://attachment-cms.dev/auth/invitation?token=${token}

`
