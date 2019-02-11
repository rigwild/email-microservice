import jwt from 'jsonwebtoken'
import { microServiceSecret as secret } from './config'

if (!secret)
  throw new Error(
    'You must provide a secret using the `jwt_secret` environment variable name or by settings the `microServiceSecret` var in `./config`.'
  )

const token = jwt.sign({}, secret, { expiresIn: '10y' })
console.log('Here is the generated token :\n')
console.log(token)
console.log('\nYou must send it as the `token` property in your JSON body request.')
