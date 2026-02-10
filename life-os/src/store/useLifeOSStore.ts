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
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  priority: boolean;
  archived: boolean;
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

export interface PackingItem {
  id: string;
  item: string;
  packed: boolean;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  flights: Flight[];
  accommodations?: string;
  activities: string[];
  notes?: string;
  packingList: PackingItem[];
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
  };
  theme: 'dark' | 'light';
  aiModel: 'haiku' | 'sonnet';
  notifications: {
    emailAlerts: boolean;
    taskReminders: boolean;
    billReminders: boolean;
    travelAlerts: boolean;
  };
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
  settings: UserSettings;
  
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
  toggleEmailRead: (id: string) => void;
  markEmailPriority: (id: string, priority: boolean) => void;
  archiveEmail: (id: string) => void;
  unarchiveEmail: (id: string) => void;
  
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
  deleteTrip: (id: string) => void;
  addPackingItem: (tripId: string, item: string) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;

  // Settings actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateNotifications: (updates: Partial<UserSettings['notifications']>) => void;
  updateProfile: (updates: Partial<UserSettings['profile']>) => void;
  clearAllData: () => void;
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
          id: 'e1',
          from: 'American Express',
          fromEmail: 'alerts@americanexpress.com',
          subject: 'Your January statement is ready',
          preview: 'Your January statement is now available for review.',
          body: 'Dear Johnathon,\n\nYour January statement is now available. Your current balance is $1,245.00. Payment is due by February 15, 2025.\n\nStatement Period: January 1 - January 31, 2025\nNew Balance: $1,245.00\nMinimum Payment Due: $35.00\nPayment Due Date: February 15, 2025\n\nPlease log in to your account to view the full statement and make a payment.\n\nThank you for being a valued Card Member.\n\nAmerican Express',
          timestamp: new Date(Date.now() - 3600000),
          read: false,
          priority: true,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e2',
          from: 'Delta Airlines',
          fromEmail: 'noreply@delta.com',
          subject: 'Flight DL 1247 to Denver confirmed',
          preview: 'Your flight DL 1247 to Denver is confirmed for March 15.',
          body: 'Hi Johnathon,\n\nYour upcoming flight is confirmed!\n\nFlight: DL 1247\nDate: March 15, 2025\nDeparture: DTW 8:30 AM\nArrival: DEN 10:45 AM\nSeat: 14A (Window)\nClass: Main Cabin\n\nCheck-in opens 24 hours before departure. You can manage your booking through the Delta app or at delta.com.\n\nWe look forward to welcoming you on board!\n\nDelta Air Lines',
          timestamp: new Date(Date.now() - 7200000),
          read: false,
          priority: true,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e3',
          from: 'Sarah Chen',
          fromEmail: 'sarah.chen@designstudio.com',
          subject: 'Re: Portrait session next week',
          preview: 'Sounds great! Tuesday at 2pm works perfectly.',
          body: 'Hi Johnathon,\n\nSounds great! Tuesday at 2pm works perfectly for the portrait session. I was thinking we could shoot at the park downtown or at my studio space on Main St.\n\nDo you have a preference? I can bring a few outfit changes if we go with the outdoor location.\n\nAlso, do you need me to sign a model release form before the session?\n\nLooking forward to it!\n\nBest,\nSarah',
          timestamp: new Date(Date.now() - 14400000),
          read: false,
          priority: false,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e4',
          from: 'Adobe Creative Cloud',
          fromEmail: 'mail@adobe.com',
          subject: 'New Lightroom AI features available',
          preview: 'Check out the latest AI-powered editing tools in Lightroom.',
          body: 'Hi Johnathon,\n\nExciting news! We have launched new AI-powered features in Adobe Lightroom:\n\n- Generative Remove: Seamlessly remove unwanted objects\n- AI Denoise: Dramatically reduce noise in high ISO images\n- Lens Blur: Add realistic depth of field effects\n- Auto Color Grading: Intelligent color matching\n\nThese features are available now in your Creative Cloud subscription. Update Lightroom to the latest version to get started.\n\nHappy editing!\nThe Adobe Team',
          timestamp: new Date(Date.now() - 86400000),
          read: true,
          priority: false,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e5',
          from: 'Chase Bank',
          fromEmail: 'no-reply@chase.com',
          subject: 'Your direct deposit has arrived',
          preview: 'A direct deposit of $3,200.00 has been posted to your account.',
          body: 'Dear Johnathon Moulds,\n\nA direct deposit has been posted to your Chase Total Checking account.\n\nAmount: $3,200.00\nFrom: Portrait Studio LLC\nDate: Today\nAvailable Balance: $4,250.00\n\nLog in to Chase.com or the Chase Mobile app to view your account details.\n\nChase Bank',
          timestamp: new Date(Date.now() - 108000000),
          read: true,
          priority: true,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e6',
          from: 'Marcus by Goldman Sachs',
          fromEmail: 'alerts@marcus.com',
          subject: 'Your savings goal update',
          preview: 'You are 85% toward your $15,000 savings goal.',
          body: 'Hi Johnathon,\n\nGreat progress on your savings goal!\n\nGoal: Emergency Fund\nTarget: $15,000.00\nCurrent Balance: $12,840.00\nProgress: 85.6%\n\nAt your current savings rate, you are on track to reach your goal by April 2025. Keep it up!\n\nYour current APY: 4.40%\nInterest earned this month: $47.08\n\nMarcus by Goldman Sachs',
          timestamp: new Date(Date.now() - 172800000),
          read: true,
          priority: false,
          archived: false,
          provider: 'outlook',
        },
        {
          id: 'e7',
          from: 'Mike Torres',
          fromEmail: 'mike.t@gmail.com',
          subject: 'Denver trip - restaurant recommendations',
          preview: 'Hey! Here are some spots you should check out in Denver.',
          body: 'Hey Johnathon!\n\nHeard you are heading to Denver next month. Here are some places you absolutely need to check out:\n\n1. Guard and Grace - Amazing steakhouse downtown\n2. Linger - Great rooftop views and eclectic menu\n3. Denver Biscuit Company - Must-try for breakfast\n4. Ratio Beerworks - Best local brewery\n5. Snooze AM Eatery - Weekend brunch spot\n\nAlso, if you get a chance, drive up to Lookout Mountain for some incredible shots. The light is amazing at golden hour.\n\nHave a great trip!\nMike',
          timestamp: new Date(Date.now() - 259200000),
          read: true,
          priority: false,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e8',
          from: 'Marriott Bonvoy',
          fromEmail: 'reservation@marriott.com',
          subject: 'Reservation confirmation - Denver Downtown',
          preview: 'Your reservation at Marriott Downtown Denver is confirmed.',
          body: 'Dear Johnathon Moulds,\n\nYour reservation has been confirmed!\n\nHotel: Marriott Downtown Denver\nConfirmation #: MRR-8847291\nCheck-in: March 15, 2025 (3:00 PM)\nCheck-out: March 19, 2025 (11:00 AM)\nRoom Type: King, City View\nRate: $189/night\n\nBonvoy Points Earned: 1,512 points\n\nSpecial Requests: Late check-out if available\n\nWe look forward to welcoming you!\n\nMarriott Bonvoy',
          timestamp: new Date(Date.now() - 345600000),
          read: true,
          priority: false,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e9',
          from: 'GitHub',
          fromEmail: 'notifications@github.com',
          subject: '[Life-os] Pull request merged: #4',
          preview: 'Pull request #4 has been merged into main.',
          body: 'JM7876 merged pull request #4 in JM7876/Life-os\n\nWire up real Claude AI chat via useChat hook\n\nMerged by: JM7876\nBranch: claude/quizzical-buck -> main\nCommits: 3\nFiles changed: 5\n\nView on GitHub: https://github.com/JM7876/Life-os/pull/4',
          timestamp: new Date(Date.now() - 432000000),
          read: true,
          priority: false,
          archived: false,
          provider: 'outlook',
        },
        {
          id: 'e10',
          from: 'AT&T',
          fromEmail: 'att-billing@att.com',
          subject: 'Your bill is ready - $79.99',
          preview: 'Your AT&T Internet bill for this month is ready.',
          body: 'Hi Johnathon,\n\nYour AT&T bill is ready.\n\nAccount: ***4821\nBill Period: Jan 10 - Feb 9, 2025\nAmount Due: $79.99\nDue Date: February 25, 2025\n\nService: AT&T Fiber Internet 500\nMonthly Charge: $79.99\n\nPay online at att.com/pay or through the myAT&T app.\n\nThank you for choosing AT&T.',
          timestamp: new Date(Date.now() - 518400000),
          read: true,
          priority: false,
          archived: false,
          provider: 'gmail',
        },
        {
          id: 'e11',
          from: 'Fidelity Investments',
          fromEmail: 'alerts@fidelity.com',
          subject: 'Weekly portfolio summary',
          preview: 'Your portfolio gained 2.4% this week.',
          body: 'Hi Johnathon,\n\nHere is your weekly portfolio summary:\n\nTotal Value: $28,450.00\nWeekly Change: +$667.20 (+2.4%)\nYTD Return: +8.7%\n\nTop Performers:\n- AAPL: +4.1%\n- MSFT: +3.2%\n- VOO: +2.1%\n\nMarket Summary: Markets rallied this week on strong earnings reports and positive economic data.\n\nLog in to Fidelity.com to view your full portfolio.\n\nFidelity Investments',
          timestamp: new Date(Date.now() - 604800000),
          read: true,
          priority: false,
          archived: false,
          provider: 'outlook',
        },
        {
          id: 'e12',
          from: 'Spotify',
          fromEmail: 'no-reply@spotify.com',
          subject: 'Your 2024 Wrapped is here!',
          preview: 'See your top artists, songs, and listening stats for 2024.',
          body: 'Hey Johnathon,\n\nYour 2024 Spotify Wrapped is ready!\n\nYour Top Artists:\n1. Khruangbin\n2. Tame Impala\n3. Tycho\n4. Bonobo\n5. Nils Frahm\n\nTotal Minutes Listened: 32,847\nTop Genre: Electronic / Ambient\nListening Personality: The Curator\n\nCheck out your full Wrapped experience in the Spotify app.\n\nThanks for listening!\nSpotify',
          timestamp: new Date(Date.now() - 864000000),
          read: true,
          priority: false,
          archived: true,
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
              departureTime: '08:30',
              arrivalTime: '10:45',
            },
          ],
          accommodations: 'Marriott Downtown Denver',
          activities: ['Photography shoot', 'Red Rocks visit'],
          notes: 'Bring wide-angle lens for landscape shots',
          packingList: [
            { id: 'p1', item: 'Camera body + lenses', packed: false },
            { id: 'p2', item: 'Tripod', packed: false },
            { id: 'p3', item: 'Laptop + charger', packed: true },
            { id: 'p4', item: 'Warm jacket', packed: false },
          ],
        },
      ],
      settings: {
        profile: {
          name: 'Johnathon Moulds',
          email: 'johnathon@lifeos.app',
        },
        theme: 'dark',
        aiModel: 'sonnet',
        notifications: {
          emailAlerts: true,
          taskReminders: true,
          billReminders: true,
          travelAlerts: true,
        },
      },

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

      toggleEmailRead: (id) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, read: !email.read } : email
        ),
      })),

      markEmailPriority: (id, priority) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, priority } : email
        ),
      })),

      archiveEmail: (id) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, archived: true } : email
        ),
      })),

      unarchiveEmail: (id) => set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, archived: false } : email
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

      deleteTrip: (id) => set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
      })),

      addPackingItem: (tripId, item) => set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId
            ? { ...trip, packingList: [...trip.packingList, { id: crypto.randomUUID(), item, packed: false }] }
            : trip
        ),
      })),

      togglePackingItem: (tripId, itemId) => set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId
            ? { ...trip, packingList: trip.packingList.map((p) => p.id === itemId ? { ...p, packed: !p.packed } : p) }
            : trip
        ),
      })),

      deletePackingItem: (tripId, itemId) => set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId
            ? { ...trip, packingList: trip.packingList.filter((p) => p.id !== itemId) }
            : trip
        ),
      })),

      // Settings Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),

      updateNotifications: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          notifications: { ...state.settings.notifications, ...updates },
        },
      })),

      updateProfile: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          profile: { ...state.settings.profile, ...updates },
        },
      })),

      clearAllData: () => set({
        tasks: [],
        emails: [],
        accounts: [],
        transactions: [],
        bills: [],
        monthlyBudget: 0,
        trips: [],
      }),
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
        settings: state.settings,
      }),
    }
  )
);
