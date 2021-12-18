import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.RELEASE_GIT_COMMIT_SHA,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      new RewriteFrames({
        root: global.__dirname,
      }),
    ],
  })
}

export { Sentry, Tracing }
