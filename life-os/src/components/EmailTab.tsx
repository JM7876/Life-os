'use client';
import React, { useState, useMemo } from 'react';
import { useLifeOSStore, type Email } from '@/store/useLifeOSStore';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
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

type Folder = 'inbox' | 'priority' | 'archived';

// Icons
const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const MailOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" /><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function EmailTab() {
  const {
    emails,
    markEmailRead,
    toggleEmailRead,
    markEmailPriority,
    archiveEmail,
    unarchiveEmail,
  } = useLifeOSStore();

  const [activeFolder, setActiveFolder] = useState<Folder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const filteredEmails = useMemo(() => {
    let filtered: Email[];
    switch (activeFolder) {
      case 'inbox':
        filtered = emails.filter(e => !e.archived);
        break;
      case 'priority':
        filtered = emails.filter(e => e.priority && !e.archived);
        break;
      case 'archived':
        filtered = emails.filter(e => e.archived);
        break;
      default:
        filtered = emails;
    }
    return [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [emails, activeFolder]);

  const unreadCount = useMemo(() => emails.filter(e => !e.read && !e.archived).length, [emails]);
  const priorityCount = useMemo(() => emails.filter(e => e.priority && !e.archived).length, [emails]);
  const archivedCount = useMemo(() => emails.filter(e => e.archived).length, [emails]);

  const formatTimeAgo = (date: Date | string) => {
    const ms = Date.now() - new Date(date).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  };

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) markEmailRead(email.id);
  };

  const handleBack = () => setSelectedEmail(null);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors: Record<string, string> = {
    'American Express': 'from-blue-500 to-blue-700',
    'Delta Airlines': 'from-red-500 to-blue-600',
    'Sarah Chen': 'from-pink-500 to-rose-500',
    'Adobe Creative Cloud': 'from-red-500 to-red-700',
    'Chase Bank': 'from-blue-600 to-blue-800',
    'Marcus by Goldman Sachs': 'from-emerald-500 to-teal-600',
    'Mike Torres': 'from-orange-500 to-amber-500',
    'Marriott Bonvoy': 'from-purple-500 to-indigo-600',
    'GitHub': 'from-gray-600 to-gray-800',
    'AT&T': 'from-cyan-500 to-blue-600',
    'Fidelity Investments': 'from-green-500 to-emerald-600',
    'Spotify': 'from-green-400 to-green-600',
  };

  const folders: { id: Folder; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon />, count: unreadCount },
    { id: 'priority', label: 'Priority', icon: <StarIcon filled />, count: priorityCount },
    { id: 'archived', label: 'Archived', icon: <ArchiveIcon />, count: archivedCount },
  ];

  return (
    <div className="space-y-4">
      {/* Connect Banner */}
      <div
        className="relative rounded-[1.5rem] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div className="px-4 lg:px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20">
              <LinkIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">Connect Gmail or Outlook to sync real emails</p>
              <p className="text-xs text-white/40">Mock data shown below for preview</p>
            </div>
          </div>
          <a href="/integrations" className="px-4 py-2 rounded-xl bg-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/30 transition-colors whitespace-nowrap">
            Set up integrations
          </a>
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Email Hub</span>
        </h2>
        <p className="text-white/60 text-sm">{unreadCount} unread &middot; {priorityCount} priority</p>
      </div>

      {/* Folder Tabs */}
      <div className="flex gap-2">
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeFolder === folder.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {folder.icon}
            {folder.label}
            {folder.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeFolder === folder.id ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-white/40'
              }`}>
                {folder.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Email List */}
        <div className={`${selectedEmail ? 'hidden lg:block' : ''} lg:col-span-2`}>
          <div className="relative rounded-[1.5rem] overflow-hidden" style={glassCard}>
            <ShineOverlay />
            <div className="relative">
              {filteredEmails.length === 0 ? (
                <div className="p-8 text-center">
                  <ArchiveIcon />
                  <p className="text-white/40 text-sm mt-2">
                    {activeFolder === 'archived' ? 'No archived emails' : activeFolder === 'priority' ? 'No priority emails' : 'Inbox is empty'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredEmails.map((email) => (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`w-full text-left p-4 transition-colors hover:bg-white/5 ${
                        selectedEmail?.id === email.id ? 'bg-white/10' : ''
                      } ${!email.read ? '' : 'opacity-70'}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[email.from] || 'from-gray-500 to-gray-700'} flex items-center justify-center text-[11px] font-bold flex-shrink-0`}>
                          {getInitials(email.from)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-sm truncate ${!email.read ? 'font-semibold text-white' : 'text-white/70'}`}>
                              {email.from}
                            </span>
                            <span className="text-[10px] text-white/30 flex-shrink-0">{formatTimeAgo(email.timestamp)}</span>
                          </div>
                          <p className={`text-sm truncate mb-0.5 ${!email.read ? 'font-medium text-white/90' : 'text-white/50'}`}>
                            {email.subject}
                          </p>
                          <p className="text-xs text-white/30 truncate">{email.preview}</p>
                        </div>
                        {/* Indicators */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                          {!email.read && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                          {email.priority && <StarIcon filled />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Detail Panel */}
        <div className={`${selectedEmail ? '' : 'hidden lg:block'} lg:col-span-3`}>
          <div className="relative rounded-[1.5rem] overflow-hidden min-h-[500px]" style={glassCard}>
            <ShineOverlay />
            <div className="relative">
              {selectedEmail ? (
                <div>
                  {/* Detail Header */}
                  <div className="p-4 lg:p-5 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-4 lg:hidden">
                      <button onClick={handleBack} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon />
                      </button>
                      <span className="text-sm text-white/50">Back to {activeFolder}</span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColors[selectedEmail.from] || 'from-gray-500 to-gray-700'} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {getInitials(selectedEmail.from)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold leading-tight mb-0.5">{selectedEmail.subject}</h3>
                          <p className="text-sm text-white/60">{selectedEmail.from} <span className="text-white/30">&lt;{selectedEmail.fromEmail}&gt;</span></p>
                          <p className="text-xs text-white/30 mt-0.5">{formatFullDate(selectedEmail.timestamp)}</p>
                        </div>
                      </div>

                      {/* Provider Badge */}
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-medium flex-shrink-0 ${
                        selectedEmail.provider === 'gmail' ? 'bg-red-500/20 text-red-400' :
                        selectedEmail.provider === 'outlook' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {selectedEmail.provider}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => toggleEmailRead(selectedEmail.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-colors"
                      >
                        {selectedEmail.read ? <MailIcon /> : <MailOpenIcon />}
                        {selectedEmail.read ? 'Mark unread' : 'Mark read'}
                      </button>
                      <button
                        onClick={() => markEmailPriority(selectedEmail.id, !selectedEmail.priority)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          selectedEmail.priority
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80'
                        }`}
                      >
                        <StarIcon filled={selectedEmail.priority} />
                        {selectedEmail.priority ? 'Priority' : 'Set priority'}
                      </button>
                      {selectedEmail.archived ? (
                        <button
                          onClick={() => { unarchiveEmail(selectedEmail.id); setSelectedEmail(null); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-colors"
                        >
                          <InboxIcon />
                          Move to inbox
                        </button>
                      ) : (
                        <button
                          onClick={() => { archiveEmail(selectedEmail.id); setSelectedEmail(null); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-colors"
                        >
                          <ArchiveIcon />
                          Archive
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-4 lg:p-5">
                    <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white/20">
                        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <p className="text-white/40 text-sm">Select an email to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
