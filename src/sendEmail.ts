'use strict'

import nodemailer from 'nodemailer'
import { SMTP, microServiceSecret } from './config'

import { IncomingMessage, ServerResponse } from 'http'
import { Address } from 'nodemailer/lib/mailer'
import { json, RequestHandler, createError, sendError } from 'micro'
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
    const res = await nodemailer.createTransport(SMTP).sendMail({
      from: formatUserEmail(from),
      to: formatUserEmail(to),
      subject,
      html
    })
    return res
  } catch (err) {
    console.error(SMTP, {
      from: formatUserEmail(from),
      to: formatUserEmail(to),
      subject,
      html
    })
    throw createError(500, 'Could not send email.', err)
  }
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
  } catch (err) {
    throw createError(400, `Invalid JSON was sent.`, err)
  }

  // Check every parameters are present
  if (!neededParams.every(param => body.hasOwnProperty(param)))
    throw createError(400, 'Missing parameters')

  return body
}

const handler: RequestHandler = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')

    // Check POST method
    if (req.method !== 'POST') throw createError(400, 'Invalid HTTP method')

    const neededParams: Array<string> = ['token', 'from', 'to', 'subject', 'content']
    const { token, from, to, subject, content }: any = await getParams(req, res, neededParams)

    // Check provided token is valid
    try {
      jwtVerify(token, microServiceSecret)
    } catch (err) {
      throw createError(401, 'Invalid JSON Web Token.', err)
    }

    const sent = await sendEmail({ from, to, subject, content })

    console.log('An email request was validated : ', sent)
    res.statusCode = 200
    res.end(JSON.stringify(sent))
  } catch (err) {
    sendError(req, res, err)
  }
}

export default handler
