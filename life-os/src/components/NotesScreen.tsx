'use client';

// The Notes screen — a lighter sibling of TasksScreen. Live Firestore data
// with add / edit / delete. No "complete" concept; notes just have a title,
// a (possibly long) body, and optional tags.
//
// All data goes through the wrappers in src/lib/data.ts (already live via
// onSnapshot). Styling reuses the shell's design tokens, which cascade in
// because this renders inside .lo-root.

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { createNote, deleteNote, updateNote, useNotes } from '@/lib/data';
import type { Note } from '@/lib/types';

// Most-recently-edited first. updatedAt is an ISO string, so a plain string
// compare orders them correctly (descending = newest on top).
function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

// "work, errands ,, home" -> ["work", "errands", "home"]
function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

// ["work", "home"] -> "work, home" (for editing in a text input)
function joinTags(tags: string[] | undefined): string {
  return (tags ?? []).join(', ');
}

export default function NotesScreen() {
  const { data: notes, loading, error } = useNotes();
  const sorted = sortNotes(notes);

  return (
    <section className="lo-card ns-card">
      <ScopedStyles />

      <div className="lo-card-head">
        <h2>Notes</h2>
      </div>

      <AddNoteRow />

      {loading && <div className="ns-msg">Loading notes…</div>}
      {error && (
        <div className="ns-msg ns-err">Couldn&apos;t load notes: {error.message}</div>
      )}
      {!loading && !error && sorted.length === 0 && (
        <div className="ns-msg">No notes yet — add your first one above.</div>
      )}

      <ul className="ns-list">
        {sorted.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </ul>
    </section>
  );
}

// --- Add ------------------------------------------------------------------

function AddNoteRow() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);

  // A note needs at least a title or some body before it's worth saving.
  const canAdd = (title.trim() || body.trim()) !== '' && !busy;

  async function add() {
    if (!canAdd) return;
    setBusy(true);
    try {
      const parsed = parseTags(tags);
      await createNote({
        title: title.trim(),
        body: body.trim(),
        // Only store tags when there are some.
        ...(parsed.length ? { tags: parsed } : {}),
      });
      setTitle('');
      setBody('');
      setTags('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ns-add">
      <input
        className="ns-input"
        placeholder="Note title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="ns-input ns-textarea"
        placeholder="Write something…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
      />
      <div className="ns-add-foot">
        <input
          className="ns-input ns-tags"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          aria-label="Tags"
        />
        <button className="btn solid ns-addbtn" type="button" onClick={add} disabled={!canAdd}>
          <Plus size={15} strokeWidth={2.5} /> Add note
        </button>
      </div>
    </div>
  );
}

// --- Card (view + inline edit + delete confirm) ---------------------------

function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <li className="ns-li">
        <EditNoteForm note={note} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="ns-li ns-view">
      {/* Clicking the body opens inline edit. */}
      <button className="ns-open" type="button" onClick={() => setEditing(true)}>
        {note.title && <div className="ns-title">{note.title}</div>}
        {note.body && <div className="ns-body">{note.body}</div>}
        {note.tags && note.tags.length > 0 && (
          <div className="ns-chips">
            {note.tags.map((tag) => (
              <span key={tag} className="tcat">
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>

      {confirmDelete ? (
        <span className="ns-confirm">
          <span className="ns-confirm-q">Delete this note?</span>
          <button
            className="ns-mini ns-danger"
            type="button"
            onClick={() => deleteNote(note.id)}
          >
            Delete
          </button>
          <button className="ns-mini" type="button" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
        </span>
      ) : (
        <button
          className="ns-iconbtn"
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete note"
          title="Delete note"
        >
          <X size={15} />
        </button>
      )}
    </li>
  );
}

// --- Inline edit form -----------------------------------------------------

function EditNoteForm({ note, onDone }: { note: Note; onDone: () => void }) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [tags, setTags] = useState(joinTags(note.tags));
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await updateNote(note.id, {
        title: title.trim(),
        body: body.trim(),
        // Re-parse the tags input; empty input clears them to an empty array.
        tags: parseTags(tags),
      });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ns-add">
      <input
        className="ns-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title…"
        autoFocus
      />
      <textarea
        className="ns-input ns-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something…"
        rows={4}
      />
      <div className="ns-add-foot">
        <input
          className="ns-input ns-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          aria-label="Tags"
        />
        <button className="btn solid ns-addbtn" type="button" onClick={save} disabled={busy}>
          Save
        </button>
        <button className="btn ghost ns-addbtn" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// --- Scoped styles (built from the shell's tokens) ------------------------

function ScopedStyles() {
  return (
    <style>{`
.ns-card{display:flex;flex-direction:column;}
.ns-msg{color:var(--faint);font-size:13px;padding:14px 2px;}
.ns-err{color:var(--amber);}

.ns-add{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.ns-input{
  background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:11px;
  color:var(--text);font-family:inherit;font-size:13.5px;padding:9px 11px;outline:none;width:100%;
}
.ns-input:focus{border-color:var(--amber);}
.ns-input::placeholder{color:var(--faint);}
.ns-textarea{resize:vertical;min-height:64px;line-height:1.5;}
.ns-add-foot{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.ns-tags{flex:1;min-width:160px;width:auto;}
.ns-addbtn{flex:0 0 auto;display:inline-flex;align-items:center;gap:5px;padding:9px 14px;}

.ns-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:11px;}
.ns-li{display:flex;align-items:flex-start;gap:11px;}
/* Each note sits on its own faint glass panel to separate long bodies. */
.ns-view{border:1px solid var(--line);border-radius:14px;padding:13px 14px;background:rgba(255,255,255,.03);}
.ns-open{flex:1;min-width:0;background:transparent;border:none;text-align:left;cursor:pointer;
  font-family:inherit;padding:0;color:inherit;display:flex;flex-direction:column;gap:6px;}
.ns-title{font-size:14.5px;font-weight:600;}
.ns-open:hover .ns-title{color:var(--amber);}
/* Show the body but clamp very long notes to a few lines in the list. */
.ns-body{font-size:13px;color:var(--dim);line-height:1.5;white-space:pre-wrap;
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;}
.ns-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;}

.ns-iconbtn{background:transparent;border:none;color:var(--faint);cursor:pointer;
  padding:6px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto;}
.ns-iconbtn:hover{color:var(--text);background:rgba(255,255,255,.06);}

.ns-confirm{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;flex-wrap:wrap;justify-content:flex-end;}
.ns-confirm-q{font-size:12px;color:var(--dim);}
.ns-mini{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text);
  font-family:inherit;font-size:12px;font-weight:600;padding:5px 9px;border-radius:9px;cursor:pointer;}
.ns-mini:hover{background:rgba(255,255,255,.1);}
.ns-danger{color:#F2756B;border-color:rgba(242,117,107,.4);}
.ns-danger:hover{background:rgba(242,117,107,.12);}
`}</style>
  );
}
