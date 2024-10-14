import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { ProjectCreated } from "../generated/ProjectFactory/ProjectFactory"

export function createProjectCreatedEvent(
  projectAddress: Address,
  owner: Address,
  token: Address,
  metadata: string,
  deadline: BigInt,
  target: BigInt,
  minFundingAmount: BigInt,
  maxFundingAmount: BigInt,
  minDuration: BigInt,
  maxDuration: BigInt
): ProjectCreated {
  let projectCreatedEvent = changetype<ProjectCreated>(newMockEvent())

  projectCreatedEvent.parameters = new Array()

  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectAddress",
      ethereum.Value.fromAddress(projectAddress)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromUnsignedBigInt(target))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minFundingAmount",
      ethereum.Value.fromUnsignedBigInt(minFundingAmount)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxFundingAmount",
      ethereum.Value.fromUnsignedBigInt(maxFundingAmount)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minDuration",
      ethereum.Value.fromUnsignedBigInt(minDuration)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxDuration",
      ethereum.Value.fromUnsignedBigInt(maxDuration)
    )
  )

  return projectCreatedEvent
}
