const logger = require('@aragon/protocol-backend-shared/helpers/logger')('Error Handler')

export default error => {
  logger.error(`Process finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
