const logger = require('@aragon/court-backend-shared/helpers/logger')('Error Handler')

module.exports = error => {
  logger.error(`Process finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
