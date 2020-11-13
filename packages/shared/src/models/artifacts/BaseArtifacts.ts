import { ethers, Signer, Contract } from 'ethers'

// avoid warning log level
ethers.errors.setLogLevel('error')

interface ArtifactBuilder {
  abi: () => any
  new: (...args: any[]) => Promise<Contract>
  at: (address: string) => Promise<Contract>
}

export default abstract class BaseArtifacts {

  signer: Signer

  constructor(signer: Signer) {
    this.signer = signer
  }

  abstract getContractSchema(contractName: string, dependency?: string): any

  require(contractName: string, dependency?: string): ArtifactBuilder {
    const schema = this.getContractSchema(contractName, dependency)
    if (!schema) throw Error(`Please make sure you provide a contract schema for ${dependency}/${contractName}`)
    return this.buildArtifact(schema)
  }

  buildArtifact(schema: any): ArtifactBuilder {
    const { signer } = this
    return {
      get abi() {
        return schema.abi
      },

      async new(...args: any[]) {
        const factory = new ethers.ContractFactory(schema.abi, schema.bytecode, signer)
        return factory.deploy(...args)
      },

      async at(address: string) {
        return new ethers.Contract(address, schema.abi, signer)
      }
    }
  }
}

export { ArtifactBuilder, BaseArtifacts }
