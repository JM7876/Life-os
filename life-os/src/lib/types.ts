// Canonical data-model types for Life OS.
// These describe the shape of documents stored under
// users/{uid}/{tasks|events|accounts|transactions|bills|notes} in Firestore.
// They are kept as a reference for Phase 2 when reads/writes get wired up.

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  location?: string;
  notes?: string;
  source?: 'google' | 'outlook' | 'manual';
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  institution: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  accountId?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  paid: boolean;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
