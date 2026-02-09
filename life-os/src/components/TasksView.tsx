'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
  createdAt: string;
}

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

const initialTasks: Task[] = [
  { id: '1', title: 'Review Q1 photography portfolio', description: 'Go through all shots from January-March and select best for website', completed: false, priority: 'high', dueDate: 'Today', category: 'Work', createdAt: '2 days ago' },
  { id: '2', title: 'Pay Amex statement', description: 'Statement balance: $1,245.00 due by end of week', completed: false, priority: 'high', dueDate: 'Tomorrow', category: 'Finance', createdAt: '1 week ago' },
  { id: '3', title: 'Book Denver flight for March', description: 'Check Delta and United for best fares DTW → DEN', completed: false, priority: 'medium', dueDate: 'This week', category: 'Travel', createdAt: '3 days ago' },
  { id: '4', title: 'Organize Apple Notes export', description: 'Export and categorize all notes into Notion workspace', completed: true, priority: 'low', dueDate: 'Completed', category: 'Personal', createdAt: '1 week ago' },
  { id: '5', title: 'Update client contracts', description: 'Revise standard photography contract with new pricing', completed: false, priority: 'high', dueDate: 'This week', category: 'Work', createdAt: '5 days ago' },
  { id: '6', title: 'Schedule dentist appointment', description: 'Annual cleaning - check availability next month', completed: false, priority: 'low', dueDate: 'Next week', category: 'Personal', createdAt: '1 day ago' },
  { id: '7', title: 'Backup Lightroom catalog', description: 'Full backup to external SSD and cloud storage', completed: false, priority: 'medium', dueDate: 'This week', category: 'Work', createdAt: '4 days ago' },
  { id: '8', title: 'Review investment portfolio', description: 'Quarterly rebalance check with Fidelity account', completed: false, priority: 'medium', dueDate: 'Next week', category: 'Finance', createdAt: '2 days ago' },
  { id: '9', title: 'Send invoice to Martinez wedding', description: 'Final payment invoice for March wedding shoot', completed: true, priority: 'high', dueDate: 'Completed', category: 'Work', createdAt: '1 week ago' },
  { id: '10', title: 'Research new camera lens', description: 'Compare Sony 70-200mm f/2.8 GM II vs Sigma Art', completed: false, priority: 'low', dueDate: 'No date', category: 'Work', createdAt: '6 days ago' },
];

const categories = ['All', 'Work', 'Finance', 'Travel', 'Personal'];

const priorityConfig = {
  high: { color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: AlertCircle, label: 'High' },
  medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock, label: 'Medium' },
  low: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Circle, label: 'Low' },
};

export default function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'category'>('priority');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; priority: 'high' | 'medium' | 'low'; category: string; dueDate: string }>({ title: '', description: '', priority: 'medium', category: 'Personal', dueDate: '' });

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate || 'No date',
      category: newTask.category,
      createdAt: 'Just now',
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'Personal', dueDate: '' });
    setShowAddTask(false);
  };

  const filteredTasks = tasks
    .filter(t => {
      if (!showCompleted && t.completed) return false;
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

  const completedCount = tasks.filter(t => t.completed).length;
  const highPriorityCount = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const todayCount = tasks.filter(t => !t.completed && t.dueDate === 'Today').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            Tasks
          </h2>
          <p className="text-white/50 mt-1">{tasks.length - completedCount} remaining &middot; {completedCount} completed</p>
        </div>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
          <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
          <div className="relative space-y-4">
            <h3 className="font-semibold text-lg">New Task</h3>
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 text-sm"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select
                value={newTask.category}
                onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 text-sm"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Due date..."
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={addTask} className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 transition-colors font-medium text-sm">Create Task</button>
              <button onClick={() => setShowAddTask(false)} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Due Today', value: todayCount, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'High Priority', value: highPriorityCount, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Completed', value: completedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className="relative rounded-[1.5rem] p-4 overflow-hidden" style={glassStyle}>
            <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/50 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-500/30 text-violet-300 border border-violet-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
              showCompleted ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Show done
          </button>
          <div className="relative flex-shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-sm text-white/60 focus:outline-none"
            >
              <option value="priority">Sort: Priority</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="category">Sort: Category</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="relative rounded-[1.5rem] overflow-hidden" style={glassStyle}>
        <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
        <div className="relative divide-y divide-white/5">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No tasks match your filters</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const PriorityIcon = priorityConfig[task.priority].icon;
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 lg:px-6 transition-all hover:bg-white/5 group ${task.completed ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed ? 'bg-violet-500 border-violet-500' : 'border-white/30 hover:border-violet-400'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.completed ? 'line-through text-white/40' : ''}`}>{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-white/40 mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityConfig[task.priority].color}`}>
                        <PriorityIcon className="w-3 h-3" />
                        {priorityConfig[task.priority].label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/40">
                        <Tag className="w-3 h-3" />
                        {task.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/40">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
