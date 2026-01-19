'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  Wallet,
  Plane,
  Mail,
  Calendar,
  TrendingUp,
  Send,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Bell,
  Search,
  Settings,
  User,
  Sun,
  Moon,
  Target,
  Zap,
  Brain,
  Camera,
} from 'lucide-react';

// Types
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FinancialStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

// Main App Component
export default function LifeOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Good morning, Johnathon! I've reviewed your schedule for today. You have 3 priority tasks and 2 meetings. Your inbox has 12 new emails - I've flagged 3 as requiring immediate attention. Would you like me to brief you on anything specific?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review Q1 photography portfolio', completed: false, priority: 'high', dueDate: 'Today', category: 'Work' },
    { id: '2', title: 'Pay Amex statement', completed: false, priority: 'high', dueDate: 'Tomorrow', category: 'Finance' },
    { id: '3', title: 'Book Denver flight for March', completed: false, priority: 'medium', dueDate: 'This week', category: 'Travel' },
    { id: '4', title: 'Organize Apple Notes export', completed: true, priority: 'low', dueDate: 'Completed', category: 'Personal' },
    { id: '5', title: 'Update equipment inventory', completed: false, priority: 'medium', dueDate: 'Friday', category: 'Work' },
  ]);

  const financialStats: FinancialStat[] = [
    { label: 'Monthly Budget', value: '$4,250', change: '68% remaining', positive: true },
    { label: 'Savings Goal', value: '$12,840', change: '+$840 this month', positive: true },
    { label: 'Bills Due', value: '$1,245', change: '3 upcoming', positive: false },
    { label: 'Investments', value: '$28,450', change: '+2.4%', positive: true },
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm processing your request. In the full version, I'll be powered by Claude to help you manage tasks, triage emails, plan travel, and keep your life organized. What would you like to tackle first?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const priorityColors = {
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#12121a]/80 backdrop-blur-xl border-r border-white/5 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight">Life OS</h1>
              <p className="text-xs text-white/40">Your Personal Command Center</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
              { id: 'finances', icon: Wallet, label: 'Finances' },
              { id: 'travel', icon: Plane, label: 'Travel' },
              { id: 'email', icon: Mail, label: 'Email Hub' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'work', icon: Camera, label: 'Photography' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white/80 transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen relative">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-80 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
              </button>
              
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  chatOpen
                    ? 'bg-violet-500 text-white'
                    : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center font-semibold">
                J
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={`p-8 transition-all duration-300 ${chatOpen ? 'mr-96' : ''}`}>
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Johnathon</span>
            </h2>
            <p className="text-white/50">Here's what's happening with your life today.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: CheckSquare, label: 'Tasks Today', value: '5', sub: '2 completed' },
              { icon: Mail, label: 'Unread Emails', value: '12', sub: '3 priority' },
              { icon: Calendar, label: 'Events', value: '2', sub: 'Next: 2:00 PM' },
              { icon: Target, label: 'Goals Progress', value: '68%', sub: 'On track' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#12121a]/60 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-all">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-all" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
                <p className="text-xs text-violet-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="col-span-2 bg-[#12121a]/60 backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10">
                    <CheckSquare className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Today's Tasks</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all text-sm">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      task.completed
                        ? 'bg-white/5 border-white/5 opacity-50'
                        : 'bg-white/5 border-white/10 hover:border-violet-500/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-violet-500 border-violet-500'
                          : 'border-white/30 hover:border-violet-400'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-white/40' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-white/40 mt-1">{task.dueDate} • {task.category}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
                      <MoreHorizontal className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Overview */}
            <div className="bg-[#12121a]/60 backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Financial Overview</h3>
              </div>

              <div className="space-y-4">
                {financialStats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        stat.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all font-medium">
                View Full Report
              </button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Email Summary */}
            <div className="bg-[#12121a]/60 backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Email Summary</h3>
                <span className="ml-auto px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-medium">
                  3 Priority
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { from: 'American Express', subject: 'Your statement is ready', time: '2h ago', priority: true },
                  { from: 'Delta Airlines', subject: 'Flight confirmation: DEN → DTW', time: '5h ago', priority: true },
                  { from: 'Adobe Creative Cloud', subject: 'New features in Lightroom', time: '1d ago', priority: false },
                ].map((email, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${email.priority ? 'bg-rose-400' : 'bg-white/20'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{email.from}</p>
                      <p className="text-xs text-white/40 truncate">{email.subject}</p>
                    </div>
                    <p className="text-xs text-white/30">{email.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Travel */}
            <div className="bg-[#12121a]/60 backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold">Upcoming Travel</h3>
              </div>

              <div className="relative p-5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/50 mb-1">Next Trip</p>
                    <p className="text-lg font-bold">Denver, CO</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50 mb-1">Departure</p>
                    <p className="text-lg font-bold">Mar 15</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10">DL 1247</span>
                  <span className="text-white/50">DTW → DEN</span>
                  <span className="text-white/50">•</span>
                  <span className="text-white/50">3h 45m</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium">
                  View Itinerary
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all text-sm font-medium">
                  Plan Activities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Panel */}
        <div
          className={`fixed right-0 top-0 h-full w-96 bg-[#12121a]/95 backdrop-blur-xl border-l border-white/5 transform transition-transform duration-300 z-50 ${
            chatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Claude Assistant</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Online
                  </p>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-violet-500 text-white rounded-br-md'
                        : 'bg-white/10 text-white/90 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-white/40'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['Summarize emails', 'Plan my day', 'Check finances', 'Travel ideas'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInputValue(action)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs whitespace-nowrap transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
