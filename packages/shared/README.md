# Aragon Protocol Backend shared

This repo provides a set of JavaScript components shared by all of the repos contained in this mono-repo.

### Models

It provides a set of JS classes to encapsulate certain web3 behavior shared among all the repos:

#### Artifacts

This JS class is in charge of providing JS wrappers for smart contracts (a.k.a. contract artifacts). 
It provides two flavors of artifacts, one [`dynamic`](./src/models/artifacts/DynamicArtifacts.ts) and another one [`static`](./models/artifacts/StaticArtifacts.ts), following the same interface. 
The difference is that the dynamic one will load the contract schemas lazily, while the static one will load all of them before hand.     

#### Protocol

This JS class is intended to be a JS wrapper exposing all the functionality required to interact with an Aragon Protocol instance. It basically encapsulates all the complexity behind its different smart contracts, exposing a single interface.
This class is used by all the projects of the Aragon Protocol backoffice to interact with a protocol instance.  

#### Environments

This JS class is in charge of providing all the web3 commonly used components in a web3 application like: a web3 instance, a web3 provider, an artifacts object, the default sender, and some other particular entities like a protocol instance, a protocol subgraph, among others.
It also provides two different flavors of environments, one for [`browser`](./src/models/environments/BrowserEnvironment.ts) and another one based on [`Truffle configs`](./src/models/environments/TruffleEnvironment.ts). 
The first one is only used by the back-office frontend app where all the components mentioned above are built based on a browser web3 provider like `Metamask`, while the second one is used by all the other back-office projects (`cli`, `server`, and `services`) where all these components are derived from a Truffle config file. 

### Helpers

It provides the following helper functions:
- [`email-client`](./src/helpers/email-client.ts): Handles sending emails through Postmark
- [`jwt-manager`](./src/helpers/jwt-manager.ts): For creating and validating JWTs in email verification
- [`gas-price-oracle`](./src/helpers/gas-price-oracle.ts): Get gas price oracle object used to know the current gas prices being paid on each network
- [`get-wallet-from-pk`](./src/helpers/get-wallet-from-pk.ts): Decode Ethereum address based on a private key
- [`logger`](./src/helpers/logger.ts): Logger object that provides a friendly interface for fancy logging 
- [`numbers`](./src/helpers/numbers.ts): BigNumber-related helper functions
- [`sleep`](./src/helpers/sleep.ts): Sleep function to wait a number of seconds 
- [`times`](./src/helpers/times.ts): Time constants for using with `Date()`
- [`voting`](./src/helpers/voting.ts): Utils related to the CR Voting module of Aragon Protocol


## TypeScript compilation

Shared modules need to be compiled first before importing in other packages:
```
yarn build

# from another package:
yarn build:shared
```

Shared Typescript packages need to be imported from the `build` directory, e.g.:
```js
import sleep from '@aragon/protocol-backend-shared/build/helpers/sleep'
```
