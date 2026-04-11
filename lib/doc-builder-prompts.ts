/**
 * Prompts for AI-guided interviews that generate onboarding documents.
 * Each doc type has: interview questions for the AI to ask, and a generation prompt
 * to produce the final document from the interview transcript.
 */

export interface DocBuilderConfig {
  id: string;
  title: string;
  dimension: 'fit' | 'ace' | 'tie';
  interviewee: 'hr' | 'manager' | 'both';
  description: string;
  canUpload: boolean; // Can also be created by uploading an existing file
}

export const DOC_BUILDERS: DocBuilderConfig[] = [
  {
    id: 'culture_guide',
    title: 'Company Values & Culture Guide',
    dimension: 'tie',
    interviewee: 'hr',
    description: 'Company values, how they are lived, unwritten rules, what makes this place unique',
    canUpload: true,
  },
  {
    id: 'team_rituals',
    title: 'Team Rituals & Meetings',
    dimension: 'tie',
    interviewee: 'manager',
    description: 'Regular meetings, informal rituals, communication norms, social events',
    canUpload: false,
  },
  {
    id: 'welcome_pack',
    title: 'Welcome Pack',
    dimension: 'tie',
    interviewee: 'hr',
    description: 'Day-1 logistics, contacts, what to bring, what to expect, dress code',
    canUpload: true,
  },
  {
    id: 'unwritten_rules',
    title: 'Unwritten Rules & Culture Tips',
    dimension: 'tie',
    interviewee: 'manager',
    description: 'What newcomers wish they had known, common mistakes, cultural nuances',
    canUpload: false,
  },
  {
    id: 'plan_30_60_90',
    title: '30-60-90 Day Plan',
    dimension: 'ace',
    interviewee: 'manager',
    description: 'Milestones for months 1, 2-3, what success looks like at each stage',
    canUpload: true,
  },
  {
    id: 'performance_guide',
    title: 'Performance Appraisal Guide',
    dimension: 'ace',
    interviewee: 'hr',
    description: 'How performance is evaluated, criteria, timeline, what good looks like',
    canUpload: true,
  },
  {
    id: 'sops_summary',
    title: 'Key Processes & SOPs',
    dimension: 'ace',
    interviewee: 'manager',
    description: 'The 3-5 most important processes for this role, step by step',
    canUpload: true,
  },
  {
    id: 'stakeholder_map',
    title: 'Stakeholder Map',
    dimension: 'fit',
    interviewee: 'manager',
    description: 'Key people the newcomer will interact with, what each needs, relationship tips',
    canUpload: false,
  },
  {
    id: 'team_norms',
    title: 'Team Communication Norms',
    dimension: 'tie',
    interviewee: 'manager',
    description: 'How the team communicates, tools used, response expectations, meeting etiquette',
    canUpload: false,
  },
  {
    id: 'job_description',
    title: 'Job Description',
    dimension: 'fit',
    interviewee: 'hr',
    description: 'Role responsibilities, reporting line, KPIs — reformatted from the job offer',
    canUpload: true,
  },
]

export function getDocInterviewPrompt(docId: string, companyName: string, intervieweeName: string): string {
  const prompts: Record<string, string> = {
    culture_guide: `You are interviewing ${intervieweeName} from ${companyName} to create a Company Values & Culture Guide for newcomers.

Ask about:
1. What are the company's core values? For each value, ask for a real example of it in action.
2. What makes this company's culture unique compared to others?
3. What would surprise a newcomer about how things work here?
4. What are the unwritten rules that everyone knows but nobody tells new people?
5. How do people typically interact — formal or informal? Hierarchical or flat?
6. What behaviours get rewarded here? What behaviours don't fit?
7. Is there anything about the culture that has changed recently?

Keep it conversational. Probe for specific examples and stories, not generalities.`,

    team_rituals: `You are interviewing ${intervieweeName} from ${companyName} to document Team Rituals & Meetings for newcomers.

Ask about:
1. Walk me through a typical week — what regular meetings exist?
2. What informal rituals does the team have? (coffee chats, Friday drinks, birthday celebrations)
3. How does the team communicate day-to-day? (Slack, email, in person)
4. Are there any team traditions that a newcomer should know about?
5. What social events happen regularly?
6. When is the team most available vs. most focused?
7. Is there anything a newcomer might misread about the team dynamic?

Get concrete details — days, times, who attends, what's optional vs. expected.`,

    welcome_pack: `You are interviewing ${intervieweeName} from ${companyName} to create a Welcome Pack for newcomers.

Ask about:
1. What does day 1 look like? Where do they go, who do they meet?
2. What should they bring? Laptop, ID, anything else?
3. What's the dress code?
4. Who is their go-to person for questions in the first week?
5. Where do they eat lunch? Any cafeteria, nearby options?
6. What systems/tools will they need access to? How do they get set up?
7. Are there any administrative things they need to complete in the first days?
8. What's the office layout? Where do they sit?

Focus on practical, day-1 essential information.`,

    unwritten_rules: `You are interviewing ${intervieweeName} from ${companyName} to document Unwritten Rules for newcomers.

Ask about:
1. What do newcomers typically struggle with in the first month that nobody warns them about?
2. What mistakes have you seen new people make?
3. What's the real way decisions get made here? (vs. the official way)
4. Are there any topics or approaches that are sensitive or should be handled carefully?
5. Who are the informal influencers that newcomers should get to know?
6. What's the attitude towards work-life balance, overtime, availability?
7. If you could go back to your first day, what would you want someone to tell you?

Push for honest, specific examples — this is the most valuable document for newcomers.`,

    plan_30_60_90: `You are interviewing ${intervieweeName} from ${companyName} to create a 30-60-90 Day Plan for newcomers.

Ask about:
1. What should a newcomer achieve in the first 30 days? What does "good" look like at day 30?
2. What about days 31-60? What shifts from learning to doing?
3. By day 90, what should they be able to do independently?
4. What training or certifications should happen in each period?
5. What's the first real project or deliverable they should own?
6. When is the first performance check-in?
7. What would make you say "this person is ahead of schedule" at 90 days?

Get specific, measurable milestones — not vague goals.`,

    performance_guide: `You are interviewing ${intervieweeName} from ${companyName} to create a Performance Appraisal Guide for newcomers.

Ask about:
1. How is performance formally evaluated? What's the process?
2. What criteria or competencies are assessed?
3. How often are reviews done? (annual, semi-annual, quarterly)
4. Is there a probation period? How long, and what determines passing it?
5. What does a strong performance review look like vs. a concerning one?
6. How is feedback typically given? Formally or informally?
7. Are there any rating scales or frameworks used?

Focus on clarity — newcomers need to know exactly how they'll be judged.`,

    sops_summary: `You are interviewing ${intervieweeName} from ${companyName} to document the key processes for newcomers.

Ask about:
1. What are the 3-5 most important processes this person needs to know?
2. For each process, walk me through it step by step.
3. What are the common errors or pitfalls in each process?
4. Where is documentation stored? (Notion, SharePoint, etc.)
5. Who do they go to if they get stuck on a process?
6. Are there any quality checks or approvals required?
7. Which processes are most urgent to learn first?

Get detailed, actionable steps — not high-level overviews.`,

    stakeholder_map: `You are interviewing ${intervieweeName} from ${companyName} to create a Stakeholder Map for newcomers.

Ask about:
1. Who are the 5-8 most important people this newcomer will interact with?
2. For each person: what's their role, what do they need from the newcomer, how do they prefer to communicate?
3. Who is the newcomer's skip-level manager?
4. Are there any cross-functional relationships that are critical?
5. Are there any relationships that need careful handling?
6. Who are the informal go-to people for different types of questions?
7. Who should they have coffee with in the first month?

Build a practical relationship guide, not just an org chart.`,

    team_norms: `You are interviewing ${intervieweeName} from ${companyName} to document Team Communication Norms for newcomers.

Ask about:
1. What communication tools does the team use? (Slack, Teams, email, phone)
2. What's the expected response time for different channels?
3. How do you handle urgent vs. non-urgent communication?
4. Are there any meeting etiquette rules? (cameras on/off, muting, agenda)
5. How does the team handle disagreements or conflicting opinions?
6. Is there a preference for async vs. sync communication?
7. What's the attitude towards after-hours messages?

Get specific norms that a newcomer can follow from day 1.`,

    job_description: `You are interviewing ${intervieweeName} from ${companyName} to create a clear Job Description for newcomers.

Ask about:
1. What is the core purpose of this role? In one sentence, why does it exist?
2. What are the 5-7 main responsibilities?
3. Who does this person report to?
4. What are the key KPIs or metrics for success?
5. What decisions can they make independently vs. what needs approval?
6. How does this role connect to the broader team and company strategy?
7. What skills or experience are most critical for success?

Focus on clarity and expectations — this is the newcomer's north star.`,
  }

  const base = prompts[docId] || `You are interviewing ${intervieweeName} from ${companyName} to create onboarding documentation. Ask 6-8 questions about the topic, probing for specific examples and practical details.`

  return `${base}

Instructions:
- Ask 6-8 questions maximum.
- Keep it conversational and warm.
- Probe for SPECIFIC examples, not generalities.
- When you have enough material, send the code x7y8 at the end of your final message.
- NEVER use markdown formatting (no asterisks, no bold). Write in plain conversational text.
- NEVER show the completion code to the user.`
}

export function getDocGenerationPrompt(docId: string, companyName: string): string {
  return `You are a professional HR consultant. Based on the interview transcript below, generate a polished, newcomer-friendly document for ${companyName}.

Requirements:
- Write in a warm, professional tone — as if speaking directly to the newcomer
- Use clear headings and short paragraphs
- GENERALIZE specific examples from the interview — do NOT quote the interviewee verbatim or retell their exact stories. Distill the essence into general company guidance. For example, if they said "Last month John stayed late to help a client," write "People here go the extra mile for clients."
- Do NOT include names of specific people mentioned in the interview
- Make it actionable — the newcomer should be able to use this from day 1
- Keep it concise (500-800 words)
- Do NOT use markdown formatting — use plain text with line breaks for structure
- Do NOT reference the interview, the interviewee, or attribute information to any person
- Write as established fact about the company, not as reported speech

Respond using the submit_document tool.`
}

export function getFileReformatPrompt(docTitle: string, companyName: string): string {
  return `You are a professional HR consultant. Reformat the following document into a clear, newcomer-friendly onboarding resource for ${companyName}.

The document title is: "${docTitle}"

Requirements:
- Rewrite for a newcomer audience — clear, actionable, welcoming
- Use clear headings and short paragraphs
- Remove jargon or internal references that a newcomer wouldn't understand
- Keep all factual content but restructure for readability
- Add context where helpful ("This means..." / "In practice...")
- Keep it concise (500-800 words)
- Do NOT use markdown formatting — use plain text with line breaks
- Maintain a warm, professional tone

Respond using the submit_document tool.`
}
