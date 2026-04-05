export type LifeEvent = {
  id: string;
  year: string;
  title: string;
  city: string;
  coordinates: [number, number];
  zoom?: number;
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
    zoom: 11.4,
    era: "Origins",
    summary: "Graduated from Thornton Township High School in Harvey, Illinois",
    detail:
      "Use this first chapter to anchor the story of where your family history began and what shaped your earliest sense of home.",
    accent: "#f5c451",
  },
  {
    id: "branner",
    year: "2006",
    title: "Arrives at Stanford University",
    city: "Palo Alto, California",
    coordinates: [-122.16286046800239, 37.4255762707847],
    zoom: 15,
    era: "Growth",
    summary: "A stretch of exploration, independence, and new ideas.",
    detail:
      "Lived in Branner Hall freshman year (the Gryffindor of Stanford) where I met my best friends and started my future wife. Sophomore year I was elected (co) class president",
    accent: "#f08f4f",
  },
  {
    id: "paris",
    year: "2009",
    title: "Stanford in Paris",
    city: "Paris, France",
    coordinates: [2.3654928866124796, 48.85573679017439],
    zoom: 16,
    era: "Study Abroad",
    summary: "A stretch of exploration, independence, and new ideas.",
    detail:
      "Capture what changed here: the people you met, the work you did, and the interests that started to define your direction.",
    accent: "#f08f4f",
  },
  {
    id: "school",
    year: "2010",
    title: "Graduates from Stanford",
    city: "Palo Alto, California",
    coordinates: [-122.16844046338828, 37.4282609641785],
    zoom: 15,
    era: "Growth",
    summary: "A stretch of exploration, independence, and new ideas.",
    detail:
      "Capture what changed here: the people you met, the work you did, and the interests that started to define your direction.",
    accent: "#f08f4f",
  },
  {
    id: "coast",
    year: "2010",
    title: "San Francisco Startup Life",
    city: "San Francisco",
    coordinates: [-122.42512486220905, 37.77757927252507],
    zoom: 12.6,
    era: "Momentum",
    summary: "A bigger stage, faster pace, and more ambition.",
    detail:
      "This chapter can highlight the move toward product, design, engineering, or community work that changed the shape of your career.",
    accent: "#e25c45",
  },
  {
    id: "today",
    year: "2017",
    title: "Director of Engineering, Burrow",
    city: "New York City",
    coordinates: [-73.98832293152013, 40.74457659830339],
    zoom: 15,
    era: "Leadership",
    summary: "Where the timeline meets the present moment.",
    detail:
      "Use the current chapter to show what matters now, what you are building, and what future locations or milestones might come next.",
    accent: "#e53935",
  },
  {
    id: "zoox",
    year: "2023",
    title: "Engineering Manager, Zoox",
    city: "Foster City, California",
    coordinates: [-122.26645232187381, 37.57156225032805],
    zoom: 13.1,
    era: "Today",
    summary: "Engineering Manager, Mapping Web",
    detail:
      "the Mapping Web team is a part of Zoox Autonomy software, under Guidance & Routing",
    accent: "#e53935",
  }
];
