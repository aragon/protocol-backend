# Aragon Protocol backoffice app

This is a React app that aims to serve a UI to read data from an Aragon Protocol instance.

### Instances

You can find the following deployed instances

1. [Mainnet](https://protocol-app.backend.aragon.org/)
1. [Rinkeby](https://protocol-app-rinkeby.backend.aragon.org/)
1. [Staging](https://protocol-app-staging.backend.aragon.org/)
1. [Ropsten](https://protocol-app-ropsten.backend.aragon.org/)

### Setup

To work locally, simply go to the root directory, and make sure you have set up a propoer `.env` file following the `.env.sample` file.
Once you have done that, spin up a docker container with:
```bash
docker-compose build
docker-compose up -d
```

### Keys

This repo web3 configuration relies on a browser provider like Metamask. However, it doesn't require a browser connection to read data since it is mostly consumes Aragon Protocol's subgraph.
