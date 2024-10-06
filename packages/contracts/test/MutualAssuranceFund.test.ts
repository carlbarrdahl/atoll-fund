import hre from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import {
  type Address,
  parseUnits,
  getAddress,
  decodeEventLog,
  publicActions,
  type WalletClient,
} from "viem";

describe("EventPool", function () {
  it("deploy", async () => {
    const { eventPool } = await deploy();
    expect(eventPool.address).to.not.be.undefined;
  });

  it("should create a new event", async () => {
    const { eventPool, accounts } = await deploy();
    const organizer = accounts[0].account;
    const costPerParticipant = parseUnits("10", 18);
    const minParticipants = 2;
    const maxParticipants = 5;
    const startsAt = Math.floor(Date.now() / 1000) + 3600; // Set startsAt further in the future
    const fundingDeadline = startsAt - 1800; // Ensure fundingDeadline is before startsAt
    const endsAt = startsAt + 3600;
    const metadata = "https://metadata";

    const hash = await eventPool.write.createEvent([
      metadata,
      fundingDeadline,
      startsAt,
      endsAt,
      minParticipants,
      maxParticipants,
      costPerParticipant,
    ]);

    const eventCreatedLog = await waitForEvent({
      hash,
      eventName: "EventCreated",
      client: accounts[0],
      abi: eventPool.abi,
    });

    expect(eventCreatedLog).to.not.be.undefined;
    const eventId = eventCreatedLog?.[0]?.args?.eventId;
    const eventDetails = await eventPool.read.events([eventId]);
    expect(eventDetails[0]).to.equal(getAddress(organizer.address));
    expect(eventDetails[7]).to.equal(costPerParticipant);
    expect(eventDetails[5]).to.equal(BigInt(minParticipants));
    expect(eventDetails[6]).to.equal(BigInt(maxParticipants));
    expect(eventDetails[8]).to.equal(0n);
    expect(eventDetails[9]).to.be.false;
  });

  it("should allow a funder to deposit for multiple events", async () => {
    const {
      eventPool,
      accounts,
      token,
      costPerParticipant1,
      costPerParticipant2,
    } = await createEvents();

    const eventIds = [1, 2];
    const hash = await eventPool.write.deposit([eventIds], {
      account: accounts[1].account,
    });

    const depositLog = await waitForEvent({
      hash,
      eventName: "Deposit",
      client: accounts[1],
      abi: eventPool.abi,
    });

    expect(await token.read.balanceOf([eventPool.address])).to.equal(
      costPerParticipant2
    );
  });

  it("should collect deposits for an event", async () => {
    const {
      eventPool,
      accounts,
      token,
      costPerParticipant1,
      costPerParticipant2,
    } = await createEvents();

    const eventIds = [1, 2];
    await eventPool.write.deposit([eventIds], {
      account: accounts[1].account,
    });

    await eventPool.write.deposit([eventIds], {
      account: accounts[2].account,
    });

    await hre.network.provider.send("evm_increaseTime", [3600]); // Forward time by 1 hour
    await hre.network.provider.send("evm_mine"); // Mine a new block to apply the time change
    await eventPool.write.claimFunds([2], {
      account: accounts[0].account,
    });

    expect(await token.read.balanceOf([eventPool.address])).to.equal(0);
  });

  it.only("should allow a funder to withdraw their deposit", async () => {
    const {
      eventPool,
      accounts,
      token,
      costPerParticipant1,
      costPerParticipant2,
    } = await createEvents();

    const eventIds = [1, 2];
    await eventPool.write.deposit([eventIds], {
      account: accounts[1].account,
    });

    const initialFunderBalance = BigInt(
      await token.read.balanceOf([accounts[1].account.address])
    );
    const initialEventPoolBalance = BigInt(
      await token.read.balanceOf([eventPool.address])
    );

    await eventPool.write.withdraw({
      account: accounts[1].account,
    });

    const finalFunderBalance = BigInt(
      await token.read.balanceOf([accounts[1].account.address])
    );
    const finalEventPoolBalance = BigInt(
      await token.read.balanceOf([eventPool.address])
    );

    expect(finalEventPoolBalance).to.equal(0n);
  });

  it("should allow an organizer to collect funds once the event reaches the minimum number of participants", async () => {
    const {
      eventPool,
      accounts,
      token,
      costPerParticipant1,
      costPerParticipant2,
    } = await createEvents();

    const eventId = 1;
    await eventPool.write.deposit([eventId], {
      account: accounts[1].account,
    });

    await eventPool.write.deposit([eventId], {
      account: accounts[2].account,
    });

    const initialOrganizerBalance = await token.read.balanceOf([
      accounts[0].account.address,
    ]);

    await eventPool.write.claimFunds([eventId], {
      account: accounts[0].account,
    });

    const finalOrganizerBalance = await token.read.balanceOf([
      accounts[0].account.address,
    ]);

    expect(finalOrganizerBalance).to.equal(
      initialOrganizerBalance + costPerParticipant1 * 2n
    );

    const eventDetails = await eventPool.read.events([eventId]);
    expect(eventDetails.fundsClaimed).to.be.true;
  });

  it.skip("should not allow deposit with incorrect amount", async () => {
    const { eventPool, accounts, token } = await deploy();
    const costPerParticipant = parseUnits("10", 18);
    const minParticipants = 2;
    const maxParticipants = 5;
    const startsAt = Math.floor(Date.now() / 1000) + 3600; // Set startsAt further in the future
    const endsAt = startsAt + 3600;
    const fundingDeadline = startsAt - 1800; // Ensure fundingDeadline is before startsAt
    const metadata = "https://metadata";

    await eventPool.write.createEvent([
      metadata,
      fundingDeadline,
      startsAt,
      endsAt,
      minParticipants,
      maxParticipants,
      costPerParticipant,
    ]);

    await token.write.approve([eventPool.address, costPerParticipant]);

    const incorrectAmount = parseUnits("5", 18);
    await expect(
      eventPool.write.deposit([[1], incorrectAmount])
    ).to.be.revertedWith("Invalid event cost");
  });
});

async function waitForEvent({
  hash,
  eventName,
  client,
  abi,
}: {
  hash: `0x${string}`;
  eventName: string;
  client: WalletClient;
  abi: unknown[];
}) {
  const tx = await client.extend(publicActions).waitForTransactionReceipt({
    hash,
  });

  return tx.logs
    .map(({ data, topics }) => {
      try {
        return decodeEventLog({ abi, data, topics });
      } catch (error) {
        return {};
      }
    })
    .filter((e) => e.eventName === eventName);
}

async function deploy() {
  const accounts = await hre.viem.getWalletClients();
  const deployer = accounts[0].account;
  const token = await hre.viem.deployContract("MockToken", ["USDC", "USDC"]);
  const eventPool = await hre.viem.deployContract("EventPool", [token.address]);

  await Promise.all(
    accounts.map(({ account }) =>
      token.write.mint([account.address, parseUnits("1000", 18)])
    )
  );
  await Promise.all(
    accounts.map(({ account }) =>
      token.write.approve([eventPool.address, parseUnits("1000", 18)], {
        account,
      })
    )
  );
  return { accounts, eventPool, token };
}

async function createEvents() {
  const { eventPool, accounts, token } = await deploy();
  const costPerParticipant1 = parseUnits("10", 18);
  const costPerParticipant2 = parseUnits("20", 18);
  const minParticipants = 2;
  const maxParticipants = 5;
  const startsAt = Math.floor(Date.now() / 1000) + 3600; // Set startsAt further in the future
  const endsAt = startsAt + 3600;
  const fundingDeadline = startsAt - 1800; // Ensure fundingDeadline is before startsAt
  const metadata = "https://metadata";

  await eventPool.write.createEvent([
    metadata,
    fundingDeadline,
    startsAt,
    endsAt,
    minParticipants,
    maxParticipants,
    costPerParticipant1,
  ]);
  await eventPool.write.createEvent([
    metadata,
    fundingDeadline,
    startsAt,
    endsAt,
    minParticipants,
    maxParticipants,
    costPerParticipant2,
  ]);

  await token.write.approve([eventPool.address, costPerParticipant1], {
    account: accounts[1].account,
  });
  await token.write.approve([eventPool.address, costPerParticipant2], {
    account: accounts[1].account,
  });

  return {
    eventPool,
    accounts,
    token,
    costPerParticipant1,
    costPerParticipant2,
  };
}
