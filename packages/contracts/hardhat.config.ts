import { HardhatUserConfig, task, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-chai-matchers";

require("dotenv").config();
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const ETHERSCAN_KEY = vars.get("ETHERSCAN_KEY");
const CELO_ETHERSCAN_KEY = vars.get("CELO_ETHERSCAN_KEY");
const ALCHEMY_KEY = vars.get("ALCHEMY_KEY");

import { privateKeyToAccount } from "viem/accounts";

console.log(privateKeyToAccount(PRIVATE_KEY));

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    "base-mainnet": {
      url: "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      "base-sepolia": "XH846ZRX4PYC3YBP8G3CJASH4NNDC1MTHS",
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  sourcify: { enabled: true },
};

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    const [sender] = await ethers.getSigners();
    try {
      await sender.sendTransaction({
        to: receiver,
        value: BigInt(10 ** 18),
      });
    } catch (error) {
      console.log(error);
    }

    console.log("Sent ETH");
  });
export default config;
