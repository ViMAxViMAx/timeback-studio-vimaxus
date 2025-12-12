export const QUESTIONS = [
  // SECTION 1: PROFILING
  {
    id: 'q1',
    section: 'profile',
    type: 'single',
    text: "What best describes your current situation?",
    options: [
      "Employed professional (full-time/part-time)",
      "Founder/Business owner",
      "Freelancer/Consultant",
      "On parental leave building a side project",
      "Student or career changer",
      "Other"
    ]
  },
  {
    id: 'q2',
    section: 'profile',
    type: 'single',
    text: "What's the size of your business?",
    condition: (answers: any) => answers.q1 === "Founder/Business owner",
    options: [
      "Just me (solopreneur)",
      "2-5 people",
      "6-15 people",
      "16-50 people",
      "50+ people"
    ]
  },
  {
    id: 'q3',
    section: 'profile',
    type: 'single',
    text: "Which describes you best?",
    options: [
      "Working parent juggling family + work",
      "Managing multiple income sources/jobs",
      "Building a business while employed",
      "Running everything solo in my business",
      "Other"
    ]
  },
  // REST SCREEN 1 would be injected here logically in the Quiz component

  // SECTION 2: PAIN POINTS
  {
    id: 'q4',
    section: 'pain',
    type: 'slider',
    text: "How many hours per week do you spend on repetitive admin tasks?",
    min: 0,
    max: 40,
    step: 1
  },
  {
    id: 'q5',
    section: 'pain',
    type: 'multi',
    text: "Which areas consume most of your time?",
    options: [
      "Email management & follow-ups",
      "Social media content & posting",
      "Client communication & scheduling",
      "Invoicing & financial admin",
      "Data entry & reporting",
      "Research & information gathering",
      "Meeting scheduling & coordination",
      "Content creation & repurposing",
      "Lead generation & outreach",
      "Customer support responses"
    ]
  },
  {
    id: 'q6',
    section: 'pain',
    type: 'rank',
    text: "Rank your biggest time-wasters (Top is biggest)",
    // Options are dynamic based on q5
  },
  {
    id: 'q7',
    section: 'pain',
    type: 'text',
    text: "Describe one task that you do repeatedly that makes you think: 'There must be a better way to do this'",
    placeholder: "e.g., Copying data from emails to a spreadsheet manually every morning..."
  },

  // REST SCREEN 2

  // SECTION 3: READINESS
  {
    id: 'q8',
    section: 'readiness',
    type: 'single',
    text: "How familiar are you with automation tools?",
    options: [
      "Never heard of them",
      "Heard about them but never tried",
      "Tried basic tools (like email filters)",
      "Use some automation (Zapier, Make, etc.)",
      "I'm quite technical and comfortable"
    ]
  },
  {
    id: 'q9',
    section: 'readiness',
    type: 'multi',
    text: "What would you do with 10 extra hours per week?",
    options: [
      "Spend more time with family",
      "Focus on high-value business activities",
      "Rest and self-care",
      "Learn new skills",
      "Take on more clients/projects",
      "Start a new project"
    ]
  },
  {
    id: 'q10',
    section: 'readiness',
    type: 'single',
    text: "What's holding you back from automating?",
    options: [
      "Don't know where to start",
      "Seems too technical",
      "Don't have time to set it up",
      "Not sure what can be automated",
      "Worried about costs",
      "Already tried and failed",
      "Nothing, I'm ready!"
    ]
  }
];
