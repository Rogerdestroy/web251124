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

export interface Project {
  id: string;
  title: string;
  groupName: string;
  members: string[];
  stage: 'ideation' | 'prototyping' | 'fabrication' | 'testing' | 'completed';
  progress: number;
  thumbnail: string;
  lastUpdate: string;
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