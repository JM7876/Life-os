'use client';
import React, { useState, useMemo } from 'react';
import { useLifeOSStore } from '@/store/useLifeOSStore';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

const glassModal = {
  background: 'rgba(20, 10, 50, 0.85)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

function ShineOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
          opacity: 0.5,
          filter: 'blur(1px) brightness(115%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
    </>
  );
}

function ModalShine() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
          opacity: 0.5,
          filter: 'blur(1px) brightness(115%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-20 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
    </>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors";
const labelCls = "block text-xs text-white/50 mb-1.5";
const btnPrimary = "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 font-medium text-sm hover:from-violet-600 hover:to-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity";

const CATEGORIES = ['All', 'Work', 'Finance', 'Travel', 'Personal', 'Health'];
const SORT_OPTIONS = [
  { id: 'priority', label: 'Priority' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'category', label: 'Category' },
  { id: 'created', label: 'Created' },
] as const;

const priorityColors: Record<string, string> = {
  high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function TasksTab() {
  const { tasks, addTask, toggleTask, deleteTask } = useLifeOSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'category' | 'created'>('priority');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    category: 'Personal',
  });

  // Computed stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length;
    const overdue = tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    return { total, completed, highPriority, overdue };
  }, [tasks]);

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Completed filter
    if (!showCompleted) {
      filtered = filtered.filter(t => !t.completed);
    }

    // Sort
    filtered.sort((a, b) => {
      // Always put completed at the bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      switch (sortBy) {
        case 'priority':
          return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, selectedCategory, showCompleted, sortBy]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      category: newTask.category,
    });
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'Personal' });
    setShowAddTask(false);
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return 'This week';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const dueDateColor = (dateStr?: string) => {
    if (!dateStr) return 'text-white/30';
    const diffMs = new Date(dateStr).getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / 86400000);
    if (diffDays < 0) return 'text-rose-400';
    if (diffDays === 0) return 'text-amber-400';
    if (diffDays <= 2) return 'text-amber-400/70';
    return 'text-white/40';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Tasks</span>
          </h2>
          <p className="text-white/60 text-sm">Manage your to-dos and stay on track</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 font-medium text-sm hover:from-violet-600 hover:to-purple-600 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'text-violet-400', sub: `${stats.completed} completed` },
          { label: 'Completion', value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%', color: 'text-emerald-400', sub: `${stats.total - stats.completed} remaining` },
          { label: 'High Priority', value: stats.highPriority, color: 'text-rose-400', sub: 'Need attention' },
          { label: 'Overdue', value: stats.overdue, color: stats.overdue > 0 ? 'text-rose-400' : 'text-emerald-400', sub: stats.overdue > 0 ? 'Past due date' : 'All on track' },
        ].map((stat, i) => (
          <div key={i} className="relative rounded-[1.5rem] p-4 overflow-hidden" style={glassCard}>
            <ShineOverlay />
            <div className="relative">
              <p className="text-xs text-white/50 mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-xs text-white/50">{stats.completed} / {stats.total} tasks</p>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-[width] duration-500"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                    : 'border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Toggle Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Sort:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    sortBy === opt.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                showCompleted ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {showCompleted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
              {showCompleted ? 'Hide' : 'Show'} done
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && <span className="text-white/40 font-normal"> in {selectedCategory}</span>}
              {searchQuery && <span className="text-white/40 font-normal"> matching &quot;{searchQuery}&quot;</span>}
            </h3>
          </div>

          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-[border-color,opacity] group ${
                  task.completed
                    ? 'bg-white/[0.02] border-white/5 opacity-50'
                    : 'bg-white/5 border-white/10 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
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
                  <p className={`font-medium text-sm ${task.completed ? 'line-through text-white/40' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs mt-0.5 ${task.completed ? 'text-white/20' : 'text-white/40'}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {task.dueDate && (
                      <span className={`text-[10px] ${dueDateColor(task.dueDate)}`}>
                        {formatDueDate(task.dueDate)}
                      </span>
                    )}
                    <span className="text-[10px] text-white/20">{task.category}</span>
                  </div>
                </div>
                <span className={`hidden sm:block px-2.5 py-1 rounded-lg text-[10px] font-medium border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-white/0 group-hover:text-white/20 hover:!text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">
                  {searchQuery || selectedCategory !== 'All' ? 'No tasks match your filters' : 'No tasks yet'}
                </p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  + Create a task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowAddTask(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-[2rem] p-6 overflow-hidden" style={glassModal}>
              <ModalShine />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">New Task</h3>
                  <button onClick={() => setShowAddTask(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="What needs to be done?"
                      autoFocus
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Add details..."
                      rows={2}
                      className={inputCls + ' resize-none'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Priority</label>
                      <div className="flex gap-2">
                        {(['high', 'medium', 'low'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: p })}
                            className={`flex-1 px-2 py-2 rounded-xl text-xs font-medium border transition-colors ${
                              newTask.priority === p ? priorityColors[p] : 'border-white/10 text-white/40 hover:border-white/20'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className={inputCls + ' [color-scheme:dark]'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Category</label>
                    <div className="flex flex-wrap gap-2">
                      {['Personal', 'Work', 'Finance', 'Travel', 'Health'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewTask({ ...newTask, category: cat })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                            newTask.category === cat
                              ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                              : 'border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                    className={btnPrimary}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
