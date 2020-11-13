import fs from 'fs'
import path from 'path'
import BaseArtifacts from './BaseArtifacts'

const BUILD_DIRS: string[] = ['build/contracts', 'artifacts']

export default class DynamicArtifacts extends BaseArtifacts {
  getContractSchema(contractName: string, dependency?: string): any {
    const contractPaths = dependency
      ? this._getNodeModulesPaths(dependency, contractName)
      : this._getLocalBuildPaths(contractName)

    const artifact = this._findArtifact(contractPaths)
    if (!artifact) throw Error(`Could not find artifact for ${dependency} ${contractName}`)
    return artifact
  }

  private _findArtifact(paths: string[]): any {
    const path = paths.find(fs.existsSync)
    return path ? require(path) : undefined
  }

  private _getLocalBuildPaths(contractName: string): string[] {
    return BUILD_DIRS.map(dir => path.resolve(process.cwd(), `./${dir}/${contractName}.json`))
  }

  private _getNodeModulesPaths(dependency: string, contractName: string): string[] {
    return BUILD_DIRS.map(dir => path.resolve(__dirname, `../../../node_modules/${dependency}/${dir}/${contractName}.json`))
  }
}
