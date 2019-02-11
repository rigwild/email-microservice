import jwt from 'jsonwebtoken'
import { microServiceSecret as secret } from './config'

if (!secret)
  throw new Error(
    'You must provide a secret using the `microServiceSecret` environment variable name or by settings the `microServiceSecret` var in `./env`.'
  )

const token = jwt.sign({}, secret, { expiresIn: '10y' })
console.log('To check your configuration is fine, here is the first 10 chars of your secret :\n')
console.log(secret.slice(0, 10))

console.log('Here is the generated token :\n')
console.log(token)
console.log('\nYou must send it as the `token` property in your JSON body request.')
