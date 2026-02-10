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
  transactions: Transaction[];
  bills: Bill[];
  monthlyBudget: number;
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
  addAccount: (account: Omit<FinancialAccount, 'id' | 'lastUpdated'>) => void;
  deleteAccount: (id: string) => void;
  updateAccountBalance: (id: string, balance: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  toggleBillPaid: (id: string) => void;
  deleteBill: (id: string) => void;
  setMonthlyBudget: (budget: number) => void;

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
        {
          id: '4',
          title: 'Organize Apple Notes export',
          completed: true,
          priority: 'low',
          category: 'Personal',
          createdAt: new Date(),
          completedAt: new Date(),
        },
      ],

      emails: [
        {
          id: '1',
          from: 'American Express',
          subject: 'Statement ready',
          preview: 'Your January statement is now available.',
          timestamp: new Date(Date.now() - 7200000),
          read: false,
          priority: true,
          provider: 'gmail',
        },
        {
          id: '2',
          from: 'Delta Airlines',
          subject: 'Flight confirmed',
          preview: 'Your flight DL 1247 to Denver is confirmed.',
          timestamp: new Date(Date.now() - 18000000),
          read: false,
          priority: true,
          provider: 'gmail',
        },
        {
          id: '3',
          from: 'Adobe',
          subject: 'New Lightroom features',
          preview: 'Check out the latest Lightroom updates.',
          timestamp: new Date(Date.now() - 86400000),
          read: true,
          priority: false,
          provider: 'gmail',
        },
      ],
      accounts: [
        {
          id: '1',
          name: 'Monthly Budget',
          type: 'checking',
          balance: 4250,
          institution: 'Chase',
          lastUpdated: new Date(),
        },
        {
          id: '2',
          name: 'Savings Goal',
          type: 'savings',
          balance: 12840,
          institution: 'Marcus',
          lastUpdated: new Date(),
        },
        {
          id: '3',
          name: 'Credit Card',
          type: 'credit',
          balance: 1245,
          institution: 'Amex',
          lastUpdated: new Date(),
        },
        {
          id: '4',
          name: 'Investments',
          type: 'investment',
          balance: 28450,
          institution: 'Fidelity',
          lastUpdated: new Date(),
        },
      ],
      transactions: [
        { id: '1', amount: -64.50, category: 'Dining', description: 'Dinner at Zingerman\'s', date: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', amount: -129.99, category: 'Software', description: 'Adobe Creative Cloud', date: new Date(Date.now() - 172800000).toISOString() },
        { id: '3', amount: -42.00, category: 'Transport', description: 'Gas fill-up', date: new Date(Date.now() - 259200000).toISOString() },
        { id: '4', amount: -235.00, category: 'Shopping', description: 'Camera lens filter', date: new Date(Date.now() - 345600000).toISOString() },
        { id: '5', amount: 3200.00, category: 'Income', description: 'Client payment - portrait session', date: new Date(Date.now() - 432000000).toISOString() },
      ],
      bills: [
        { id: '1', name: 'Amex Statement', amount: 1245, dueDate: new Date(Date.now() + 172800000).toISOString(), recurring: true, paid: false },
        { id: '2', name: 'Rent', amount: 1850, dueDate: new Date(Date.now() + 604800000).toISOString(), recurring: true, paid: false },
        { id: '3', name: 'Internet - AT&T', amount: 79.99, dueDate: new Date(Date.now() + 864000000).toISOString(), recurring: true, paid: false },
        { id: '4', name: 'Car Insurance', amount: 142, dueDate: new Date(Date.now() + 1209600000).toISOString(), recurring: true, paid: false },
      ],
      monthlyBudget: 4250,
      trips: [
        {
          id: '1',
          destination: 'Denver, CO',
          startDate: '2025-03-15',
          endDate: '2025-03-19',
          flights: [
            {
              airline: 'Delta',
              flightNumber: 'DL 1247',
              departure: 'DTW',
              arrival: 'DEN',
            },
          ],
          accommodations: 'Marriott Downtown Denver',
          activities: ['Photography shoot', 'Red Rocks visit'],
        },
      ],
      
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
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: crypto.randomUUID(), lastUpdated: new Date() }],
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
      })),
      updateAccountBalance: (id, balance) => set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id
            ? { ...account, balance, lastUpdated: new Date() }
            : account
        ),
      })),
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: crypto.randomUUID() }, ...state.transactions],
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),
      addBill: (bill) => set((state) => ({
        bills: [...state.bills, { ...bill, id: crypto.randomUUID() }],
      })),
      toggleBillPaid: (id) => set((state) => ({
        bills: state.bills.map((b) => b.id === id ? { ...b, paid: !b.paid } : b),
      })),
      deleteBill: (id) => set((state) => ({
        bills: state.bills.filter((b) => b.id !== id),
      })),
      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

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
        transactions: state.transactions,
        bills: state.bills,
        monthlyBudget: state.monthlyBudget,
        trips: state.trips,
      }),
    }
  )
);
