import { SmtpCredentials } from './types'

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
export const microServiceSecret: string = process.env.micro_service_secret || ''

if (microServiceSecret === '') throw 'The `micro_service_secret` env variable was not set.'
