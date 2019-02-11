'use strict'

import nodemailer from 'nodemailer'
import { SMTP, microServiceSecret } from './config'

import { IncomingMessage, ServerResponse } from 'http'
import { Address } from 'nodemailer/lib/mailer'
import { json, RequestHandler } from 'micro'
import { verify as jwtVerify } from 'jsonwebtoken'
import { SendEmailObj } from './types'

/**
 * Format user email
 * @param userEmail an email user
 * @return {string} Formated string
 */
export const formatUserEmail = (userEmail: string | Address): string =>
  typeof userEmail === 'string' ? userEmail : `"${userEmail.name}" <${userEmail.address}>`

/**
 * Send an email.
 *
 * @param {string|Address} from Email sender
 * @param {string|Address} to Email recipient
 * @param {string} subject Email subject
 * @param {string} content Email content
 * @return {Promise<object>}
 */
const sendEmail = async ({ from, to, subject, content: html }: SendEmailObj): Promise<object> => {
  try {
    return nodemailer.createTransport(SMTP).sendMail({
      from: formatUserEmail(from),
      to: formatUserEmail(to),
      subject,
      html
    })
  } catch (err) {
    throw new Error('Could not send email.')
  }
}

/**
 * Get a JSON error object to send back to the client
 * @param res Server response handler
 * @param error Error message
 * @param httpCode Error message
 */
const sendError = (res: ServerResponse, error: string | Error, httpCode?: number): void => {
  const err = JSON.stringify({ error })
  console.error(err)
  res.statusCode = httpCode || 500
  res.end(err)
}

/**
 * Micro middleware. Get JSON parameters sent in the request body
 * If missing parameters, stops the execution
 *
 * @param neededParams An array of body keys to be present
 * @returns the JSON body-parsed or stops the execution
 */
export const getParams = async (
  req: IncomingMessage,
  res: ServerResponse,
  neededParams: Array<string>
): Promise<object | void> => {
  let body = {}
  // Get JSON parameters
  try {
    body = await json(req)
  } catch (e) {
    sendError(res, `Invalid JSON was sent.`, 400)
    return
  }

  // Check every parameters are present
  if (!neededParams.every(param => body.hasOwnProperty(param))) {
    sendError(res, `Missing parameter(s). Needed Parameter(s) : [${neededParams.toString()}].`, 400)
    return
  }
  return body
}

const handler: RequestHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // Check POST method
  if (req.method !== 'POST') {
    res.statusCode = 400
    res.end()
    return
  }

  try {
    const neededParams: Array<string> = ['token', 'from', 'to', 'subject', 'content']
    const { token, from, to, content, subject }: any = await getParams(req, res, neededParams)

    // Check provided token is valid
    jwtVerify(token, microServiceSecret)

    const sent = await sendEmail({ from, to, subject, content })

    console.log('An email request was validated : ', sent)
    res.statusCode = 200
    res.end(JSON.stringify(sent))
  } catch (err) {
    return sendError(res, err, 500)
  }
}

export default handler
