import Network from '@aragon/protocol-backend-server/build/web3/Network'
import { bn } from '@aragon/protocol-backend-shared/helpers/numbers'

async function draftTermIdFor(state) {
  const protocol = await Network.getProtocol()
  const currentTerm = await protocol.currentTermId()
  const { roundDurations: { commitTerms, revealTerms } } = await protocol.getConfigAt()
  if (state == 'revealing') {
    return currentTerm.sub(commitTerms)
  }
  if (state == 'appealing') {
    return currentTerm.sub(commitTerms).sub(revealTerms) 
  }
  if (state == 'commit-reminder') {
    return currentTerm.sub(commitTerms.add(bn(1)).div(bn(2)))
  }
  if (state == 'reveal-reminder') {
    return currentTerm.sub(commitTerms).sub(revealTerms.add(bn(1)).div(bn(2)))
  }
}

async function dueDateFor(draftTermId, type) {
  const protocol = await Network.getProtocol()
  const { roundDurations: { commitTerms, revealTerms } } = await protocol.getConfigAt()
  draftTermId = bn(parseInt(draftTermId))
  let terms
  if (type == 'commit') {
    terms = commitTerms.add(draftTermId).sub(bn(1))
  }
  else if (type == 'reveal') {
    terms = commitTerms.add(revealTerms).add(draftTermId).sub(bn(1))
  }
  const startTime = await protocol.startTime()
  const termDuration = await protocol.termDuration()
  const dueDateSeconds = termDuration.mul(terms).add(startTime)
  return dueDateSeconds
}

export { draftTermIdFor, dueDateFor }
