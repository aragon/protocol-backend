import { LocalEnvironment, Protocol } from '../models/environments/LocalEnvironment'

const Network = {
  get environment() {
    return new LocalEnvironment()
  },

  async getProtocol(): Promise<Protocol> {
    return this.environment.getProtocol()
  },

  async query(query: string): Promise<any> {
    return this.environment.query(query)
  },
}

export default Network
