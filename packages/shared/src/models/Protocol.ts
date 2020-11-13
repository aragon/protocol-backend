import { sha3, fromWei, utf8ToHex, soliditySha3 } from 'web3-utils'
import { Contract } from 'ethers'
import { ZERO_ADDRESS, getEventArgument, getEvents } from '@aragon/contract-helpers-test'

import Logger from '../helpers/logger'
const logger = Logger('Protocol')
import { bn, bigExp, BigNumberish } from '../helpers/numbers'
import { encodeVoteId, hashVote } from '../helpers/voting'
import Environment from './environments/Environment'

const ROUND_STATE_ENDED = 5

export default class Protocol {

  instance: any // TODO: provide proper types for Protocol instance
  environment: Environment
  _token?: Contract
  _feeToken?: Contract
  _registry?: Contract
  _disputeManager?: Contract
  _voting?: Contract
  _paymentsBook?: Contract

  constructor(instance: any, environment: Environment) {
    this.instance = instance
    this.environment = environment
  }

  async token(): Promise<Contract> {
    if (!this._token) {
      const registry = await this.registry()
      const address = await registry.token()
      const ERC20 = await this.environment.getArtifact('ERC20Mock', '@aragon/protocol-evm')
      this._token = await ERC20.at(address)
    }
    return this._token!
  }

  async feeToken(): Promise<Contract> {
    if (!this._feeToken) {
      const { feeToken } = await this.getConfigAt()
      const ERC20 = await this.environment.getArtifact('ERC20Mock', '@aragon/protocol-evm')
      this._feeToken = await ERC20.at(feeToken)
    }
    return this._feeToken!
  }

  async registry(): Promise<Contract> {
    if (!this._registry) {
      const { addr: address } = await this.instance.getGuardiansRegistry()
      const GuardiansRegistry = await this.environment.getArtifact('GuardiansRegistry', '@aragon/protocol-evm')
      this._registry = await GuardiansRegistry.at(address)
    }
    return this._registry
  }

  async disputeManager(): Promise<Contract> {
    if (!this._disputeManager) {
      const { addr: address } = await this.instance.getDisputeManager()
      const DisputeManager = await this.environment.getArtifact('DisputeManager', '@aragon/protocol-evm')
      this._disputeManager = await DisputeManager.at(address)
    }
    return this._disputeManager
  }

  async voting(): Promise<Contract> {
    if (!this._voting) {
      const { addr: address } = await this.instance.getVoting()
      const Voting = await this.environment.getArtifact('CRVoting', '@aragon/protocol-evm')
      this._voting = await Voting.at(address)
    }
    return this._voting
  }

  async paymentsBook(): Promise<Contract> {
    if (!this._paymentsBook) {
      const { addr: address } = await this.instance.getPaymentsBook()
      const PaymentsBook = await this.environment.getArtifact('PaymentsBook', '@aragon/protocol-evm')
      this._paymentsBook = await PaymentsBook.at(address)
    }
    return this._paymentsBook
  }

  async termDuration() {
    return this.instance.getTermDuration()
  }

  async startTime() {
    const { startTime } = await this.instance.getTerm(1)
    return startTime // in seconds
  }

  async currentTermId() {
    return this.instance.getCurrentTermId()
  }

  async getTerm(id: BigNumberish) {
    return this.instance.getTerm(id)
  }

  async neededTransitions() {
    return this.instance.getNeededTermTransitions()
  }

  async getConfigAt(termId = undefined) {
    if (!termId) termId = await this.currentTermId()
    const rawConfig = await this.instance.getConfig(termId)
    const { feeToken, fees, roundStateDurations: rounds, pcts, roundParams, appealCollateralParams, minActiveBalance } = rawConfig

    return {
      feeToken,
      fees: { guardianFee: fees[0], draftFee: fees[1], settleFee: fees[2] },
      roundParams: { firstRoundGuardiansNumber: roundParams[0], appealStepFactor: roundParams[1], maxRegularAppealRounds: roundParams[2] },
      roundDurations: { evidenceTerms: rounds[0], commitTerms: rounds[1], revealTerms: rounds[2], appealTerms: rounds[3], appealConfirmationTerms: rounds[4] },
      appealCollateralParams: { appealCollateralFactor: appealCollateralParams[0], appealConfirmCollateralFactor: appealCollateralParams[1] },
      pcts: { penaltyPct: pcts[0], finalRoundReduction: pcts[1] },
      minActiveBalance
    }
  }

  async getRevealStatus(disputeId: BigNumberish, roundNumber: number) {
    const disputeManager = await this.disputeManager()
    const { createTermId } = await disputeManager.getDispute(disputeId)
    const { draftTerm, delayedTerms } = await disputeManager.getRound(disputeId, roundNumber)
    const { roundDurations: { commitTerms, revealTerms } } = await this.getConfigAt(createTermId)

    const currentTerm = await this.currentTermId()
    const draftFinishedTerm = draftTerm.add(delayedTerms)
    const revealStartTerm = draftFinishedTerm.add(commitTerms)
    const appealStartTerm = revealStartTerm.add(revealTerms)

    const expired = currentTerm.gte(appealStartTerm)
    const canReveal = currentTerm.gte(revealStartTerm) && !expired

    return { canReveal, expired }
  }

  async canSettle(disputeId: BigNumberish) {
    const disputeManager = await this.disputeManager()

    const { finalRuling, lastRoundId } = await disputeManager.getDispute(disputeId)
    if (finalRuling !== 0) return true

    const { state } = await disputeManager.getRound(disputeId, lastRoundId)
    return state === ROUND_STATE_ENDED
  }

  async getGuardians(disputeId: BigNumberish, roundNumber: number) {
    const result = await this.environment.query(`{ 
      dispute (id: "${disputeId}") {
        id
        rounds (where: { number: "${roundNumber}" }) { guardians { guardian { id } }}
      }}`)
    return result.dispute.rounds[0].guardians.map((guardian: any) => guardian.guardian.id)
  }

  async existsVote(voteId: BigNumberish) {
    const voting = await this.voting()
    const maxAllowedOutcomes = await voting.getMaxAllowedOutcome(voteId)
    return maxAllowedOutcomes !== 0
  }

  async isValidOutcome(voteId: BigNumberish, outcome: string) {
    const voting = await this.voting()
    const exists = await this.existsVote(voteId)
    return exists && (await voting.isValidOutcome(voteId, outcome))
  }

  async getLastRoundVoteId(disputeId: BigNumberish) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)
    return encodeVoteId(disputeId, lastRoundId)
  }

  async getCommitment(voteId: BigNumberish, voter: string) {
    const result = await this.environment.query(`{ guardianDrafts (where: { round:"${voteId}", guardian: "${voter}" }) { commitment }}`)
    return (!result || !result.guardianDrafts || result.guardianDrafts.length === 0) ? undefined : result.guardianDrafts[0].commitment
  }

  async getOutcome(voteId: BigNumberish, voter: string) {
    const voting = await this.voting()
    return voting.getVoterOutcome(voteId, voter)
  }

  async getPeriodBalanceDetails(periodId: BigNumberish) {
    const paymentsBook = await this.paymentsBook()
    const { balanceCheckpoint, totalActiveBalance } = await paymentsBook.getPeriodBalanceDetails(periodId)
    return { balanceCheckpoint, totalActiveBalance }
  }

  async heartbeat(transitions?: any) {
    const needed = await this.neededTransitions()
    logger.info(`Required ${needed} transitions`)
    if (needed.eq(bn(0))) return needed
    const heartbeats = transitions || needed
    logger.info(`Calling heartbeat with ${heartbeats} max transitions...`)
    await this.instance.heartbeat(heartbeats)
    return Math.min(heartbeats, needed)
  }

  async stake(guardian: string, amount: BigNumberish, data = '0x') {
    const token = await this.token()
    const decimals = await token.decimals()
    const registry = await this.registry()
    const symbol = await token.symbol()
    await this._approve(token, bigExp(amount, decimals), registry.address)
    logger.info(`Staking ${amount} ${symbol} for ${guardian}...`)
    return registry.stakeFor(guardian, bigExp(amount, decimals), data)
  }

  async unstake(amount: BigNumberish, data = '0x') {
    const token = await this.token()
    const decimals = await token.decimals()
    const registry = await this.registry()
    const symbol = await token.symbol()
    logger.info(`Unstaking ${amount} ${symbol} for ${await this.environment.getSender()}...`)
    return registry.unstake(bigExp(amount, decimals), data)
  }

  async activate(amount: BigNumberish) {
    const token = await this.token()
    const decimals = await token.decimals()
    const registry = await this.registry()
    const symbol = await token.symbol()
    logger.info(`Activating ${amount} ${symbol} for ${await this.environment.getSender()}...`)
    return registry.activate(bigExp(amount, decimals))
  }

  async activateFor(address: string, amount: BigNumberish) {
    const token = await this.token()
    const decimals = await token.decimals()
    const registry = await this.registry()
    const symbol = await token.symbol()
    await this._approve(token, bigExp(amount, decimals), registry.address)
    const ACTIVATE_DATA = sha3('activate(uint256)')!.slice(0, 10)
    logger.info(`Activating ${amount} ${symbol} for ${address}...`)
    return registry.stakeFor(address, bigExp(amount, decimals), ACTIVATE_DATA)
  }

  async deactivate(amount: BigNumberish) {
    const token = await this.token()
    const decimals = await token.decimals()
    const registry = await this.registry()
    logger.info(`Requesting ${amount} from ${await this.environment.getSender()} for deactivation...`)
    return registry.deactivate(bigExp(amount, decimals))
  }

  async pay(tokenAddress: string, amount: BigNumberish, payer: string, data: any) {
    const paymentsBook = await this.paymentsBook()
    const ERC20 = await this.environment.getArtifact('ERC20Mock', '@aragon/protocol-evm')
    const token = await ERC20.at(tokenAddress)
    const symbol = await token.symbol()

    logger.info(`Approving ${amount} ${symbol} for payment...`)
    await this._approve(token, amount, paymentsBook.address)
    logger.info(`Paying ${amount} ${symbol} to Aragon Protocol...`)
    return paymentsBook.pay(tokenAddress, amount, payer, data)
  }

  async deployArbitrable() {
    logger.info(`Creating new Arbitrable instance...`)
    const Arbitrable = await this.environment.getArtifact('Arbitrable', '@aragon/protocol-evm')
    return Arbitrable.new(this.instance.address)
  }

  async createDispute(subject: string, rulings = 2, metadata = '', evidence = [], submitters = [], closeEvidencePeriod = false) {
    logger.info(`Transferring tokens to Arbitrable instance ${subject}...`)
    const feeToken = await this.feeToken()
    const disputeManager = await this.disputeManager()
    const { totalFees } = await disputeManager.getDisputeFees()
    await feeToken.transfer(subject, totalFees)

    logger.info(`Creating new dispute for subject ${subject} ...`)
    const Arbitrable = await this.environment.getArtifact('Arbitrable', '@aragon/protocol-evm')
    const arbitrable = await Arbitrable.at(subject)
    const { hash } = await arbitrable.createDispute(rulings, utf8ToHex(metadata))
    const receipt = await this.environment.getTransaction(hash)
    const disputeId = getEventArgument(receipt, 'NewDispute', 'disputeId', { decodeForAbi: disputeManager.interface.abi })

    for (const data of evidence) {
      const index = evidence.indexOf(data)
      const submitter = submitters[index]
      const finished = closeEvidencePeriod && index === evidence.length - 1
      if (submitter) {
        logger.info(`Submitting evidence ${data} for dispute #${disputeId} for submitter ${submitter}...`)
        await arbitrable.submitEvidenceFor(disputeId, submitter, utf8ToHex(data), finished)
      } else {
        logger.info(`Submitting evidence ${data} for dispute #${disputeId} for sender ...`)
        await arbitrable.submitEvidence(disputeId, utf8ToHex(data), finished)
      }
    }

    return disputeId
  }

  async draft(disputeId: BigNumberish) {
    const disputeManager = await this.disputeManager()
    logger.info(`Drafting dispute #${disputeId} ...`)
    const { hash } = await disputeManager.draft(disputeId)
    const receipt = await this.environment.getTransaction(hash)
    return getEvents(receipt, 'GuardianDrafted', { decodeForAbi: disputeManager.interface.abi }).map((event: any) => event.args.guardian)
  }

  async commit(disputeId: BigNumberish, outcome: string, password: string) {
    const voteId = await this.getLastRoundVoteId(disputeId)
    logger.info(`Committing a vote for dispute #${disputeId} on vote ID ${voteId}...`)
    const voting = await this.voting()
    return voting.commit(voteId, hashVote(outcome, soliditySha3(password)!))
  }

  async reveal(disputeId: BigNumberish, guardian: string, outcome: string, password: string) {
    const voteId = await this.getLastRoundVoteId(disputeId)
    return this.revealFor(voteId, guardian, outcome, soliditySha3(password)!)
  }

  async revealFor(voteId: BigNumberish, guardian: string, outcome: string, salt: string) {
    logger.info(`Revealing vote for guardian ${guardian} on vote ID ${voteId}...`)
    const voting = await this.voting()
    return voting.reveal(voteId, guardian, outcome, salt)
  }

  async appeal(disputeId: BigNumberish, outcome: string) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { appealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, appealDeposit, disputeManager.address)

    logger.info(`Appealing dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    return disputeManager.createAppeal(disputeId, lastRoundId, outcome)
  }

  async confirmAppeal(disputeId: BigNumberish, outcome: string) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { confirmAppealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, confirmAppealDeposit, disputeManager.address)

    logger.info(`Confirming appeal for dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    return disputeManager.confirmAppeal(disputeId, lastRoundId, outcome)
  }

  async settleRound(disputeId: BigNumberish) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    for (let roundId = 0; roundId <= lastRoundId; roundId++) {
      logger.info(`Settling penalties for dispute #${disputeId} and round #${roundId}...`)
      await disputeManager.settlePenalties(disputeId, roundId, 0)

      if (lastRoundId > roundId) {
        logger.info(`Settling appeal deposits for dispute #${disputeId} and round #${roundId}...`)
        await disputeManager.settleAppealDeposit(disputeId, roundId)
      }
    }
  }

  async settleGuardian(disputeId: BigNumberish, guardian: string) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    for (let roundId = 0; roundId <= lastRoundId; roundId++) {
      const { weight } = await disputeManager.getGuardian(disputeId, roundId, guardian)
      if (weight.gt(bn(0))) {
        logger.info(`Settling rewards of guardian ${guardian} for dispute #${disputeId} and round #${roundId}...`)
        await disputeManager.settleReward(disputeId, roundId, guardian)
      }
    }
  }

  async execute(disputeId: BigNumberish) {
    logger.info(`Executing ruling of dispute #${disputeId}...`)
    return this.instance.executeRuling(disputeId)
  }

  async settle(disputeId: BigNumberish) {
    const voting = await this.voting()
    const disputeManager = await this.disputeManager()
    const { finalRuling: ruling, lastRoundId } = await disputeManager.getDispute(disputeId)

    // Execute final ruling if missing
    if (ruling === 0) await this.execute(disputeId)
    const { finalRuling } = await disputeManager.getDispute(disputeId)

    // Settle rounds
    for (let roundNumber = 0; roundNumber <= lastRoundId; roundNumber++) {
      const { guardiansNumber, settledPenalties } = await disputeManager.getRound(disputeId, roundNumber)

      // settle penalties
      if (!settledPenalties) {
        logger.info(`Settling penalties for dispute #${disputeId} round #${roundNumber}`)
        await disputeManager.settlePenalties(disputeId, roundNumber, guardiansNumber)
        logger.success(`Settled penalties for dispute #${disputeId} round #${roundNumber}`)
      }

      // settle guardian rewards
      const voteId = encodeVoteId(disputeId, roundNumber)
      const guardians = await this.getGuardians(disputeId, roundNumber)
      for (const guardian of guardians) {
        const votedOutcome = await voting.getVoterOutcome(voteId, guardian)
        if (votedOutcome === finalRuling) {
          logger.info(`Settling rewards of guardian ${guardian} for dispute #${disputeId} and round #${roundNumber}...`)
          await disputeManager.settleReward(disputeId, roundNumber, guardian)
          logger.success(`Settled rewards of guardian ${guardian} for dispute #${disputeId} and round #${roundNumber}...`)
        }
      }

      // settle appeals
      const { taker } = await disputeManager.getAppeal(disputeId, roundNumber)
      if (taker != ZERO_ADDRESS) {
        try {
          logger.info(`Settling appeal deposits for dispute #${disputeId} round #${roundNumber}`)
          await disputeManager.settleAppealDeposit(disputeId, roundNumber)
          logger.success(`Settled penalties for dispute #${disputeId} round #${roundNumber}`)
        } catch (error) {
          if (!error.message.includes('DM_APPEAL_ALREADY_SETTLED')) throw error
        }
      }
    }
  }

  async _approve(token: Contract, amount: BigNumberish, recipient: string) {
    const allowance = await token.allowance(await this.environment.getSender(), recipient)
    if (allowance.gt(bn(0))) {
      logger.info(`Resetting allowance to zero for ${recipient}...`)
      await token.approve(recipient, 0)
    }
    logger.info(`Approving ${fromWei(amount.toString())} tokens to ${recipient}...`)
    await token.approve(recipient, amount)
  }
}
