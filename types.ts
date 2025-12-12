export enum AppView {
  LANDING = 'LANDING',
  QUIZ = 'QUIZ',
  GENERATING = 'GENERATING',
  REPORT = 'REPORT',
}

export interface UserProfile {
  situation: string;
  businessSize?: string; // Optional
  roleDescription: string;
}

export interface PainPoints {
  hoursSpent: number;
  primaryAreas: string[];
  rankedTimeWasters: string[]; // Ordered list
  specificTask: string;
}

export interface Readiness {
  familiarity: string;
  timeGoal: string[]; // Multi-select
  blocker: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  profile: UserProfile;
  painPoints: PainPoints;
  readiness: Readiness;
  isComplete: boolean;
}

// Report Data Structures (Expected from Gemini)
export interface QuickWin {
  title: string;
  tool: string;
  description: string;
}

export interface RoadmapItem {
  taskName: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  timeSavings: string; // e.g. "2 hrs/week"
  tools: string;
  blueprint: string; // 3-step guide
  approach: 'DIY' | 'Hire Help';
}

export interface ExpertHelpItem {
  area: string;
  roi: string;
  description: string;
}

export interface ReportData {
  personaName: string; // e.g., "The Juggling Founder"
  executiveSummary: string;
  opportunityScore: number; // 0-100
  estimatedHoursSaved: number;
  topPriorities: string[];
  quickWins: QuickWin[];
  roadmap: RoadmapItem[];
  expertHelp: ExpertHelpItem[];
  weeklyForecast: { week: string; hoursSaved: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
