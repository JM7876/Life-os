'use client';

import React, { useState } from 'react';
import {
  Camera,
  FolderOpen,
  Users,
  DollarSign,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckSquare,
  FileText,
  Image,
  Briefcase,
  Target,
  Wrench,
  BookOpen,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Tag,
  Star,
  Edit3,
  Trash2,
  ExternalLink,
} from 'lucide-react';

// Import data from JSON file
import boardData from '@/data/photography-board.json';

// Types
interface Project {
  id: string;
  name: string;
  type: 'commercial' | 'portrait' | 'wedding' | 'product' | 'event';
  client: string;
  status: 'planning' | 'shooting' | 'editing' | 'delivered';
  startDate: string;
  endDate: string;
  location: string;
  deliverables: string;
  budget: number;
}

interface Task {
  id: string;
  title: string;
  project: string;
  status: 'not-started' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
}

interface Client {
  id: string;
  name: string;
  type: 'wedding-couple' | 'brand' | 'individual' | 'agency' | 'commercial' | 'portrait' | 'wedding';
  email: string;
  phone: string;
  totalProjects: number;
}

interface Collaborator {
  id: string;
  name: string;
  role: 'model' | 'videographer' | 'agency' | 'makeup-artist' | 'assistant' | 'stylist' | 'second-shooter' | 'retoucher';
  rate: number;
  email: string;
}

interface GearItem {
  id: string;
  name: string;
  category: 'camera' | 'lens' | 'lighting' | 'accessory' | 'audio' | 'drone';
  purchaseDate: string;
  value: number;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  notes?: string;
}

interface Expense {
  id: string;
  name: string;
  type: 'equipment' | 'software' | 'studio-rental' | 'travel' | 'props' | 'subscription' | 'rental' | 'contractor';
  amount: number;
  date: string;
  notes: string;
  recurring?: boolean;
}

// Transform JSON data to match component interfaces
const transformProjects = (): Project[] => {
  return boardData.projects.map(p => ({
    id: p.id,
    name: p.name,
    type: p.type as Project['type'],
    client: p.client.name,
    status: p.status as Project['status'],
    startDate: p.startDate,
    endDate: p.endDate,
    location: p.location,
    deliverables: p.deliverables.join(', '),
    budget: p.budget,
  }));
};

const transformTasks = (): Task[] => {
  return boardData.cards.map(card => ({
    id: card.id,
    title: card.title,
    project: card.project.name,
    status: card.listId.replace('list-', '') as Task['status'],
    priority: card.priority as Task['priority'],
    dueDate: new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));
};

const transformClients = (): Client[] => {
  return boardData.clients.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type as Client['type'],
    email: c.email,
    phone: c.phone,
    totalProjects: c.totalProjects,
  }));
};

const transformCollaborators = (): Collaborator[] => {
  return boardData.collaborators.map(c => ({
    id: c.id,
    name: c.name,
    role: c.role as Collaborator['role'],
    rate: c.rate,
    email: c.email,
  }));
};

const transformGear = (): GearItem[] => {
  return boardData.equipment.map(g => ({
    id: g.id,
    name: g.name,
    category: g.category as GearItem['category'],
    purchaseDate: g.purchaseDate,
    value: g.value,
    condition: g.condition as GearItem['condition'],
    notes: g.notes,
  }));
};

const transformExpenses = (): Expense[] => {
  return boardData.finances.expenses.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type as Expense['type'],
    amount: e.amount,
    date: e.date,
    notes: e.notes,
    recurring: e.recurring,
  }));
};

// Use transformed data from JSON
const sampleProjects: Project[] = transformProjects();
const sampleTasks: Task[] = transformTasks();
const sampleClients: Client[] = transformClients();
const sampleCollaborators: Collaborator[] = transformCollaborators();
const sampleGear: GearItem[] = transformGear();
const sampleExpenses: Expense[] = transformExpenses();

// Utility Components
const StatusBadge = ({ status, type = 'status' }: { status: string; type?: 'status' | 'type' | 'priority' | 'role' | 'condition' }) => {
  const getColors = () => {
    if (type === 'type') {
      switch (status) {
        case 'commercial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'portrait': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case 'wedding': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'product': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'event': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
    if (type === 'status') {
      switch (status) {
        case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'shooting': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'editing': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'delivered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'not-started': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'done': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
    if (type === 'priority') {
      switch (status) {
        case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
    if (type === 'role') {
      switch (status) {
        case 'model': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case 'videographer': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
        case 'agency': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
        case 'makeup-artist': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        case 'assistant': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'stylist': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
    if (type === 'condition') {
      switch (status) {
        case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'good': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'needs-repair': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border capitalize ${getColors()}`}>
      {status.replace('-', ' ')}
    </span>
  );
};

// Navigation Item Component
const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  children,
  expanded,
  onToggle
}: { 
  icon?: any; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  children?: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const hasChildren = !!children;
  
  return (
    <div>
      <button
        onClick={hasChildren ? onToggle : onClick}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
          active 
            ? 'bg-violet-500/20 text-violet-300' 
            : 'text-white/60 hover:bg-white/5 hover:text-white/80'
        }`}
      >
        {hasChildren && (
          <span className="w-4 h-4 flex items-center justify-center">
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {Icon && <Icon className="w-4 h-4" />}
        <span className="flex-1 text-left">{label}</span>
      </button>
      {hasChildren && expanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task }: { task: Task }) => (
  <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-sm text-white/90 font-medium leading-tight">{task.title}</h4>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4 text-white/40" />
      </button>
    </div>
    <p className="text-xs text-white/40 mb-2">{task.project}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/40">{task.dueDate}</span>
      <StatusBadge status={task.priority} type="priority" />
    </div>
  </div>
);

// Main Photography Module Component
export default function PhotographyModule() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedNav, setExpandedNav] = useState<Record<string, boolean>>({
    projects: true,
    clients: false,
    content: false,
    finance: false,
    goals: false,
    gear: false,
  });

  const toggleNav = (key: string) => {
    setExpandedNav(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tasksByStatus = {
    'not-started': sampleTasks.filter(t => t.status === 'not-started'),
    'in-progress': sampleTasks.filter(t => t.status === 'in-progress'),
    'review': sampleTasks.filter(t => t.status === 'review'),
    'done': sampleTasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="min-h-screen text-white flex relative">
      {/* Vibrant Gradient Background for Liquid Glass */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #1a1a4e 75%, #2d1b4e 100%)'
          }}
        />
        {/* Flowing wave 1 - cyan/blue */}
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[150%] h-[80%] opacity-60"
          style={{
            background: 'radial-gradient(ellipse at 30% 80%, #00d4ff 0%, #0066ff 30%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Flowing wave 2 - purple/violet */}
        <div
          className="absolute top-0 right-0 w-[80%] h-[100%] opacity-50"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, #a855f7 0%, #7c3aed 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Flowing wave 3 - amber/orange for photography theme */}
        <div
          className="absolute top-1/4 left-1/3 w-[60%] h-[60%] opacity-35"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #fbbf24 0%, #f97316 50%, transparent 80%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Accent glow - pink */}
        <div
          className="absolute bottom-1/3 right-1/4 w-[40%] h-[40%] opacity-30"
          style={{
            background: 'radial-gradient(circle, #f0abfc 0%, #c026d3 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Sidebar Navigation - Apple Liquid Glass */}
      <aside
        className="w-64 flex flex-col relative z-10 m-4 mr-0 rounded-[2rem] overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px) saturate(180%)',
          WebkitBackdropFilter: 'blur(4px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
            opacity: 0.5,
            filter: 'blur(1px) brightness(115%)',
          }}
        />
        {/* Top shine highlight */}
        <div className="absolute inset-x-0 top-0 h-20 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
        <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">Photographer OS</h1>
              <p className="text-xs text-white/40">Your Creative Hub</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Quick Actions</p>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-all text-sm">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Navigation</p>
          
          <NavItem 
            icon={FolderOpen} 
            label="Photography Projects" 
            expanded={expandedNav.projects}
            onToggle={() => toggleNav('projects')}
          >
            <NavItem label="Projects" active={activeSection === 'projects'} onClick={() => setActiveSection('projects')} />
            <NavItem label="Tasks" active={activeSection === 'tasks'} onClick={() => setActiveSection('tasks')} />
            <NavItem label="Assets & Resources" onClick={() => setActiveSection('assets')} />
            <NavItem label="Shoot Plans" onClick={() => setActiveSection('shoots')} />
          </NavItem>

          <NavItem 
            icon={Users} 
            label="Clients" 
            expanded={expandedNav.clients}
            onToggle={() => toggleNav('clients')}
          >
            <NavItem label="Contacts" active={activeSection === 'clients'} onClick={() => setActiveSection('clients')} />
            <NavItem label="Contracts & Proposals" onClick={() => setActiveSection('contracts')} />
            <NavItem label="Invoices & Payments" onClick={() => setActiveSection('invoices')} />
            <NavItem label="Collaborators" active={activeSection === 'collaborators'} onClick={() => setActiveSection('collaborators')} />
          </NavItem>

          <NavItem 
            icon={Image} 
            label="Content & Portfolio" 
            expanded={expandedNav.content}
            onToggle={() => toggleNav('content')}
          >
            <NavItem label="Content Calendar" onClick={() => setActiveSection('calendar')} />
            <NavItem label="Ideas & Inspiration" onClick={() => setActiveSection('ideas')} />
            <NavItem label="Portfolio & Case Studies" onClick={() => setActiveSection('portfolio')} />
          </NavItem>

          <NavItem 
            icon={DollarSign} 
            label="Business & Finance" 
            expanded={expandedNav.finance}
            onToggle={() => toggleNav('finance')}
          >
            <NavItem label="Expenses" active={activeSection === 'expenses'} onClick={() => setActiveSection('expenses')} />
            <NavItem label="Income" onClick={() => setActiveSection('income')} />
            <NavItem label="Subscriptions & Tools" onClick={() => setActiveSection('subscriptions')} />
          </NavItem>

          <NavItem 
            icon={Target} 
            label="Goals & Productivity" 
            expanded={expandedNav.goals}
            onToggle={() => toggleNav('goals')}
          >
            <NavItem label="Goals" onClick={() => setActiveSection('goals')} />
            <NavItem label="Daily Planner" onClick={() => setActiveSection('planner')} />
            <NavItem label="Habit Tracker" onClick={() => setActiveSection('habits')} />
          </NavItem>

          <NavItem 
            icon={Wrench} 
            label="Equipment & Gear Hub" 
            expanded={expandedNav.gear}
            onToggle={() => toggleNav('gear')}
          >
            <NavItem label="Equipment Inventory" active={activeSection === 'gear'} onClick={() => setActiveSection('gear')} />
            <NavItem label="Maintenance Log" onClick={() => setActiveSection('maintenance')} />
          </NavItem>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-white/5">
          <NavItem icon={Settings} label="Settings" onClick={() => setActiveSection('settings')} />
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 p-4 pl-4">
        {/* Hero Banner - Apple Liquid Glass */}
        <div
          className="relative h-48 rounded-[2rem] overflow-hidden mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px) saturate(180%)',
            WebkitBackdropFilter: 'blur(4px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
              opacity: 0.5,
              filter: 'blur(1px) brightness(115%)',
            }}
          />
          {/* Top shine highlight */}
          <div className="absolute inset-x-0 top-0 h-20 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
          {/* Gradient overlay for photography theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-[2rem]" />
          <div className="absolute bottom-6 left-6 flex items-center gap-4 relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Photographer OS</h1>
              <p className="text-white/60 text-sm">Manage your shoots, clients & creativity</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Active Tasks - Kanban Board */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold">Active Tasks</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> By Status
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Calendar
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Not Started Column - Apple Liquid Glass */}
              <div
                className="relative rounded-[1.5rem] p-4 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Shine effect */}
                <div
                  className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
                    opacity: 0.5,
                    filter: 'blur(1px) brightness(115%)',
                  }}
                />
                {/* Top shine highlight */}
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <h3 className="text-sm font-medium text-white/80">Not Started</h3>
                  <span className="text-xs text-white/40 ml-auto">{tasksByStatus['not-started'].length}</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus['not-started'].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <button className="w-full py-2 text-xs text-white/40 hover:text-white/60 flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> New Item
                  </button>
                </div>
                </div>
              </div>

              {/* In Progress Column - Apple Liquid Glass */}
              <div
                className="relative rounded-[1.5rem] p-4 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
                    opacity: 0.5,
                    filter: 'blur(1px) brightness(115%)',
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="text-sm font-medium text-white/80">In Progress</h3>
                  <span className="text-xs text-white/40 ml-auto">{tasksByStatus['in-progress'].length}</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus['in-progress'].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <button className="w-full py-2 text-xs text-white/40 hover:text-white/60 flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> New Item
                  </button>
                </div>
                </div>
              </div>

              {/* Review Column - Apple Liquid Glass */}
              <div
                className="relative rounded-[1.5rem] p-4 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
                    opacity: 0.5,
                    filter: 'blur(1px) brightness(115%)',
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-sm font-medium text-white/80">Review</h3>
                  <span className="text-xs text-white/40 ml-auto">{tasksByStatus['review'].length}</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus['review'].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <button className="w-full py-2 text-xs text-white/40 hover:text-white/60 flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> New Item
                  </button>
                </div>
                </div>
              </div>

              {/* Done Column - Apple Liquid Glass */}
              <div
                className="relative rounded-[1.5rem] p-4 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
                    opacity: 0.5,
                    filter: 'blur(1px) brightness(115%)',
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-medium text-white/80">Done</h3>
                  <span className="text-xs text-white/40 ml-auto">{tasksByStatus['done'].length}</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus['done'].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <button className="w-full py-2 text-xs text-white/40 hover:text-white/60 flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> New Item
                  </button>
                </div>
                </div>
              </div>
            </div>
          </section>

          {/* Active Projects Table */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-semibold">Active Projects</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60">All Projects</button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60">Project Pipeline</button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60">Calendar</button>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>
            </div>

            <div
              className="relative rounded-[1.5rem] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(4px) saturate(180%)',
                WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
              }}
            >
              <div
                className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
                  opacity: 0.5,
                  filter: 'blur(1px) brightness(115%)',
                }}
              />
              <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
              <table className="w-full relative">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Client</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Start Date</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">End Date</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Location</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Deliverables</th>
                    <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProjects.map((project) => (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm text-white/90">{project.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={project.type} type="type" /></td>
                      <td className="px-4 py-3 text-sm text-white/60">{project.client}</td>
                      <td className="px-4 py-3"><StatusBadge status={project.status} type="status" /></td>
                      <td className="px-4 py-3 text-sm text-white/60">{project.startDate}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{project.endDate}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{project.location}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{project.deliverables}</td>
                      <td className="px-4 py-3 text-sm text-white/60">${project.budget.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3">
                <button className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New Item
                </button>
              </div>
            </div>
          </section>

          {/* Two Column Layout: Clients & Collaborators */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Active Clients */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <h2 className="text-lg font-semibold">Active Clients</h2>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              <div
                className="relative rounded-[1.5rem] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none" style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)', opacity: 0.5, filter: 'blur(1px) brightness(115%)' }} />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <table className="w-full relative">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Name</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Email</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleClients.map((client) => (
                      <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-sm text-white/90">{client.name}</td>
                        <td className="px-4 py-3"><StatusBadge status={client.type} type="type" /></td>
                        <td className="px-4 py-3 text-sm text-white/60">{client.email}</td>
                        <td className="px-4 py-3 text-sm text-white/60">{client.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Collaborators */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold">Collaborators</h2>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {sampleCollaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="relative rounded-[1.25rem] p-4 overflow-hidden transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none" style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)', opacity: 0.5, filter: 'blur(1px) brightness(115%)' }} />
                    <div className="absolute inset-x-0 top-0 h-10 rounded-t-[1.25rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                    <div className="relative">
                      <StatusBadge status={collab.role} type="role" />
                      <h4 className="text-sm font-medium text-white/90 mt-2">{collab.name}</h4>
                      <p className="text-xs text-white/40">${collab.rate}/session</p>
                      <p className="text-xs text-white/40 mt-1 truncate">{collab.email}</p>
                      <button className="mt-3 text-xs text-violet-400 hover:text-violet-300">+ New Item</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Two Column Layout: Finances & Gear */}
          <div className="grid grid-cols-2 gap-6">
            {/* This Month Finances */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold">This Month Finances</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60">All Expenses</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60">All Income</button>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              <div
                className="relative rounded-[1.5rem] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none" style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)', opacity: 0.5, filter: 'blur(1px) brightness(115%)' }} />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <table className="w-full relative">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Name</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Amount</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Date</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-sm text-white/90">{expense.name}</td>
                        <td className="px-4 py-3"><StatusBadge status={expense.type} type="type" /></td>
                        <td className="px-4 py-3 text-sm text-white/60">${expense.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-white/60">{expense.date}</td>
                        <td className="px-4 py-3 text-sm text-white/40 truncate max-w-[200px]">{expense.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Equipment & Gear */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold">Equipment Inventory</h2>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-xs text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              <div
                className="relative rounded-[1.5rem] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none" style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)', opacity: 0.5, filter: 'blur(1px) brightness(115%)' }} />
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <table className="w-full relative">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Name</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Category</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Value</th>
                      <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleGear.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-sm text-white/90">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-white/60 capitalize">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-white/60">${item.value.toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={item.condition} type="condition" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
