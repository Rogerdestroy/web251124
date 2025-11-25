
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  PROJECTS = 'PROJECTS',
  INVENTORY = 'INVENTORY',
  SAFETY = 'SAFETY',
  GALLERY = 'GALLERY',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'consumable' | 'equipment' | 'tool';
  quantity: number;
  unit: string;
  location: string;
  status: 'available' | 'low_stock' | 'maintenance' | 'in_use';
  spec?: string; // e.g., "3mm", "M3"
}

export type ProjectStage = 'ideation' | 'prototyping' | 'fabrication' | 'testing' | 'completed';

export interface Project {
  id: string;
  title: string;
  topic: string; // New: Topic/Theme
  groupName: string;
  members: string[];
  stage: ProjectStage;
  progress: number; // 0-100
  thumbnail: string;
  lastUpdate: string;
  description?: string;
  notes?: string; // New: Remarks/Notes
  status: 'pending' | 'approved' | 'rejected'; // New: Approval Status
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  safetyCertified: boolean;
  avatar: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'important' | 'homework' | 'activity';
  content: string;
}

export interface MachineBooking {
  id: string;
  machineId: string;
  studentName: string;
  startTime: string;
  durationMinutes: number;
}

export interface CourseUnit {
  week: number;
  topic: string;
  status: 'completed' | 'active' | 'upcoming';
  materials?: boolean;
  video?: boolean;
}

export interface Course {
  id: string;
  title: string;
  grade: string;
  time: string;
  description: string;
  units: CourseUnit[];
  studentCount: number;
  color: string; // Tailwind class for gradient or color
}

export interface GalleryItem {
  id: number | string;
  title: string;
  student: string;
  year: string;
  category: string;
  description: string;
  image: string;
  award?: string;
}

export interface IncidentReport {
  id: string;
  studentName: string;
  date: string;
  location: string;
  description: string;
  status: 'pending' | 'resolved';
}

export interface ClassSession {
  day: number; // 1 (Mon) - 5 (Fri)
  period: number; // 1-8
  class: string;
  subject: string;
  room: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'exam' | 'activity' | 'holiday' | 'other';
}