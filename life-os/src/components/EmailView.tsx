'use client';

import React, { useState } from 'react';
import {
  Mail,
  Inbox,
  Send,
  Star,
  Trash2,
  Archive,
  Search,
  Filter,
  ChevronRight,
  Paperclip,
  Clock,
  AlertCircle,
  MailOpen,
  Reply,
  Forward,
  MoreHorizontal,
  Tag,
} from 'lucide-react';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  read: boolean;
  starred: boolean;
  priority: boolean;
  hasAttachment: boolean;
  labels: string[];
  folder: 'inbox' | 'sent' | 'starred' | 'archive';
}

const emails: Email[] = [
  {
    id: '1', from: 'American Express', fromEmail: 'statements@americanexpress.com',
    subject: 'Your February Statement is Ready',
    preview: 'Your statement balance of $1,245.00 is now available. Payment due by February 15.',
    body: 'Dear Johnathon,\n\nYour February statement for your Platinum Card ending in 1008 is now available.\n\nStatement Balance: $1,245.00\nPayment Due Date: February 15, 2026\nMinimum Payment: $35.00\n\nTo view your full statement, log in to your account or open the Amex app.\n\nThank you for being a valued Card Member.',
    time: '2h', date: 'Feb 9', read: false, starred: false, priority: true, hasAttachment: true, labels: ['Finance'], folder: 'inbox',
  },
  {
    id: '2', from: 'Delta Air Lines', fromEmail: 'notifications@delta.com',
    subject: 'Flight Confirmation - DTW to DEN, Mar 15',
    preview: 'Your flight DL 1247 has been confirmed. Check in opens 24 hours before departure.',
    body: 'Hi Johnathon,\n\nYour flight has been confirmed!\n\nFlight: DL 1247\nDate: March 15, 2026\nDeparture: DTW 8:30 AM\nArrival: DEN 10:15 AM\nSeat: 12A (Comfort+)\nConfirmation: GKTR82\n\nCheck-in opens 24 hours before departure. Download the Delta app to manage your trip.\n\nSafe travels!',
    time: '5h', date: 'Feb 9', read: false, starred: true, priority: true, hasAttachment: false, labels: ['Travel'], folder: 'inbox',
  },
  {
    id: '3', from: 'Adobe', fromEmail: 'newsletter@adobe.com',
    subject: 'New Lightroom Features: AI-Powered Masking Updates',
    preview: 'Discover the latest AI masking improvements in Lightroom Classic and explore new presets.',
    body: 'Hi Johnathon,\n\nWe\'re excited to announce new AI-powered features in Lightroom Classic:\n\n- Enhanced AI Masking with subject detection\n- New adaptive presets for landscape photography\n- Improved batch processing performance\n- Cloud sync optimizations\n\nUpdate your Creative Cloud apps to get these features today.',
    time: '1d', date: 'Feb 8', read: true, starred: false, priority: false, hasAttachment: false, labels: ['Software'], folder: 'inbox',
  },
  {
    id: '4', from: 'Sarah Martinez', fromEmail: 'sarah.martinez@gmail.com',
    subject: 'RE: Wedding Photography Package - Final Details',
    preview: 'Hi Johnathon, we\'ve reviewed the contract and everything looks great! We\'d like to add the...',
    body: 'Hi Johnathon,\n\nWe\'ve reviewed the contract and everything looks great! We\'d like to add the engagement session package as discussed.\n\nCould we schedule a call this week to finalize the timeline for the big day? We\'re so excited to work with you!\n\nBest,\nSarah & Miguel',
    time: '1d', date: 'Feb 8', read: false, starred: true, priority: true, hasAttachment: true, labels: ['Clients'], folder: 'inbox',
  },
  {
    id: '5', from: 'Chase Bank', fromEmail: 'alerts@chase.com',
    subject: 'Direct Deposit Received',
    preview: 'A direct deposit of $2,500.00 has been posted to your checking account ending in 4892.',
    body: 'A direct deposit has been posted to your account.\n\nAccount: Checking ...4892\nAmount: $2,500.00\nFrom: Martinez Wedding Deposit\nDate: February 7, 2026\n\nYour current balance is $4,825.50.',
    time: '2d', date: 'Feb 7', read: true, starred: false, priority: false, hasAttachment: false, labels: ['Finance'], folder: 'inbox',
  },
  {
    id: '6', from: 'BorrowLenses', fromEmail: 'orders@borrowlenses.com',
    subject: 'Rental Confirmation - Sony 70-200mm f/2.8 GM II',
    preview: 'Your lens rental has been confirmed for March 14-19. Shipping details inside.',
    body: 'Hi Johnathon,\n\nYour rental order has been confirmed!\n\nItem: Sony FE 70-200mm f/2.8 GM II\nRental Period: March 14-19, 2026\nShipping: 2-day, arrives March 13\nTotal: $175.00\n\nPlease return by March 20 to avoid late fees.',
    time: '2d', date: 'Feb 7', read: true, starred: false, priority: false, hasAttachment: true, labels: ['Equipment'], folder: 'inbox',
  },
  {
    id: '7', from: 'Thompson Family', fromEmail: 'dan.thompson@outlook.com',
    subject: 'Portrait Session - Thank You!',
    preview: 'The family portraits turned out amazing! We absolutely love them. Wanted to let you know...',
    body: 'Hi Johnathon,\n\nThe family portraits turned out amazing! We absolutely love them. The kids look so natural and the lighting was perfect.\n\nWanted to let you know we\'ve already shared them with the grandparents and they\'re thrilled. We\'d love to book another session in the fall.\n\nThank you so much!\nDan & Lisa Thompson',
    time: '3d', date: 'Feb 6', read: true, starred: true, priority: false, hasAttachment: false, labels: ['Clients'], folder: 'inbox',
  },
  {
    id: '8', from: 'Fidelity Investments', fromEmail: 'alerts@fidelity.com',
    subject: 'Monthly Investment Summary - January 2026',
    preview: 'Your portfolio grew 2.4% this month. View your complete investment summary.',
    body: 'Monthly Investment Summary\n\nAccount Value: $28,450.00\nMonthly Change: +$672.30 (+2.4%)\nYTD Return: +2.4%\n\nTop Performers:\n- VOO (S&P 500): +3.1%\n- QQQ (Nasdaq): +2.8%\n\nLog in to view your complete portfolio details.',
    time: '4d', date: 'Feb 5', read: true, starred: false, priority: false, hasAttachment: true, labels: ['Finance'], folder: 'inbox',
  },
];

const folders = [
  { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: emails.filter(e => !e.read && e.folder === 'inbox').length },
  { id: 'starred' as const, label: 'Starred', icon: Star, count: emails.filter(e => e.starred).length },
  { id: 'sent' as const, label: 'Sent', icon: Send, count: 0 },
  { id: 'archive' as const, label: 'Archive', icon: Archive, count: 0 },
];

const labelColors: Record<string, string> = {
  Finance: 'bg-emerald-500/20 text-emerald-400',
  Travel: 'bg-cyan-500/20 text-cyan-400',
  Clients: 'bg-violet-500/20 text-violet-400',
  Software: 'bg-blue-500/20 text-blue-400',
  Equipment: 'bg-amber-500/20 text-amber-400',
};

export default function EmailView() {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'starred' | 'archive'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailState, setEmailState] = useState(emails);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmailState(prev => prev.map(em => em.id === id ? { ...em, starred: !em.starred } : em));
  };

  const markAsRead = (id: string) => {
    setEmailState(prev => prev.map(em => em.id === id ? { ...em, read: true } : em));
  };

  const filteredEmails = emailState.filter(e => {
    if (selectedFolder === 'starred') return e.starred;
    if (selectedFolder !== 'inbox') return e.folder === selectedFolder;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.from.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q);
    }
    return e.folder === 'inbox';
  });

  const activeEmail = selectedEmail ? emailState.find(e => e.id === selectedEmail) : null;
  const unreadCount = emailState.filter(e => !e.read && e.folder === 'inbox').length;
  const priorityCount = emailState.filter(e => e.priority && !e.read).length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
          Email Hub
        </h2>
        <p className="text-white/50 mt-1">{unreadCount} unread &middot; {priorityCount} priority</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => { setSelectedFolder(folder.id); setSelectedEmail(null); }}
            className={`relative rounded-[1.5rem] p-4 overflow-hidden transition-all ${
              selectedFolder === folder.id ? 'ring-2 ring-violet-500/50' : ''
            }`}
            style={glassStyle}
          >
            <div className="absolute inset-x-0 top-0 h-10 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative flex items-center gap-3">
              <folder.icon className={`w-5 h-5 ${selectedFolder === folder.id ? 'text-violet-400' : 'text-white/50'}`} />
              <div className="text-left">
                <p className="text-xs text-white/50">{folder.label}</p>
                <p className="font-bold">{folder.count}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Email List */}
        <div className={`${activeEmail ? 'lg:col-span-2' : 'lg:col-span-5'} ${activeEmail ? 'hidden lg:block' : ''} relative rounded-[1.5rem] overflow-hidden`} style={glassStyle}>
          <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
          <div className="relative divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="p-12 text-center">
                <MailOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No emails in this folder</p>
              </div>
            ) : (
              filteredEmails.map(email => (
                <button
                  key={email.id}
                  onClick={() => { setSelectedEmail(email.id); markAsRead(email.id); }}
                  className={`w-full text-left flex items-start gap-3 p-4 transition-all hover:bg-white/5 ${
                    selectedEmail === email.id ? 'bg-white/10' : ''
                  } ${!email.read ? 'bg-white/[0.03]' : ''}`}
                >
                  <button
                    onClick={(e) => toggleStar(email.id, e)}
                    className="mt-1 flex-shrink-0"
                  >
                    <Star className={`w-4 h-4 ${email.starred ? 'fill-amber-400 text-amber-400' : 'text-white/20 hover:text-white/40'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium text-sm truncate ${!email.read ? 'text-white' : 'text-white/60'}`}>{email.from}</p>
                      {email.priority && <AlertCircle className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                      {email.hasAttachment && <Paperclip className="w-3 h-3 text-white/30 flex-shrink-0" />}
                      <span className="ml-auto text-xs text-white/30 flex-shrink-0">{email.time}</span>
                    </div>
                    <p className={`text-sm truncate ${!email.read ? 'text-white/80' : 'text-white/50'}`}>{email.subject}</p>
                    <p className="text-xs text-white/30 truncate mt-0.5">{email.preview}</p>
                    {email.labels.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {email.labels.map(label => (
                          <span key={label} className={`px-2 py-0.5 rounded text-[10px] font-medium ${labelColors[label] || 'bg-white/10 text-white/50'}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {!email.read && <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Email Detail */}
        {activeEmail && (
          <div className="lg:col-span-3 relative rounded-[1.5rem] overflow-hidden" style={glassStyle}>
            <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative p-5">
              <button
                onClick={() => setSelectedEmail(null)}
                className="lg:hidden flex items-center gap-2 text-sm text-white/60 mb-3 hover:text-white/80"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to inbox
              </button>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{activeEmail.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-white/60">{activeEmail.from}</p>
                    <span className="text-xs text-white/30">&lt;{activeEmail.fromEmail}&gt;</span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">{activeEmail.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                    <Reply className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                    <Forward className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {activeEmail.labels.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {activeEmail.labels.map(label => (
                    <span key={label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${labelColors[label] || 'bg-white/10 text-white/50'}`}>
                      <Tag className="w-3 h-3" />
                      {label}
                    </span>
                  ))}
                </div>
              )}
              <div className="border-t border-white/10 pt-4">
                <pre className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-[inherit]">
                  {activeEmail.body}
                </pre>
              </div>
              {activeEmail.hasAttachment && (
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60">1 attachment</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
