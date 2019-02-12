'use strict'

require('dotenv-safe').config()

const micro = require('micro')
const { json, createError, sendError } = require('micro')

const email_to = process.env.email_to
const subject = process.env.email_subject
const this_microservice_port = process.env.this_microservice_port
const allowed_origin = process.env.allowed_origin

const mailgun_api_key = process.env.mailgun_api_key
const mailgun_domain = process.env.mailgun_domain

const mailgun = require('mailgun-js')({ apiKey: mailgun_api_key, domain: mailgun_domain })

/**
 * Format user email
 * @param userEmail an email user
 * @return {string} Formated string
 */
const formatUserEmail = userEmail =>
  typeof userEmail === 'string' ? userEmail : `"${userEmail.name}" <${userEmail.address}>`

const server = micro(async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', allowed_origin)
    res.setHeader('Content-Type', 'application/json')

    // Check POST method
    if (req.method !== 'POST') throw createError(400, 'Invalid HTTP request method.')

    // Get JSON body
    const body = await json(req).catch(() => {
      throw createError(400, 'Invalid JSON was sent.')
    })

    // Get body parameters and check if set
    const { name, email, message } = body
    if (![name, email, message].every(x => x)) throw createError(400, 'Missing body parameters.')

    const result = await mailgun
      .messages()
      .send({
        from: formatUserEmail({
          name,
          address: email
        }),
        to: email_to,
        subject,
        text: message
      })
      .catch(err => {
        throw createError(500, 'Could not send email.', err)
      })

    console.log(JSON.stringify(result))

    res.end(JSON.stringify(result))
  } catch (err) {
    console.error(err)
    sendError(req, res, err)
  }
})

server.listen(this_microservice_port)
console.log(`Server listening on http://localhost:${this_microservice_port}`)
