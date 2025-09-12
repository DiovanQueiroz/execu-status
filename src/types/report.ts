// Tipos para o Sistema de Relatórios C-Level

export type Status = 'green' | 'yellow' | 'red';

export interface TimelinePhase {
  name: string;
  status: Status;
  startDate: string;
  endDate: string;
  progress: number;
  description: string;
}

export interface UserStory {
  id: string;
  ticketNumber: string;
  name: string;
  boardStatus: string; // ex: "To Do", "In Progress", "Done", etc.
  progress: number; // 0-100
}

export interface Epic {
  id: string;
  name: string;
  status: Status; // status manual do épico
  owner: string;
  dueDate: string;
  concerns?: string;
  phase: 'requirements' | 'development' | 'qa'; // fase da timeline
  userStories: UserStory[];
}

export interface Highlight {
  id: string;
  type: 'positive' | 'negative';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  estimatedResolution: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  department: string;
  urgency: 'urgent' | 'high' | 'normal' | 'medium' | 'low';
  requestedBy: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ProjectReport {
  id?: string;
  projectName: string;
  reportDate: string;
  productOwner: string;
  version: number;
  bugs: {
    open: number;
    resolved: number;
    total: number;
  };
  timeline: {
    requirements: TimelinePhase;
    development: TimelinePhase;
    qa: TimelinePhase;
  };
  epics: Epic[];
  highlights: Highlight[];
  blockers: Blocker[];
  helpRequests: HelpRequest[];
  actions: Action[];
}

export interface ReportVersion {
  id: string;
  version: number;
  report: ProjectReport;
  createdAt: string;
  updatedAt: string;
  description: string;
  author: string;
}

export interface StoredReport {
  id: string;
  currentVersion: number;
  report: ProjectReport;
  createdAt: string;
  updatedAt: string;
  versions: ReportVersion[];
}