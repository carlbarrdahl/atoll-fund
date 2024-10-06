export interface Metadata {
  title: string;
  description: string;
  location: string;
}

export interface Event {
  id: string;
  metadata: Metadata;
  targetParticipants: number;
  costPerParticipant: number;
  startDate: Date;
  deadline: Date;
}

export const events: Event[] = [
  {
    id: "1",
    metadata: {
      title: "Sunrise Yoga and Meditation",
      description:
        "A morning session to energize the body and calm the mind with a combination of yoga and guided meditation. Participants can enjoy fresh herbal tea after the session.",
      location: "Chiang Mai",
    },
    targetParticipants: 30,
    costPerParticipant: 10,
    startDate: new Date("2024-10-10T06:30:00Z"),
    deadline: new Date("2024-10-09T18:00:00Z"),
  },
  {
    id: "2",
    metadata: {
      title: "Community Farm-to-Table Dinner",
      description:
        "A collective dinner event where residents cook together using locally grown produce. The event ends with a storytelling circle and live acoustic music.",
      location: "Chiang Mai",
    },
    targetParticipants: 50,
    costPerParticipant: 15,
    startDate: new Date("2024-10-11T19:00:00Z"),
    deadline: new Date("2024-10-10T12:00:00Z"),
  },
  {
    id: "3",
    metadata: {
      title: "Artisanal Craft Workshop",
      description:
        "Participants will learn and practice traditional crafting techniques such as pottery, weaving, and woodworking. All materials are provided, and each participant leaves with a handmade item.",
      location: "Chiang Mai",
    },
    targetParticipants: 20,
    costPerParticipant: 25,
    startDate: new Date("2024-10-12T10:00:00Z"),
    deadline: new Date("2024-10-11T17:00:00Z"),
  },
  {
    id: "4",
    metadata: {
      title: "Sustainable Architecture Tour",
      description:
        "A guided tour showcasing innovative eco-friendly buildings and structures around the village, followed by a Q&A session with the architects and designers.",
      location: "Chiang Mai",
    },
    targetParticipants: 40,
    costPerParticipant: 5,
    startDate: new Date("2024-10-13T14:00:00Z"),
    deadline: new Date("2024-10-12T16:00:00Z"),
  },
  {
    id: "5",
    metadata: {
      title: "Mindful Cooking Class",
      description:
        "A hands-on workshop focused on preparing healthy, plant-based meals using seasonal ingredients. Participants learn the art of mindful eating and nutrition.",
      location: "Chiang Mai",
    },
    targetParticipants: 15,
    costPerParticipant: 30,
    startDate: new Date("2024-10-14T17:00:00Z"),
    deadline: new Date("2024-10-13T20:00:00Z"),
  },
  {
    id: "6",
    metadata: {
      title: "Open Mic and Talent Night",
      description:
        "An open event for participants to share their talents, be it poetry, music, or comedy. A casual evening for the community to connect through creative expression.",
      location: "Chiang Mai",
    },
    targetParticipants: 60,
    costPerParticipant: 0,
    startDate: new Date("2024-10-15T20:00:00Z"),
    deadline: new Date("2024-10-14T22:00:00Z"),
  },
  {
    id: "7",
    metadata: {
      title: "Permaculture Garden Workshop",
      description:
        "A practical session on creating sustainable garden systems using permaculture principles. Participants get to design small-scale gardens and take home seeds to start their own.",
      location: "Chiang Mai",
    },
    targetParticipants: 25,
    costPerParticipant: 15,
    startDate: new Date("2024-10-16T09:00:00Z"),
    deadline: new Date("2024-10-15T18:00:00Z"),
  },
  {
    id: "8",
    metadata: {
      title: "Silent Nature Walk",
      description:
        "A guided silent walk through nearby woods to deepen the connection with nature. The walk concludes with a group reflection session at the scenic viewpoint.",
      location: "Chiang Mai",
    },
    targetParticipants: 20,
    costPerParticipant: 5,
    startDate: new Date("2024-10-17T08:00:00Z"),
    deadline: new Date("2024-10-16T20:00:00Z"),
  },
  {
    id: "9",
    metadata: {
      title: "Community Marketplace",
      description:
        "A popup market showcasing local artists, farmers, and creators. Participants can browse handmade goods, sample organic produce, and meet the people behind the creations.",
      location: "Chiang Mai",
    },
    targetParticipants: 100,
    costPerParticipant: 0,
    startDate: new Date("2024-10-18T10:00:00Z"),
    deadline: new Date("2024-10-17T18:00:00Z"),
  },
  {
    id: "10",
    metadata: {
      title: "Bonfire Night and Stargazing",
      description:
        "An evening event around a communal bonfire with music, hot drinks, and a guided stargazing session led by an astronomer. Perfect for unwinding and enjoying the night sky.",
      location: "Chiang Mai",
    },
    targetParticipants: 70,
    costPerParticipant: 5,
    startDate: new Date("2024-10-19T21:00:00Z"),
    deadline: new Date("2024-10-18T23:00:00Z"),
  },
];
