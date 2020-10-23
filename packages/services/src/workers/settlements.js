import queries from '../helpers/settlement-queries'
import Network from '@aragon/protocol-backend-server/build/web3/Network'

export default async function (ctx) {
  const { logger } = ctx
  const protocol = await Network.getCourt()

  for (const disputesQuery of queries) {
    await settleDisputes(logger, protocol, disputesQuery)
  }
}

async function settleDisputes(logger, protocol, disputesQuery) {
  const { disputes } = await Network.query(disputesQuery.query)
  logger.info(`${disputes.length} ${disputesQuery.title} pending`)

  for (const dispute of disputes) {
    await settle(logger, protocol, dispute.id, disputesQuery)
  }
}

async function settle(logger, protocol, disputeId, { ongoingDispute }) {
  try {
    if (ongoingDispute) {
      const canSettle = await protocol.canSettle(disputeId)
      if (!canSettle) return logger.warn(`Ignoring dispute #${disputeId}, it cannot be settled now`)

      logger.info(`Executing ruling for dispute #${disputeId}`)
      await protocol.execute(disputeId)
      logger.success(`Executed ruling for dispute #${disputeId}`)
    }

    logger.info(`Settling dispute #${disputeId}`)
    await protocol.settle(disputeId)
    logger.success(`Settled dispute #${disputeId}`)
  } catch (error) {
    logger.error(`Failed to settle dispute #${disputeId}`, error)
  }
}
