import { Reveal } from '@aragon/protocol-backend-shared/build/models/objection'
import Network from '@aragon/protocol-backend-shared/build/web3/Network'

const REVEAL_TRIES = 3

export default async function (ctx) {
  const { logger } = ctx
  const reveals = await Reveal.query()
    .where({ revealed: false })
    .where({ expired: false })
    .where('failedAttempts', '<', REVEAL_TRIES)
    .orderBy('createdAt', 'DESC')

  logger.info(`${reveals.length} reveals pending`)
  const protocol = await Network.getProtocol()
  for (const instance of reveals) await reveal(logger, protocol, instance)
}

async function reveal(logger, protocol, reveal) {
  const { voteId, guardian, outcome, salt, failedAttempts } = reveal
  try {
    logger.info(`Revealing vote #${voteId} for guardian ${guardian}`)
    const { disputeId, roundNumber } = reveal
    const { canReveal, expired } = await protocol.getRevealStatus(disputeId, roundNumber)

    if (expired) {
      await reveal.$query().update({ expired: true })
      return logger.error(`Reveal vote #${voteId} for guardian ${guardian} has expired!`)
    } else if (!canReveal) {
      return logger.warn(`Cannot reveal round #${roundNumber} for dispute #${disputeId} yet`)
    }

    await protocol.revealFor(voteId, guardian, outcome, salt)
    const actualOutcome = await protocol.getOutcome(voteId, guardian)
    if (actualOutcome.toString() !== outcome.toString()) throw Error(`Expected outcome ${outcome}, got ${actualOutcome.toString()}`)
    await reveal.$query().update({ revealed: true })
    logger.success(`Revealed vote #${voteId} for guardian ${guardian}`)
  } catch (error) {
    await reveal.$query().update({ failedAttempts: failedAttempts + 1 })
    logger.error(`Failed to reveal vote #${voteId} for guardian ${guardian}`, error)
  }
}
