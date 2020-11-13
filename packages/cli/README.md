# Aragon Protocol CLI tool

This tool aims to provide a set of commands to interact with an Aragon Protocol instance.
Currently, there is no published version of it. However, you can use it locally.

### Commands

- [`mint`](./src/commands/mint.js): Mint tokens for a certain address
- [`heartbeat`](./src/commands/hearbeat.js): Transition Protocol terms
- [`pay`](./src/commands/payment.js): Send Aragon Protocol payment
- [`config`](./src/commands/config.js): Change Protocol config
- [`stake`](./src/commands/stake.js): Stake tokens for a guardian
- [`unstake`](./src/commands/unstake.js): Unstake tokens
- [`activate`](./src/commands/activate.js): Activate tokens into the Protocol
- [`deactivate`](./src/commands/deactivate.js): Deactivate tokens from the Protocol
- [`arbitrable`](./src/commands/arbitrable.js): Create new Arbitrable instance for the Protocol
- [`dispute`](./src/commands/dispute.js): Create dispute submitting evidence
- [`draft`](./src/commands/draft.js): Draft dispute and close evidence submission period if necessary
- [`commit`](./src/commands/commit.js): Commit vote for a dispute round
- [`reveal`](./src/commands/reveal.js): Reveal committed vote
- [`appeal`](./src/commands/appeal.js): Appeal dispute in favour of a certain outcome
- [`confirm-appeal`](./src/commands/confirm-appeal.js): Confirm an existing appeal for a dispute
- [`settle-round`](./src/commands/settle-round.js): Settle penalties and appeals for a dispute
- [`settle-guardian`](./src/commands/settle-guardian.js): Settle guardian for a dispute
- [`execute`](./src/commands/execute.js): Execute ruling for a dispute

### Setup

To use the CLI tool locally simply run the following commands to install it locally:

```bash
  git clone https://github.com/aragon/protocol-backend/
  cd protocol-backend
  yarn install
  yarn build:shared
  cd packages/cli
```

The only thing you need to setup is to make sure you configure an Aragon Protocol address in the `truffle-config.js` file of the shared package.
After that, you can start playing with all the provided commands: 

### Keys

This repo is using `@aragon/truffle-config-v5`, it is not using Truffle, but truffle config to load the network configuration following the standard way provided by Truffle.
Thus, keys are fetched from `~/.aragon/${NETWORK}_key.json` files.
