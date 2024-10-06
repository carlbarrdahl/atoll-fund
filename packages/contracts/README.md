# VillageFund contracts

### Getting started

Run the tests

```sh
npm run test
```

## Deployment

Configure environment variables

```sh
# Configure key to a funded wallet deploying the strategy contract
npx hardhat vars set PRIVATE_KEY 0x...

# Alchemy API key
npx hardhat vars set ALCHEMY_KEY

```

```sh
npm run deploy -- --network optimismSepolia # See hardhat config for available networks
```

Deploy token for testing

```sh
npx hardhat --network optimismSepolia run scripts/deploy-token.ts
```

## Verify

Copy the deployed contract address and pase in place of `<STRATEGY_ADDRESS>` below

```sh
npx hardhat verify --network base-sepolia 0x9b41da54ae0686a6bfdbc55fc82512b1d7d2542f --constructor-args scripts/args-registry.js

npx hardhat verify --network base-sepolia 0x16245a7afa779395e6f22e0371f5ffd41592c4cc --constructor-args scripts/args-pool.js


npx hardhat verify --network sepolia 0xa20f3a96f771fc8cc3b44e3a4ac8bcf51654ff0f --constructor-args scripts/args-registry.js

npx hardhat verify --network sepolia 0xd652d4274a155ad0e1d5a1fd7f6ee844d8ec3388 --constructor-args scripts/args-qlink.js

```
