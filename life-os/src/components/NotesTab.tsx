'use client';
import React, { useState, useEffect, useCallback } from 'react';

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
const btnPrimary = "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 font-medium text-sm hover:from-violet-600 hover:to-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all";

interface NotionPage {
  id: string;
  title: string;
  createdTime: string;
  lastEditedTime: string;
  url: string;
  icon: string | null;
}

interface NotionBlock {
  type: string;
  text: string;
}

interface PageDetail {
  id: string;
  title: string;
  icon: string | null;
  createdTime: string;
  lastEditedTime: string;
  url: string;
  content: NotionBlock[];
}

export default function NotesTab() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageDetail | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      const res = await fetch(`/api/notion?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch');
        return;
      }

      setConfigured(data.configured);
      setPages(data.pages || []);
    } catch {
      setError('Failed to connect to Notion API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPages(searchQuery);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchPages]);

  const handleCreatePage = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim() }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        setShowCreate(false);
        fetchPages(searchQuery);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create page');
      }
    } catch {
      setError('Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const openPage = async (pageId: string) => {
    setLoadingPage(true);
    try {
      const res = await fetch(`/api/notion/page/${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPage(data);
      }
    } catch {
      setError('Failed to load page');
    } finally {
      setLoadingPage(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatRelative = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(d);
  };

  // Render setup instructions if Notion env vars are missing
  if (configured === false) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Notes</span>
          </h2>
          <p className="text-white/60 text-sm">Connect Notion to sync your notes</p>
        </div>

        <div className="relative rounded-[1.5rem] p-6 lg:p-8 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
                N
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Notion</h3>
                <p className="text-sm text-white/50">Set up your Notion integration to get started</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/5 rounded-xl p-5">
              <h4 className="font-medium text-sm text-white/80">Setup Instructions</h4>
              <ol className="space-y-3 text-sm text-white/60">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline underline-offset-2 hover:text-violet-300">notion.so/my-integrations</a> and create a new integration</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Copy the <strong className="text-white/80">Internal Integration Secret</strong> (starts with <code className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">ntn_</code>)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Create a Notion database (full-page table) and share it with your integration</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Copy the <strong className="text-white/80">Database ID</strong> from the database URL (the 32-character hex string)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">5</span>
                  <div>
                    <span>Add both values to your <code className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">.env.local</code> file:</span>
                    <pre className="mt-2 p-3 bg-black/30 rounded-lg text-[11px] text-emerald-400 overflow-x-auto">
{`NOTION_API_KEY=ntn_your_secret_here
NOTION_DATABASE_ID=your_database_id_here`}
                    </pre>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">6</span>
                  <span>Restart the dev server (<code className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">npm run dev</code>) to load the new environment variables</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page detail view
  if (selectedPage) {
    return (
      <div className="space-y-6 max-w-3xl">
        {/* Back button + header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPage(null)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">
              {selectedPage.icon && <span className="mr-2">{selectedPage.icon}</span>}
              {selectedPage.title}
            </h2>
            <p className="text-xs text-white/40">
              Created {formatDate(selectedPage.createdTime)} &middot; Edited {formatRelative(selectedPage.lastEditedTime)}
            </p>
          </div>
          <a
            href={selectedPage.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 hover:border-violet-500/30 hover:text-violet-400 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open in Notion
          </a>
        </div>

        {/* Content */}
        <div className="relative rounded-[1.5rem] p-5 lg:p-6 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative space-y-3">
            {loadingPage ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedPage.content.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">This page is empty</p>
            ) : (
              selectedPage.content.map((block, i) => {
                if (block.type === 'divider') {
                  return <hr key={i} className="border-white/10 my-4" />;
                }
                if (block.type === 'heading_1') {
                  return <h1 key={i} className="text-2xl font-bold mt-4">{block.text}</h1>;
                }
                if (block.type === 'heading_2') {
                  return <h2 key={i} className="text-xl font-semibold mt-3">{block.text}</h2>;
                }
                if (block.type === 'heading_3') {
                  return <h3 key={i} className="text-lg font-medium mt-2">{block.text}</h3>;
                }
                if (block.type === 'bulleted_list_item') {
                  return (
                    <div key={i} className="flex gap-2 text-sm text-white/70">
                      <span className="text-white/30 mt-0.5">&bull;</span>
                      <span>{block.text}</span>
                    </div>
                  );
                }
                if (block.type === 'numbered_list_item') {
                  return (
                    <div key={i} className="flex gap-2 text-sm text-white/70">
                      <span className="text-white/40 text-xs mt-0.5 w-4 text-right">{i + 1}.</span>
                      <span>{block.text}</span>
                    </div>
                  );
                }
                if (block.type === 'to_do') {
                  return (
                    <div key={i} className="flex gap-2 text-sm text-white/70">
                      <span className="text-white/30">&#9744;</span>
                      <span>{block.text}</span>
                    </div>
                  );
                }
                if (block.type === 'code') {
                  return (
                    <pre key={i} className="bg-black/30 rounded-xl p-4 text-sm text-emerald-400 overflow-x-auto">
                      {block.text}
                    </pre>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote key={i} className="border-l-2 border-violet-500/50 pl-4 text-sm text-white/60 italic">
                      {block.text}
                    </blockquote>
                  );
                }
                if (!block.text) return null;
                return (
                  <p key={i} className="text-sm text-white/70 leading-relaxed">
                    {block.text}
                  </p>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main notes list view
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Notes</span>
          </h2>
          <p className="text-white/60 text-sm">Your Notion workspace, synced</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Note
        </button>
      </div>

      {/* Notion Connected Banner */}
      <div className="relative rounded-[1.5rem] p-4 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/20">
            N
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Notion Connected</p>
            <p className="text-xs text-white/40">Showing pages from your linked database</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Search */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="relative rounded-[1.5rem] p-4 overflow-hidden border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-rose-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm text-rose-400">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1 rounded-lg hover:bg-white/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{pages.length} note{pages.length !== 1 ? 's' : ''}</h3>
            <button
              onClick={() => fetchPages(searchQuery)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white/60"
              title="Refresh"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
          </div>

          {loading && pages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm">
                {searchQuery ? 'No notes match your search' : 'No notes yet'}
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-3 text-xs text-orange-400 hover:text-orange-300 transition-all"
              >
                + Create your first note
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => openPage(page.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                    {page.icon || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{page.title}</p>
                    <p className="text-xs text-white/40">
                      Edited {formatRelative(page.lastEditedTime)}
                    </p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/0 group-hover:text-white/30 transition-all flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-[2rem] p-6 overflow-hidden" style={glassModal}>
              <ModalShine />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">New Note</h3>
                  <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Note title..."
                      autoFocus
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Content</label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write your note..."
                      rows={6}
                      className={inputCls + ' resize-none'}
                    />
                  </div>

                  <button
                    onClick={handleCreatePage}
                    disabled={!newTitle.trim() || creating}
                    className={btnPrimary}
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Create Note in Notion'
                    )}
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
