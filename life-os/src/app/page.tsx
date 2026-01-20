'use client';

import React, { useState, useRef, useEffect } from 'react';

// Icons as simple SVG components
const Icons = {
  LayoutDashboard: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  CheckSquare: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Wallet: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  Plane: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
  Mail: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Calendar: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Camera: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  Settings: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Sparkles: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  Brain: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Send: ({ className = "w-4 h-4" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Plus: ({ className = "w-4 h-4" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Bell: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Search: ({ className = "w-4 h-4" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevronRight: ({ className = "w-4 h-4" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>,
  Target: ({ className = "w-5 h-5" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Menu: ({ className = "w-6 h-6" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  X: ({ className = "w-6 h-6" }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
}

export default function LifeOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Good morning, Johnathon! I've reviewed your schedule for today. You have 3 priority tasks and 2 meetings. Would you like me to brief you on anything specific?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review Q1 photography portfolio', completed: false, priority: 'high', dueDate: 'Today', category: 'Work' },
    { id: '2', title: 'Pay Amex statement', completed: false, priority: 'high', dueDate: 'Tomorrow', category: 'Finance' },
    { id: '3', title: 'Book Denver flight for March', completed: false, priority: 'medium', dueDate: 'This week', category: 'Travel' },
    { id: '4', title: 'Organize Apple Notes export', completed: true, priority: 'low', dueDate: 'Completed', category: 'Personal' },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help you manage tasks, triage emails, plan travel, and keep your life organized. What would you like to tackle?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleTask = (id: string) => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));

  const priorityColors = {
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const navItems = [
    { id: 'dashboard', icon: Icons.LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: Icons.CheckSquare, label: 'Tasks' },
    { id: 'finances', icon: Icons.Wallet, label: 'Finances' },
    { id: 'travel', icon: Icons.Plane, label: 'Travel' },
    { id: 'email', icon: Icons.Mail, label: 'Email Hub' },
    { id: 'calendar', icon: Icons.Calendar, label: 'Calendar' },
    { id: 'work', icon: Icons.Camera, label: 'Photography' },
  ];

  const financialStats = [
    { label: 'Monthly Budget', value: '$4,250', change: '68% left', positive: true },
    { label: 'Savings Goal', value: '$12,840', change: '+$840', positive: true },
    { label: 'Bills Due', value: '$1,245', change: '3 upcoming', positive: false },
    { label: 'Investments', value: '$28,450', change: '+2.4%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      {/* Floating Glass Sidebar */}
      <aside 
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out ${
          sidebarOpen ? 'w-56' : 'w-16'
        }`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className={`
          h-auto py-4 px-2
          bg-white/5 backdrop-blur-2xl
          border border-white/10
          rounded-3xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
          transition-all duration-500 ease-out
          ${sidebarOpen ? 'shadow-[0_8px_40px_rgba(0,212,255,0.15),0_8px_32px_rgba(0,0,0,0.4)]' : ''}
        `}>
          {/* Logo */}
          <div className={`flex items-center gap-3 px-2 mb-6 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
              <Icons.Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <h1 className="font-bold text-sm tracking-tight whitespace-nowrap">Life OS</h1>
              <p className="text-[10px] text-white/40 whitespace-nowrap">Command Center</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group relative ${
                  activeTab === item.id
                    ? 'bg-white/10 text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                } ${sidebarOpen ? '' : 'justify-center'}`}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Settings */}
          <div className={`mt-6 pt-4 border-t border-white/5 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-all duration-300 ${sidebarOpen ? '' : 'justify-center'}`}>
              <Icons.Settings className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                Settings
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-24 min-h-screen relative">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 safe-top">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10">
              <Icons.Menu />
            </button>

            <div className="hidden md:block relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Icons.Search /></div>
              <input type="text" placeholder="Search..." className="w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <Icons.Bell />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
              </button>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  chatOpen ? 'bg-violet-500 text-white' : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                }`}
              >
                <Icons.Brain />
                <span className="hidden sm:inline">AI</span>
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center font-bold">J</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={`p-4 lg:p-6 transition-all duration-300 ${chatOpen ? 'lg:mr-96' : ''}`}>
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1">
              Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Johnathon</span>
            </h2>
            <p className="text-white/50">Here&apos;s what&apos;s happening today.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Icons.CheckSquare, label: 'Tasks', value: '5', sub: '2 done' },
              { icon: Icons.Mail, label: 'Emails', value: '12', sub: '3 priority' },
              { icon: Icons.Calendar, label: 'Events', value: '2', sub: 'Next: 2PM' },
              { icon: Icons.Target, label: 'Goals', value: '68%', sub: 'On track' },
            ].map((stat, i) => (
              <div key={i} className="liquid-glass rounded-2xl liquid-glass-hover p-4 hover:border-violet-500/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                    <stat.icon />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
                <p className="text-xs text-violet-400">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Tasks */}
            <div className="lg:col-span-2 liquid-glass rounded-2xl liquid-glass-hover p-4 lg:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400"><Icons.CheckSquare /></div>
                  <h3 className="font-semibold">Today&apos;s Tasks</h3>
                </div>
                <button className="p-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20">
                  <Icons.Plus />
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}>
                    <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-violet-500 border-violet-500' : 'border-white/30'}`}>
                      {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.completed ? 'line-through text-white/40' : ''}`}>{task.title}</p>
                      <p className="text-xs text-white/40">{task.dueDate} • {task.category}</p>
                    </div>
                    <span className={`hidden sm:block px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>{task.priority}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial */}
            <div className="liquid-glass rounded-2xl liquid-glass-hover p-4 lg:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><Icons.Wallet /></div>
                <h3 className="font-semibold">Finances</h3>
              </div>
              <div className="space-y-3">
                {financialStats.map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-white/50">{stat.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${stat.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{stat.change}</span>
                    </div>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="liquid-glass rounded-2xl liquid-glass-hover p-4 lg:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Icons.Mail /></div>
                <h3 className="font-semibold">Email</h3>
                <span className="ml-auto px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs">3 Priority</span>
              </div>
              <div className="space-y-2">
                {[
                  { from: 'American Express', subject: 'Statement ready', time: '2h', priority: true },
                  { from: 'Delta Airlines', subject: 'Flight confirmed', time: '5h', priority: true },
                  { from: 'Adobe', subject: 'New Lightroom features', time: '1d', priority: false },
                ].map((email, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.priority ? 'bg-rose-400' : 'bg-white/20'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{email.from}</p>
                      <p className="text-xs text-white/40 truncate">{email.subject}</p>
                    </div>
                    <p className="text-xs text-white/30">{email.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel */}
            <div className="lg:col-span-2 liquid-glass rounded-2xl liquid-glass-hover p-4 lg:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Icons.Plane /></div>
                <h3 className="font-semibold">Upcoming Travel</h3>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-white/50">Next Trip</p>
                    <p className="text-xl font-bold">Denver, CO</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Departure</p>
                    <p className="text-xl font-bold">Mar 15</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-2 py-1 rounded-lg bg-white/10">DL 1247</span>
                  <span className="text-white/50">DTW → DEN</span>
                  <span className="text-white/50">3h 45m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`fixed inset-0 lg:inset-auto lg:right-0 lg:top-0 lg:h-full lg:w-96 bg-[#12121a]/98 backdrop-blur-xl lg:border-l border-white/5 transform transition-transform duration-300 z-50 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full safe-top">
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Icons.Brain className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-semibold">Claude Assistant</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Online</p>
                </div>
                <button onClick={() => setChatOpen(false)} className="ml-auto p-2 rounded-lg hover:bg-white/10">
                  <Icons.X />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${message.role === 'user' ? 'bg-violet-500 text-white rounded-br-md' : 'bg-white/10 text-white/90 rounded-bl-md'}`}>
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {['Plan my day', 'Check emails', 'Finances'].map((action) => (
                  <button key={action} onClick={() => setInputValue(action)} className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm whitespace-nowrap">{action}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask anything..." className="flex-1 bg-transparent px-3 py-2 placeholder:text-white/30 focus:outline-none" />
                <button onClick={handleSendMessage} className="p-3 rounded-xl bg-violet-500 hover:bg-violet-600"><Icons.Send /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
