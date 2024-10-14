import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ProjectCreated } from "../generated/schema"
import { ProjectCreated as ProjectCreatedEvent } from "../generated/ProjectFactory/ProjectFactory"
import { handleProjectCreated } from "../src/project-factory"
import { createProjectCreatedEvent } from "./project-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let projectAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let metadata = "Example string value"
    let deadline = BigInt.fromI32(234)
    let target = BigInt.fromI32(234)
    let minFundingAmount = BigInt.fromI32(234)
    let maxFundingAmount = BigInt.fromI32(234)
    let minDuration = BigInt.fromI32(234)
    let maxDuration = BigInt.fromI32(234)
    let newProjectCreatedEvent = createProjectCreatedEvent(
      projectAddress,
      owner,
      token,
      metadata,
      deadline,
      target,
      minFundingAmount,
      maxFundingAmount,
      minDuration,
      maxDuration
    )
    handleProjectCreated(newProjectCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ProjectCreated created and stored", () => {
    assert.entityCount("ProjectCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "projectAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadata",
      "Example string value"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "deadline",
      "234"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "target",
      "234"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "minFundingAmount",
      "234"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maxFundingAmount",
      "234"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "minDuration",
      "234"
    )
    assert.fieldEquals(
      "ProjectCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maxDuration",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
