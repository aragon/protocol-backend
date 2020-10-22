const path = require('path')
const logger = require('@aragon/protocol-backend-shared/helpers/logger')('config')
const { bn } = require('@aragon/protocol-backend-shared/helpers/numbers')

const command = 'config'
const describe = 'Get current protocol config or set a new one'

const builder = {
  term: { alias: 't', describe: 'First term id the config will be effective at', type: 'string' },
  params: { alias: 'p', describe: 'Config file, in the same format as in aragon-network-deploy repo', type: 'string' },
}

const handlerAsync = async (environment, { params: configFilename, term: fromTermId }) => {
  const config = require(path.resolve(process.cwd(), configFilename))

  const protocol = await environment.getCourt()

  if (!fromTermId) {
    fromTermId = await protocol.currentTermId()
  }

  const receipt = await protocol.instance.setConfig(
    fromTermId.add(bn(1)).toString(),                            // fromTermId Identification number of the term in which the config will be effective at
    config.protocol.feeToken.address,                            // feeToken Address of the token contract that is used to pay for fees
    [
      config.protocol.guardianFee.toString(),                    // guardianFee Amount of fee tokens that is paid per guardian per dispute
      config.protocol.draftFee.toString(),                       // draftFee Amount of fee tokens per guardian to cover the drafting cost
      config.protocol.settleFee.toString()                       // settleFee Amount of fee tokens per guardian to cover round settlement cost
    ],
    [
      config.protocol.evidenceTerms.toString(),                  // evidenceTerms Max submitting evidence period duration in terms
      config.protocol.commitTerms.toString(),                    // commitTerms Commit period duration in terms
      config.protocol.revealTerms.toString(),                    // revealTerms Reveal period duration in terms
      config.protocol.appealTerms.toString(),                    // appealTerms Appeal period duration in terms
      config.protocol.appealConfirmTerms.toString()              // appealConfirmationTerms Appeal confirmation period duration in terms
    ],
    [
      config.protocol.penaltyPct.toString(),                     // penaltyPct Permyriad of min active tokens balance to be locked for each drafted guardian (‱ - 1/10,000)
      config.protocol.finalRoundReduction.toString()             // finalRoundReduction Permyriad of fee reduction for the last appeal round (‱ - 1/10,000)
    ],
    [
      config.protocol.firstRoundGuardiansNumber.toString(),      // firstRoundGuardiansNumber Number of guardians to be drafted for the first round of disputes
      config.protocol.appealStepFactor.toString(),               // appealStepFactor Increasing factor for the number of guardians of each round of a dispute
      config.protocol.maxRegularAppealRounds.toString(),         // maxRegularAppealRounds Number of regular appeal rounds before the final round is triggered
      config.protocol.finalRoundLockTerms.toString()             // finalRoundLockTerms Number of terms that a coherent guardian in a final round is disallowed to withdraw (to prevent 51% attacks)
    ],
    [
      config.protocol.appealCollateralFactor.toString(),         // appealCollateralFactor Multiple of dispute fees required to appeal a preliminary ruling
      config.protocol.appealConfirmCollateralFactor.toString()   // appealConfirmCollateralFactor Multiple of dispute fees required to confirm appeal
    ],
    config.guardians.minActiveBalance.toString()                 // minActiveBalance Minimum amount of guardian tokens that can be activated
  )

  logger.success(`Changed config in tx ${receipt.hash}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
