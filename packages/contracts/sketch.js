class MutualAssuranceFund {
  constructor(token) {
    this.token = token;
    this.events = {};
    this.deposits = {};
    this.nextEventId = 0;
  }

  createEvent(
    metadata,
    fundingDeadline,
    startsAt,
    endsAt,
    minParticipants,
    maxParticipants,
    costPerParticipant
  ) {
    if (fundingDeadline <= Date.now()) {
      throw new Error("Funding deadline must be in the future");
    }
    if (fundingDeadline >= startsAt) {
      throw new Error("Funding deadline must be before start time");
    }
    if (startsAt >= endsAt) {
      throw new Error("Start time must be before end time");
    }
    if (minParticipants <= 0) {
      throw new Error("Minimum participants must be greater than 0");
    }
    if (maxParticipants < minParticipants) {
      throw new Error("Maximum participants must be >= minimum participants");
    }

    const newEvent = {
      id: this.nextEventId,
      organizer: "organizer_address", // Replace with real organizer address
      metadata,
      fundingDeadline,
      startsAt,
      endsAt,
      minParticipants,
      maxParticipants,
      costPerParticipant,
      currentParticipants: 0,
      fundsClaimed: false,
      participants: {},
    };

    this.events[this.nextEventId] = newEvent;
    this.nextEventId++;
  }

  deposit(participantAddress, eventIds) {
    if (eventIds.length === 0) {
      throw new Error("Must select at least one event");
    }

    let maxCost = 0;

    for (let i = 0; i < eventIds.length; i++) {
      const ev = this.events[eventIds[i]];
      if (!ev) {
        throw new Error("Event does not exist");
      }
      if (ev.fundsClaimed) {
        throw new Error("Event funds already claimed");
      }
      if (Date.now() > ev.fundingDeadline) {
        throw new Error("Event funding deadline passed");
      }
      if (ev.participants[participantAddress]) {
        throw new Error("Already signed up for this event");
      }
      if (ev.currentParticipants >= ev.maxParticipants) {
        throw new Error("Event has reached max participants");
      }

      if (ev.costPerParticipant > maxCost) {
        maxCost = ev.costPerParticipant;
      }

      ev.participants[participantAddress] = true;
      ev.currentParticipants++;
    }

    if (maxCost === 0) {
      throw new Error("No valid events selected");
    }

    if (!this.deposits[participantAddress]) {
      this.deposits[participantAddress] = [];
    }

    this.deposits[participantAddress].push({ amount: maxCost, eventIds });
    console.log(
      `Deposit: ${participantAddress} deposited ${maxCost} for events ${eventIds}`
    );
  }

  withdraw(participantAddress) {
    const userDeposits = this.deposits[participantAddress];
    if (!userDeposits) {
      throw new Error("No deposits found for this address");
    }

    let totalAmount = 0;

    for (let i = 0; i < userDeposits.length; i++) {
      if (userDeposits[i].amount === 0) {
        continue;
      }
      const eventIds = userDeposits[i].eventIds;
      for (let j = 0; j < eventIds.length; j++) {
        const eventId = eventIds[j];
        const ev = this.events[eventId];
        if (ev.fundsClaimed) {
          throw new Error("Funds claimed by event");
        }

        ev.currentParticipants--;
        totalAmount += ev.costPerParticipant;
      }
      userDeposits[i].amount = 0;
      console.log(
        `Withdraw: ${participantAddress} withdrew ${totalAmount} from events ${eventIds}`
      );
    }
  }

  claimFunds(organizerAddress, eventId) {
    const ev = this.events[eventId];
    if (!ev) {
      throw new Error("Event does not exist");
    }
    if (organizerAddress !== ev.organizer) {
      throw new Error("Only organizer can claim funds");
    }
    if (ev.fundsClaimed) {
      throw new Error("Funds already claimed");
    }
    if (ev.currentParticipants < ev.minParticipants) {
      throw new Error("Minimum participants not reached");
    }
    if (Date.now() <= ev.fundingDeadline) {
      throw new Error("Funding deadline not reached");
    }

    ev.fundsClaimed = true;
    const totalAmount = ev.costPerParticipant * ev.currentParticipants;
    console.log(
      `FundsClaimed: Organizer ${organizerAddress} claimed ${totalAmount} for event ${eventId}`
    );
  }
}

// Example Usage
const fund = new MutualAssuranceFund("Token_Address");

// Create an event
fund.createEvent(
  "Sample Event",
  Date.now() + 100, // funding deadline in the future
  Date.now() + 200, // start time
  Date.now() + 300, // end time
  2, // min participants
  10, // max participants
  100 // cost per participant
);

// Create another event to ensure one event reaches min participants
fund.createEvent(
  "Second Event",
  Date.now() + 100, // funding deadline in the future
  Date.now() + 200, // start time
  Date.now() + 300, // end time
  1, // min participants
  5, // max participants
  150 // cost per participant
);

// Participants deposit
fund.deposit("participant_1", [0, 1]);
fund.deposit("participant_2", [0, 1]);

// Attempt to withdraw by participant_1
fund.withdraw("participant_1");

// Claim funds for an event that has reached the minimum participants
setTimeout(() => {
  fund.claimFunds("organizer_address", 0);
}, 11000); // After funding deadline

// fund.withdraw("participant_1");
// Claim funds for the second event
setTimeout(() => {
  fund.claimFunds("organizer_address", 1);
  console.table(fund.events);
  console.table(fund.deposits);
}, 1100); // After funding deadline
