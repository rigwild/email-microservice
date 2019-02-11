import { SmtpCredentials } from './types'

/** You SMTP credentials */
export const SMTP: SmtpCredentials = {
  host: '',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
}

/** The microservice secret used to verify a request token is valid */
export const microServiceSecret: string = process.env.jwt_secret || 'my_amazing_secret'
