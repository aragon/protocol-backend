# Aragon Court backend

This mono-repo includes a set of sub-repos that are in charge of different parts of the whole Aragon Court backend:
- [`app`](./packages/app): This repo provides a React app as the frontend app of the Aragon Court backend
- [`cli`](./packages/cli): This repo provides a CLI tool with a set of commands to interact with an Aragon Court instance.
- [`server`](./packages/server): This repo provides the backend server in charge of setting up a database and exposing a set of endpoints that will complement the functionality exposed by the smart contracts.
- [`services`](./packages/services): This repo provides a set of background workers in charge of maintaining those things that could be done automatically for Aragon Court.
- [`shared`](./packages/shared): This repo provides a set of components shared among all the sub-repos of this mono-repo.

To understand better about these repos, you will find detailed information about them on their own READMEs.
However, you can follow the following guide to understand you to set up everything locally:

## Local set up

Development environment is configured using [docker-compose](https://docs.docker.com/compose/).

First make sure to create your own `.env`:
```bash
cp .env.sample .env
```

Docker setup includes a Grafana dashboard for logs and metrics, which requires a Docker plugin:
```bash
docker plugin install  grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```

Finally, spin up docker containers with:
```bash
docker-compose up --build -d
```

- Rest API is available at http://localhost:3000
- Grafana dashboard is available at http://localhost:5000

Local tests can then be run using:
```bash
docker-compose exec test yarn workspace @aragon/court-backend-server build
docker-compose exec test yarn test:server
docker-compose exec test yarn test:services
```

When finished remove the containers with:
```bash
docker-compose down
```

## Grafana dashboard updates

To update the dashboard, click `Ctrl+S` > `Copy JSON to clipboard` and overwrite the file in `monitoring/grafana/provisioning/dashboards/court-backend.json`.


## CI/CD

For CI/CD we are using [GitHub Actions](https://github.com/features/actions).

### 1. Testnet CI/CD

- For automated tests -> on every non-master commit
- For deploying to staging server -> on every commit in the `development` branch

### 2. Mainnet CI/CD

For automated tests and deploying to production when creating `v*` tags in the `master` branch.

Deployments can be triggered using lerna:
```bash
yarn lerna version [ major | minor | patch ]
```

### 3. Dashboard CI/CD

For pushing the Grafana dashboard on any change in `development`/`master` branch.

### 4. Emails / Emails staging

For synchronizing [./emails](./emails) with Postmark
