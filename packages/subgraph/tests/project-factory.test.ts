import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import { ProjectCreated as ProjectCreatedEvent } from "../generated/ProjectFactory/ProjectFactory";
import {
  ProjectInitialized as ProjectInitializedEvent,
  Funded as FundedEvent,
  Withdrawn as WithdrawnEvent,
  Refunded as RefundedEvent,
} from "../generated/templates/ProjectTemplate/Project";
import { ProjectTemplate } from "../generated/templates";
import { Project, Contribution } from "../generated/schema";

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  // Create a dynamic data source for the new Project contract
  ProjectTemplate.create(event.params.projectAddress);
}

export function handleProjectInitialized(event: ProjectInitializedEvent): void {
  let projectId = event.address.toHexString();
  let project = new Project(projectId);
  project.owner = event.params.owner;
  project.token = event.params.token;
  project.metadata = event.params.metadata;
  project.deadline = event.params.deadline;
  project.target = event.params.target;
  project.minFundingAmount = event.params.minFundingAmount;
  project.maxFundingAmount = event.params.maxFundingAmount;
  project.minDuration = event.params.minDuration;
  project.maxDuration = event.params.maxDuration;
  project.withdrawn = false;
  project.totalRaised = BigInt.fromI32(0);
  project.save();
}

export function handleFunded(event: FundedEvent): void {
  let projectId = event.address.toHexString();
  let project = Project.load(projectId);

  if (project == null) {
    log.error("Project not found: {}", [projectId]);
    return;
  }

  let funder = event.params.funder.toHexString();
  let contributionId = projectId + "-" + funder;
  let contribution = Contribution.load(contributionId);

  if (contribution == null) {
    contribution = new Contribution(contributionId);
    contribution.project = projectId;
    contribution.funder = event.params.funder;
    contribution.amount = event.params.amount;
    contribution.refunded = false;
  } else {
    contribution.amount = contribution.amount.plus(event.params.amount);
  }

  contribution.save();

  project.totalRaised = project.totalRaised.plus(event.params.amount);
  project.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let projectId = event.address.toHexString();
  let project = Project.load(projectId);

  if (project == null) {
    log.error("Project not found: {}", [projectId]);
    return;
  }

  project.withdrawn = true;
  project.save();
}

export function handleRefunded(event: RefundedEvent): void {
  let projectId = event.address.toHexString();
  let funder = event.params.funder.toHexString();
  let contributionId = projectId + "-" + funder;
  let contribution = Contribution.load(contributionId);

  if (contribution == null) {
    log.error("Contribution not found for refund: {}", [contributionId]);
    return;
  }

  contribution.refunded = true;
  contribution.save();

  let project = Project.load(projectId);
  if (project != null) {
    project.totalRaised = project.totalRaised.minus(
      event.params.contributionAmount
    );
    project.save();
  }
}
