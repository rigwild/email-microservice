import { SmtpCredentials } from './types'

import { config as loadEnv } from 'dotenv-safe'
loadEnv({
  path: __dirname + '/../.env',
  example: __dirname + '/../.env.example'
})

/** You SMTP credentials */
export const SMTP: SmtpCredentials = {
  host: process.env.smtp_host || '',
  port: parseInt(process.env.smtp_port || '', 10) || 587,
  secure: process.env.smtp_port === 'true',
  auth: {
    user: process.env.smtp_user || '',
    pass: process.env.smtp_pass || ''
  }
}

/** The microservice secret used to verify a request token is valid */
export const microServiceSecret: string = process.env.microServiceSecret || 'no-secret'
