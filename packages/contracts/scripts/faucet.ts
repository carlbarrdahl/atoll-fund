import hre, { artifacts } from "hardhat";
// import { create } from "ipfs-http-client";
import { getAddress } from "viem";
async function main() {
  console.log(hre.network);
  const [sender] = await hre.ethers.getSigners();
  try {
    await sender.sendTransaction({
      to: getAddress("0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770"),
      value: BigInt(10 ^ 18),
    });
  } catch (error) {
    console.log(error);
  }

  console.log("Sent ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
