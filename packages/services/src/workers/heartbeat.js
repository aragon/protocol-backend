import sleep from '@aragon/court-backend-shared/helpers/sleep'
import Network from '@aragon/court-backend-server/build/web3/Network'

const HEARTBEAT_TRIES_PER_JOB = 3
const SECONDS_BETWEEN_INTENTS = 3
const MAX_TRANSITIONS_PER_CALL = 20

export default async function (ctx) {
  const { logger } = ctx
  const court = await Network.getCourt()
  await heartbeat(logger, court)
}

async function heartbeat(logger, court, attempt = 1) {
  try {
    logger.info(`Transitioning up-to ${MAX_TRANSITIONS_PER_CALL} terms, try #${attempt}`)
    const transitions = await court.heartbeat(MAX_TRANSITIONS_PER_CALL)
    logger.success(`Transitioned ${transitions} Court terms`)
  } catch (error) {
    logger.error('Failed to transition terms with error', error)
    if (attempt >= HEARTBEAT_TRIES_PER_JOB) return
    await sleep(SECONDS_BETWEEN_INTENTS)
    await heartbeat(logger, court, attempt + 1)
  }
}
