/**
 * MOCK DATA — Development fallback only.
 * In production, all data comes from the Supabase API.
 * Pages import this as fallback when API is unavailable.
 * See lib/framework.ts for the canonical FIT/ACE/TIE definitions.
 */

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
    id: "fit",
    label: "FIT · Role Clarity",
    number: "01",
    score: 62,
    color: "accent",
    items: [
      { label: "Reviewed job description & reporting line", done: true },
      { label: "Explored org chart & cross-functional links", done: true },
      { label: "Understand KPIs and success criteria", done: false },
      { label: "Clear on RACI and decision rights", done: false },
      { label: "Connect role to strategic plan", done: false },
    ],
  },
  {
    id: "ace",
    label: "ACE · Task Mastery",
    number: "02",
    score: 48,
    color: "ink",
    items: [
      { label: "Started training & onboarding plan", done: true },
      { label: "Set up tools & systems access", done: true },
      { label: "Located SOPs & playbooks", done: false },
      { label: "Understand performance appraisal process", done: false },
      { label: "Reviewed skills matrix & development gaps", done: false },
    ],
  },
  {
    id: "tie",
    label: "TIE · Social Acceptance",
    number: "03",
    score: 35,
    color: "muted",
    items: [
      { label: "Met buddy / mentor", done: true },
      { label: "Participated in team rituals", done: true },
      { label: "Explored company values in action", done: false },
      { label: "Joined employee communities", done: false },
      { label: "Completed first pulse survey", done: false },
    ],
  },
];

export const todayActions = [
  { bucket: "fit", text: "Review your 90-day goals with Claire", urgent: true },
  { bucket: "tie", text: "Send a coffee chat request to Ana Lima (Finance)", urgent: false },
  { bucket: "ace", text: "Complete the HubSpot onboarding module", urgent: false },
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
    scores: { fit: 62, ace: 48, tie: 35 },
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
    scores: { fit: 78, ace: 72, tie: 68 },
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
    scores: { fit: 55, ace: 40, tie: 28 },
    selfScore: 38,
    managerScore: 60,
    flag: "Social isolation — TIE score critically low",
  },
];

export const hrOverview = {
  total: 14,
  green: 8,
  yellow: 4,
  red: 2,
  avgScores: { fit: 69, ace: 58, tie: 52 },
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
  fit: [
    "I clearly understand my role, responsibilities and reporting line",
    "I know where my role sits in the org structure and who to collaborate with",
    "I understand my KPIs and what success looks like",
    "I'm clear on decision rights and where my role ends and others' begin",
    "I see how my daily work connects to the company's strategic objectives",
  ],
  ace: [
    "I'm following a structured onboarding plan with clear milestones",
    "I can navigate the tools and systems I need for my daily work",
    "I know where to find SOPs, playbooks and quality standards",
    "I understand how my performance will be evaluated and when",
    "I know my skill gaps and have a plan to close them",
  ],
  tie: [
    "My buddy/mentor has been a valuable support in my first weeks",
    "I'm included in team rituals — meetings, lunches, informal chats",
    "I see the company values lived in action, not just on the wall",
    "I've connected with people beyond my immediate team",
    "I feel like I belong here and people have my back",
  ],
};
