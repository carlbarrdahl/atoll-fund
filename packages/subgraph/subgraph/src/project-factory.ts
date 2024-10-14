import { ProjectCreated as ProjectCreatedEvent } from "../generated/ProjectFactory/ProjectFactory"
import { ProjectCreated } from "../generated/schema"

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  let entity = new ProjectCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectAddress = event.params.projectAddress
  entity.owner = event.params.owner
  entity.token = event.params.token
  entity.metadata = event.params.metadata
  entity.deadline = event.params.deadline
  entity.target = event.params.target
  entity.minFundingAmount = event.params.minFundingAmount
  entity.maxFundingAmount = event.params.maxFundingAmount
  entity.minDuration = event.params.minDuration
  entity.maxDuration = event.params.maxDuration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
