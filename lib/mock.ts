export const newcomer = {
  name: "Sofia Martínez",
  role: "Senior Marketing Manager",
  department: "Marketing",
  startDate: "March 3, 2026",
  day: 18,
  buddy: { name: "James Okafor", role: "Marketing Strategist" },
  manager: { name: "Claire Bennett", role: "VP Marketing" },
  company: "Meridian Group",
  phase: "Arrival",
};

export const buckets = [
  {
    id: "job",
    label: "My Job",
    number: "01",
    score: 62,
    color: "accent",
    items: [
      { label: "Role clarity", done: true },
      { label: "30-60-90 day goals", done: true },
      { label: "Performance criteria", done: false },
      { label: "Tools & systems access", done: true },
      { label: "Who to ask for what", done: false },
    ],
  },
  {
    id: "org",
    label: "My Organization",
    number: "02",
    score: 48,
    color: "ink",
    items: [
      { label: "Org chart & team structure", done: true },
      { label: "Company values & culture", done: true },
      { label: "Strategy & current priorities", done: false },
      { label: "How decisions are made", done: false },
      { label: "Norms & rituals", done: false },
    ],
  },
  {
    id: "people",
    label: "My People",
    number: "03",
    score: 35,
    color: "muted",
    items: [
      { label: "Met my buddy", done: true },
      { label: "Met my direct team", done: true },
      { label: "Key cross-functional contacts", done: false },
      { label: "Informal networks", done: false },
      { label: "Sense of belonging", done: false },
    ],
  },
];

export const todayActions = [
  { bucket: "job", text: "Review your 90-day goals with Claire", urgent: true },
  { bucket: "people", text: "Send a coffee chat request to Ana Lima (Finance)", urgent: false },
  { bucket: "org", text: "Watch the 5-min company strategy video", urgent: false },
];

export const myTeam = [
  { name: "Claire Bennett", role: "VP Marketing", relation: "Your manager", avatar: "CB" },
  { name: "James Okafor", role: "Marketing Strategist", relation: "Your buddy", avatar: "JO" },
  { name: "Priya Nair", role: "Content Lead", relation: "Peer", avatar: "PN" },
  { name: "Tom Reyes", role: "Brand Designer", relation: "Peer", avatar: "TR" },
  { name: "Ana Lima", role: "Finance Business Partner", relation: "Key contact", avatar: "AL" },
];

export const managerNewcomers = [
  {
    name: "Sofia Martínez",
    role: "Sr. Marketing Manager",
    day: 18,
    phase: "Arrival",
    status: "yellow",
    scores: { job: 62, org: 48, people: 35 },
    selfScore: 48,
    managerScore: 65,
    flag: "Self vs manager divergence — schedule a check-in",
  },
  {
    name: "Daniel Cruz",
    role: "Data Analyst",
    day: 54,
    phase: "Integration",
    status: "green",
    scores: { job: 78, org: 72, people: 68 },
    selfScore: 72,
    managerScore: 74,
    flag: null,
  },
  {
    name: "Yuki Tanaka",
    role: "Product Designer",
    day: 91,
    phase: "Adjustment",
    status: "red",
    scores: { job: 55, org: 40, people: 28 },
    selfScore: 38,
    managerScore: 60,
    flag: "Social isolation — Bucket 3 critically low",
  },
];

export const hrOverview = {
  total: 14,
  green: 8,
  yellow: 4,
  red: 2,
  avgScores: { job: 69, org: 58, people: 52 },
  flightRisk: 2,
  phases: { arrival: 5, integration: 4, adjustment: 3, stabilization: 1, embedding: 1 },
};

export const hrNewcomers = [
  { name: "Sofia Martínez", dept: "Marketing", day: 18, status: "yellow", manager: "Claire Bennett" },
  { name: "Daniel Cruz", dept: "Analytics", day: 54, status: "green", manager: "Ravi Sharma" },
  { name: "Yuki Tanaka", dept: "Product", day: 91, status: "red", manager: "Claire Bennett" },
  { name: "Marcus Webb", dept: "Sales", day: 134, status: "green", manager: "Lee Park" },
  { name: "Fatima Al-Hassan", dept: "Legal", day: 201, status: "green", manager: "Susan Cole" },
  { name: "Ben Kowalski", dept: "Engineering", day: 12, status: "green", manager: "Ravi Sharma" },
];

export const evalQuestions = {
  job: [
    "I clearly understand what is expected of me in my role",
    "I feel confident performing my core tasks",
    "I know where to find the resources I need",
    "I understand how my performance will be evaluated",
    "I have achieved meaningful results since joining",
  ],
  org: [
    "I understand how decisions are made in this company",
    "I feel aligned with the company's values and culture",
    "I understand how my role contributes to company goals",
    "I know who to go to for information outside my team",
    "I feel comfortable navigating this organization",
  ],
  people: [
    "I have built meaningful relationships with colleagues",
    "I feel like I belong in this team",
    "I feel comfortable asking others for help",
    "I know who my key contacts are across the company",
    "I feel socially integrated in this organization",
  ],
};
