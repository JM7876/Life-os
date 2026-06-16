'use client';

// The real Tasks screen — live Firestore data with full add / edit /
// complete / delete. This is the template Notes and Finances will copy.
//
// All data goes through the wrappers in src/lib/data.ts (already live via
// onSnapshot). Styling reuses the shell's design tokens (--amber, --glass,
// --line, etc.), which cascade in because this renders inside .lo-root.

import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { createTask, deleteTask, updateTask, useTasks } from '@/lib/data';
import type { Task } from '@/lib/types';

// Lower number = higher priority, used for sorting.
const PRIORITY_ORDER: Record<Task['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// Active tasks first; within those, soonest due date first (undated last),
// then high → medium → low priority. Completed tasks always sink to the bottom.
function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // Undated tasks sort after dated ones. Dates are YYYY-MM-DD strings, so a
    // plain string compare already orders them soonest-first.
    const aDue = a.dueDate || '';
    const bDue = b.dueDate || '';
    if (aDue !== bDue) {
      if (!aDue) return 1;
      if (!bDue) return -1;
      return aDue < bDue ? -1 : 1;
    }

    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
}

export default function TasksScreen() {
  const { data: tasks, loading, error } = useTasks();
  const sorted = sortTasks(tasks);

  return (
    <section className="lo-card ts-card">
      <ScopedStyles />

      <div className="lo-card-head">
        <h2>Tasks</h2>
      </div>

      <AddTaskRow />

      {loading && <div className="ts-msg">Loading tasks…</div>}
      {error && (
        <div className="ts-msg ts-err">Couldn&apos;t load tasks: {error.message}</div>
      )}
      {!loading && !error && sorted.length === 0 && (
        <div className="ts-msg">No tasks yet — add your first one above.</div>
      )}

      <ul className="lo-tasks big ts-list">
        {sorted.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
}

// --- Add ------------------------------------------------------------------

function AddTaskRow() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('general');
  const [busy, setBusy] = useState(false);

  const canAdd = title.trim().length > 0 && !busy;

  async function add() {
    if (!canAdd) return;
    setBusy(true);
    try {
      await createTask({
        title: title.trim(),
        completed: false,
        priority,
        // Only store dueDate when one was picked; otherwise leave it off.
        ...(dueDate ? { dueDate } : {}),
        category: category.trim() || 'general',
      });
      // Reset the form, keeping priority/category as sensible carry-overs.
      setTitle('');
      setDueDate('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ts-add">
      <input
        className="ts-input ts-add-title"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') add();
        }}
      />
      <select
        className="ts-input ts-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
        aria-label="Priority"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        className="ts-input ts-date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
      />
      <input
        className="ts-input ts-cat"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      />
      <button className="btn solid ts-addbtn" type="button" onClick={add} disabled={!canAdd}>
        <Plus size={15} strokeWidth={2.5} /> Add
      </button>
    </div>
  );
}

// --- Row (view + inline edit + delete confirm) ----------------------------

function TaskRow({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function toggleComplete() {
    if (task.completed) {
      // Uncomplete: clear completedAt to '' (type-safe, no null/deleteField).
      await updateTask(task.id, { completed: false, completedAt: '' });
    } else {
      await updateTask(task.id, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }
  }

  if (editing) {
    return (
      <li className="ts-li">
        <EditTaskForm task={task} onDone={() => setEditing(false)} />
      </li>
    );
  }

  // Readable due-date / priority line under the title.
  const meta = [task.dueDate ? formatDue(task.dueDate) : null, capitalize(task.priority)]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="ts-li">
      <button
        className={'chk' + (task.completed ? ' on' : '')}
        onClick={toggleComplete}
        type="button"
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check size={13} strokeWidth={3} />}
      </button>

      {/* Clicking the body opens inline edit. */}
      <button
        className={'tk ts-body' + (task.completed ? ' done' : '')}
        type="button"
        onClick={() => setEditing(true)}
      >
        <div className="tt">{task.title}</div>
        <div className="tm">{meta}</div>
      </button>

      <span className="tcat">{task.category}</span>

      {confirmDelete ? (
        <span className="ts-confirm">
          <span className="ts-confirm-q">Delete this task?</span>
          <button
            className="ts-mini ts-danger"
            type="button"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
          <button className="ts-mini" type="button" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
        </span>
      ) : (
        <button
          className="ts-iconbtn"
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete task"
          title="Delete task"
        >
          <X size={15} />
        </button>
      )}
    </li>
  );
}

// --- Inline edit form -----------------------------------------------------

function EditTaskForm({ task, onDone }: { task: Task; onDone: () => void }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [category, setCategory] = useState(task.category);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        priority,
        // Empty string clears the due date (type-safe, stays a string).
        dueDate: dueDate || '',
        category: category.trim() || 'general',
      });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ts-edit">
      <input
        className="ts-input ts-add-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <select
        className="ts-input ts-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
        aria-label="Priority"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        className="ts-input ts-date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
      />
      <input
        className="ts-input ts-cat"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      />
      <button className="btn solid ts-addbtn" type="button" onClick={save} disabled={busy}>
        Save
      </button>
      <button className="btn ghost ts-addbtn" type="button" onClick={onDone}>
        Cancel
      </button>
    </div>
  );
}

// --- Small helpers --------------------------------------------------------

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Turn a YYYY-MM-DD string into something friendlier, e.g. "Jun 16".
function formatDue(iso: string): string {
  // Parse as local date (append T00:00 so it isn't shifted by UTC).
  const d = new Date(iso + 'T00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// --- Scoped styles (built from the shell's tokens) ------------------------

function ScopedStyles() {
  return (
    <style>{`
.ts-card{display:flex;flex-direction:column;}
.ts-msg{color:var(--faint);font-size:13px;padding:14px 2px;}
.ts-err{color:var(--amber);}

.ts-add,.ts-edit{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;}
.ts-edit{margin:2px 0;}
.ts-input{
  background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:11px;
  color:var(--text);font-family:inherit;font-size:13.5px;padding:9px 11px;outline:none;
}
.ts-input:focus{border-color:var(--amber);}
.ts-input::placeholder{color:var(--faint);}
.ts-add-title{flex:1;min-width:160px;}
.ts-select{cursor:pointer;}
.ts-cat{width:120px;}
.ts-date{color-scheme:dark;}
.ts-addbtn{flex:0 0 auto;display:inline-flex;align-items:center;gap:5px;padding:9px 14px;}

.ts-list{margin-top:2px;}
.ts-li{display:flex;align-items:center;gap:11px;}
/* The task body is a button but should look like plain text. */
.ts-body{background:transparent;border:none;text-align:left;cursor:pointer;font-family:inherit;padding:0;color:inherit;}
.ts-body:hover .tt{color:var(--amber);}

.ts-iconbtn{background:transparent;border:none;color:var(--faint);cursor:pointer;
  padding:6px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto;}
.ts-iconbtn:hover{color:var(--text);background:rgba(255,255,255,.06);}

.ts-confirm{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;}
.ts-confirm-q{font-size:12px;color:var(--dim);}
.ts-mini{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text);
  font-family:inherit;font-size:12px;font-weight:600;padding:5px 9px;border-radius:9px;cursor:pointer;}
.ts-mini:hover{background:rgba(255,255,255,.1);}
.ts-danger{color:#F2756B;border-color:rgba(242,117,107,.4);}
.ts-danger:hover{background:rgba(242,117,107,.12);}
`}</style>
  );
}
