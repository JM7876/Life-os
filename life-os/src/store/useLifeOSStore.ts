import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: Date;
  read: boolean;
  priority: boolean;
  provider: 'gmail' | 'outlook' | 'icloud';
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  institution: string;
  lastUpdated: Date;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  flights: {
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
  }[];
  accommodations?: string;
  activities: string[];
}

interface LifeOSState {
  // UI State
  sidebarOpen: boolean;
  chatOpen: boolean;
  activeTab: string;
  
  // Data
  tasks: Task[];
  emails: Email[];
  accounts: FinancialAccount[];
  trips: Trip[];
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  
  // Email actions
  markEmailRead: (id: string) => void;
  markEmailPriority: (id: string, priority: boolean) => void;
  
  // Financial actions
  updateAccountBalance: (id: string, balance: number) => void;
  
  // Trip actions
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
}

export const useLifeOSStore = create<LifeOSState>()(
  persist(
    (set, get) => ({
      // Initial UI State
      sidebarOpen: true,
      chatOpen: false,
      activeTab: 'dashboard',
      
      // Initial Data (sample data for demo)
      tasks: [
        {
          id: '1',
          title: 'Review Q1 photography portfolio',
          completed: false,
          priority: 'high',
          dueDate: new Date().toISOString(),
          category: 'Work',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Pay Amex statement',
          completed: false,
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          category: 'Finance',
          createdAt: new Date(),
        },
        {
          id: '3',
          title: 'Book Denver flight for March',
          completed: false,
          priority: 'medium',
          dueDate: new Date(Date.now() + 604800000).toISOString(),
          category: 'Travel',
          createdAt: new Date(),
        },
      ],
      
      emails: [],
      accounts: [],
      trips: [],
      
      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setChatOpen: (open) => set({ chatOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Task Actions
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }],
      })),
      
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : undefined,
              }
            : task
        ),
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
      
      // Email Actions
      markEmailRead: (id) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, read: true } : email
        ),
      })),
      
      markEmailPriority: (id, priority) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, priority } : email
        ),
      })),
      
      // Financial Actions
      updateAccountBalance: (id, balance) => set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id
            ? { ...account, balance, lastUpdated: new Date() }
            : account
        ),
      })),
      
      // Trip Actions
      addTrip: (trip) => set((state) => ({
        trips: [...state.trips, { ...trip, id: crypto.randomUUID() }],
      })),
      
      updateTrip: (id, updates) => set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === id ? { ...trip, ...updates } : trip
        ),
      })),
    }),
    {
      name: 'life-os-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        emails: state.emails,
        accounts: state.accounts,
        trips: state.trips,
      }),
    }
  )
);
