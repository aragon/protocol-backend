import BaseModel from './BaseModel'

export default class KeeperSuspiciousTransactions extends BaseModel {
  static get tableName() {
    return 'KeeperSuspiciousTransactions'
  }

  blockNumber?: string
  txHash?: string

  static async last(): Promise<KeeperSuspiciousTransactions> {
    const txs = await this.query().limit(1).orderBy('createdAt', 'DESC')
    return txs[0]
  }

  static async lastInspectedBlockNumber(): Promise<number> {
    const tx = await this.last()
    return tx ? Number(tx.blockNumber!) : 0
  }
}
