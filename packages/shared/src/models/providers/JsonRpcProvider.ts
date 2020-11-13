import { ethers } from 'ethers'
const logger = require('../../helpers/logger').default('Provider')

export default class JsonRpcProvider extends ethers.providers.JsonRpcProvider {
  send(method: string, params: any): Promise<any> {
    logger.info(`Sending RPC request '${method}'`)
    return super.send(method, params)
  }
}
