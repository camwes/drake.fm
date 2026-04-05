export type LifeEvent = {
  id: string;
  year: string;
  title: string;
  city: string;
  coordinates: [number, number];
  era: string;
  summary: string;
  detail: string;
  accent: string;
};

export const lifeEvents: LifeEvent[] = [
  {
    id: "origin",
    year: "1988",
    title: "Born and Raised on the Southside of Chicago",
    city: "Chicago, Illinois",
    coordinates: [-87.6298, 41.8781],
    era: "Origins",
    summary: "Graduated from Thornton Township High School in Harvey, Illinois",
    detail:
      "Use this first chapter to anchor the story of where your family history began and what shaped your earliest sense of home.",
    accent: "#f5c451",
  },
  {
    id: "school",
    year: "2006",
    title: "Attends Stanford University",
    city: "Palo Alto, California",
    coordinates: [-122.1699, 37.4305],
    era: "Growth",
    summary: "A stretch of exploration, independence, and new ideas.",
    detail:
      "Capture what changed here: the people you met, the work you did, and the interests that started to define your direction.",
    accent: "#f08f4f",
  },
  {
    id: "coast",
    year: "2014",
    title: "Moved to San Francisco",
    city: "San Francisco",
    coordinates: [-122.4194, 37.7749],
    era: "Momentum",
    summary: "A bigger stage, faster pace, and more ambition.",
    detail:
      "This chapter can highlight the move toward product, design, engineering, or community work that changed the shape of your career.",
    accent: "#e25c45",
  },
  {
    id: "today",
    year: "2026",
    title: "Director of Engineering atBurrow",
    city: "New York City",
    coordinates: [-73.9881, 40.7421],
    era: "Today",
    summary: "Where the timeline meets the present moment.",
    detail:
      "Use the current chapter to show what matters now, what you are building, and what future locations or milestones might come next.",
    accent: "#e53935",
  },
];
