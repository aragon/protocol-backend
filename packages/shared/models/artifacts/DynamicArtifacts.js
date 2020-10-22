const fs = require('fs')
const path = require('path')
const BaseArtifacts = require('./BaseArtifacts')

const BUILD_DIRS = ['build/contracts', 'artifacts']

class DynamicArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    const contractPaths = dependency
      ? this._getNodeModulesPath(dependency, contractName)
      : this._getLocalBuildPath(contractName)

    const artifact = this._findArtifact(contractPaths)
    if (!artifact) throw Error(`Could not find artifact for ${dependency} ${contractName}`)
    return artifact
  }

  _findArtifact(paths) {
    const path = paths.find(fs.existsSync)
    return path ? require(path) : undefined
  }

  _getLocalBuildPath(contractName) {
    return BUILD_DIRS.map(dir => path.resolve(process.cwd(), `./${dir}/${contractName}.json`))
  }

  _getNodeModulesPath(dependency, contractName) {
    return BUILD_DIRS.map(dir => path.resolve(__dirname, `../../node_modules/${dependency}/${dir}/${contractName}.json`))
  }
}

module.exports = DynamicArtifacts
