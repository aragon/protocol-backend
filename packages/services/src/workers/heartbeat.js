import sleep from '@aragon/protocol-backend-shared/build/helpers/sleep'
import Network from '@aragon/protocol-backend-server/build/web3/Network'

const HEARTBEAT_TRIES_PER_JOB = 3
const SECONDS_BETWEEN_INTENTS = 3
const MAX_TRANSITIONS_PER_CALL = 20

export default async function (ctx) {
  const { logger } = ctx
  const protocol = await Network.getProtocol()
  await heartbeat(logger, protocol)
}

async function heartbeat(logger, protocol, attempt = 1) {
  try {
    logger.info(`Transitioning up-to ${MAX_TRANSITIONS_PER_CALL} terms, try #${attempt}`)
    const transitions = await protocol.heartbeat(MAX_TRANSITIONS_PER_CALL)
    logger.success(`Transitioned ${transitions} Protocol terms`)
  } catch (error) {
    logger.error('Failed to transition terms with error', error)
    if (attempt >= HEARTBEAT_TRIES_PER_JOB) return
    await sleep(SECONDS_BETWEEN_INTENTS * 1000)
    await heartbeat(logger, protocol, attempt + 1)
  }
}
