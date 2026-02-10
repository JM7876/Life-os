'use client';
import React, { useState } from 'react';
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

const AI_MODELS = [
  {
    id: 'haiku' as const,
    name: 'Claude Haiku',
    desc: 'Fast responses, lower cost',
    speed: 'Lightning fast',
    cost: '~$0.50/mo',
    color: 'from-cyan-400 to-blue-500',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'sonnet' as const,
    name: 'Claude Sonnet',
    desc: 'Balanced quality and speed',
    speed: 'Fast',
    cost: '~$3.00/mo',
    color: 'from-violet-400 to-purple-500',
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  },
];

export default function SettingsTab() {
  const {
    settings,
    updateSettings,
    updateNotifications,
    updateProfile,
    clearAllData,
    tasks, emails, accounts, transactions, bills, trips,
  } = useLifeOSStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      tasks,
      emails,
      accounts,
      transactions,
      bills,
      trips,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-os-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  const dataStats = [
    { label: 'Tasks', count: tasks.length, color: 'text-violet-400' },
    { label: 'Emails', count: emails.length, color: 'text-blue-400' },
    { label: 'Accounts', count: accounts.length, color: 'text-emerald-400' },
    { label: 'Transactions', count: transactions.length, color: 'text-amber-400' },
    { label: 'Bills', count: bills.length, color: 'text-rose-400' },
    { label: 'Trips', count: trips.length, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Settings</span>
        </h2>
        <p className="text-white/60 text-sm">Manage your profile, preferences, and data</p>
      </div>

      {/* Profile Section */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">
              {settings.profile.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-lg">{settings.profile.name}</p>
              <p className="text-sm text-white/50">{settings.profile.email}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Display Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </div>
            <h3 className="font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-white/40">Use dark theme across the app</p>
            </div>
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                settings.theme === 'dark'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                  : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  settings.theme === 'dark' ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
          {settings.theme === 'light' && (
            <p className="text-xs text-amber-400/80 mt-3 bg-amber-500/10 rounded-xl px-3 py-2">
              Light mode is coming soon. The app currently uses dark theme only.
            </p>
          )}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </div>
            <h3 className="font-semibold">Integrations</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Gmail', desc: 'Sync your email inbox', icon: 'M', color: 'bg-red-500/20 text-red-400', connected: false },
              { name: 'Google Calendar', desc: 'Sync your calendar events', icon: 'G', color: 'bg-blue-500/20 text-blue-400', connected: false },
              { name: 'Plaid', desc: 'Connect bank accounts securely', icon: 'P', color: 'bg-emerald-500/20 text-emerald-400', connected: false },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${integration.color}`}>
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{integration.name}</p>
                  <p className="text-xs text-white/40">{integration.desc}</p>
                </div>
                <a
                  href="/integrations"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/60 hover:border-violet-500/30 hover:text-violet-400 transition-all"
                >
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Model Preference */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            </div>
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <p className="text-xs text-white/50 mb-4">Choose the model that powers your AI assistant</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => updateSettings({ aiModel: model.id })}
                className={`relative p-4 rounded-xl text-left transition-all duration-300 ${
                  settings.aiModel === model.id
                    ? 'bg-white/10 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                {settings.aiModel === model.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-3`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <p className="font-semibold text-sm mb-0.5">{model.name}</p>
                <p className="text-xs text-white/40 mb-3">{model.desc}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${model.badge}`}>{model.speed}</span>
                  <span className="text-[10px] text-white/30">{model.cost}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <h3 className="font-semibold">Notifications</h3>
            <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full ml-auto">Placeholder</span>
          </div>
          <div className="space-y-4">
            {([
              { key: 'emailAlerts' as const, label: 'Email Alerts', desc: 'Get notified about new priority emails' },
              { key: 'taskReminders' as const, label: 'Task Reminders', desc: 'Reminders for upcoming and overdue tasks' },
              { key: 'billReminders' as const, label: 'Bill Reminders', desc: 'Alerts before bills are due' },
              { key: 'travelAlerts' as const, label: 'Travel Alerts', desc: 'Updates about upcoming flights and trips' },
            ]).map((notif) => (
              <div key={notif.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{notif.label}</p>
                  <p className="text-xs text-white/40">{notif.desc}</p>
                </div>
                <button
                  onClick={() => updateNotifications({ [notif.key]: !settings.notifications[notif.key] })}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    settings.notifications[notif.key]
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                      : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                      settings.notifications[notif.key] ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
            </div>
            <h3 className="font-semibold">Data Management</h3>
          </div>

          {/* Data stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {dataStats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl bg-white/5 text-center">
                <p className={`text-lg font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-[10px] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {/* Export */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium">Export Data as JSON</p>
                <p className="text-xs text-white/40">Download a backup of all your data</p>
              </div>
              {exportDone && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">Exported!</span>
              )}
            </button>

            {/* Clear All Data */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all group"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-rose-400">Clear All Data</p>
                <p className="text-xs text-white/40">Remove all tasks, emails, accounts, and trips</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowClearConfirm(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-[2rem] p-6 overflow-hidden" style={glassModal}>
              <ModalShine />
              <div className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-rose-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Clear All Data?</h3>
                <p className="text-sm text-white/50 mb-6">
                  This will permanently delete all your tasks, emails, accounts, transactions, bills, and trips. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-medium text-sm hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 font-medium text-sm hover:from-rose-600 hover:to-red-600 transition-all"
                  >
                    Clear Everything
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
