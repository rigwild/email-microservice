import { TransportOptions } from 'nodemailer'
import { Address } from 'nodemailer/lib/mailer'

/** Credentials to use when sending an email */
interface SmtpCredentials extends TransportOptions {
  /** SMTP Hostname or IP */
  host: string
  /** SMTP Port */
  port: number
  /** Is the SMTP using TLS */
  secure: boolean

  /** SMTP credentials */
  auth: {
    /** SMTP username */
    user: string
    /** SMTP password */
    pass: string
  }
}

interface SendEmailObj {
  from: string | Address
  to: string | Address
  subject: string
  content: string
}

export { SmtpCredentials, SendEmailObj }
