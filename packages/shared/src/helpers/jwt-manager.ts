import jwt from 'jsonwebtoken'

const { env: {
  EMAIL_JWT_PRIVATE_KEY,
}} = process

function generateToken(expiresIn: string | number = '24h'): string {
  if (!EMAIL_JWT_PRIVATE_KEY) throw new Error('EMAIL_JWT_PRIVATE_KEY env variable missing.')
  const payload = { timestamp: Date.now() }
  return jwt.sign(payload, EMAIL_JWT_PRIVATE_KEY, { expiresIn })
}

function isTokenValid(token: string): boolean {
  if (!EMAIL_JWT_PRIVATE_KEY) throw new Error('EMAIL_JWT_PRIVATE_KEY env variable missing.')
  try {
    jwt.verify(token, EMAIL_JWT_PRIVATE_KEY)
    return true
  } catch {
    return false
  }
}

export { generateToken, isTokenValid }
