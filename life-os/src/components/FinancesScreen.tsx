'use client';

// The Finances screen — a visual command center for money. Manual entry only
// for now (live bank balances come later). Reads three live collections
// (accounts, transactions, bills) and shows summary stats, two charts, and an
// editable list for each. Styling reuses the shell's Liquid Glass tokens, the
// same as TasksScreen / NotesScreen.

import { Clock, Plus, X } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  createAccount,
  createBill,
  createTransaction,
  deleteAccount,
  deleteBill,
  deleteTransaction,
  updateAccount,
  updateBill,
  updateTransaction,
  useAccounts,
  useBills,
  useTransactions,
} from '@/lib/data';
import type { Account, Bill, Transaction } from '@/lib/types';

// --- Small shared helpers -------------------------------------------------

// One currency formatter, used everywhere → "$1,234.56".
const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const money = (n: number): string => USD.format(n);

// Slice/bar colors, pulled from the shell's accent palette so charts look native.
const CHART_COLORS = ['#F0B45F', '#6FC9A8', '#AD93E6', '#E0934A', '#7FB2E6', '#E68FA8', '#9BD17F'];

// A local YYYY-MM-DD string (avoids UTC day-shift from toISOString()).
function localDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// YYYY-MM-DD a given number of days from today.
function dateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localDate(d);
}

// Turn a number string from an input into a finite number (blank/garbage → 0).
function parseMoney(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// Friendly date, e.g. "Jun 16". Parsed as local midnight so it isn't shifted.
function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type BillStatus = 'paid' | 'overdue' | 'soon' | 'upcoming';

function billStatus(bill: Bill): BillStatus {
  if (bill.paid) return 'paid';
  const today = localDate();
  if (bill.dueDate && bill.dueDate < today) return 'overdue';
  if (bill.dueDate && bill.dueDate <= dateInDays(7)) return 'soon';
  return 'upcoming';
}

// =========================================================================
// Screen
// =========================================================================

export default function FinancesScreen() {
  const accounts = useAccounts();
  const transactions = useTransactions();
  const bills = useBills();

  const anyError = accounts.error || transactions.error || bills.error;

  // --- Derived numbers ---
  const totalBalance = accounts.data.reduce((sum, a) => sum + a.balance, 0);
  const upcomingBills = bills.data
    .filter((b) => !b.paid)
    .reduce((sum, b) => sum + b.amount, 0);

  // This month's spending = sum of expenses (negative amounts) dated this month.
  const monthPrefix = localDate().slice(0, 7); // "YYYY-MM"
  const monthSpending = transactions.data
    .filter((t) => t.amount < 0 && t.date.startsWith(monthPrefix))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // --- Chart data ---
  const balanceData = accounts.data.map((a) => ({ name: a.name, value: a.balance }));

  // Group this month's expenses by category for the donut.
  const categoryMap = new Map<string, number>();
  for (const t of transactions.data) {
    if (t.amount < 0 && t.date.startsWith(monthPrefix)) {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + Math.abs(t.amount));
    }
  }
  const spendingData = Array.from(categoryMap, ([name, value]) => ({ name, value }));

  return (
    <div className="fin">
      <ScopedStyles />

      {anyError && (
        <div className="fin-banner">Couldn&apos;t load some finances: {anyError.message}</div>
      )}

      {/* Summary stat cards */}
      <div className="fin-stats">
        <StatCard
          label="Total balance"
          value={accounts.loading ? '—' : money(totalBalance)}
          hint="Enter credit balances as negative to reduce the total"
          tone="amber"
        />
        <StatCard
          label="Upcoming bills"
          value={bills.loading ? '—' : money(upcomingBills)}
          hint="Unpaid bills"
          tone="violet"
        />
        <StatCard
          label="Spending this month"
          value={transactions.loading ? '—' : money(monthSpending)}
          hint={monthPrefix}
          tone="teal"
        />
      </div>

      {/* Charts */}
      <div className="fin-grid">
        <section className="lo-card">
          <div className="lo-card-head">
            <h2>Balances by account</h2>
          </div>
          {balanceData.length === 0 ? (
            <div className="fin-msg">No accounts yet.</div>
          ) : (
            <div className="fin-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balanceData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(244,242,236,.55)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => money(Number(v) || 0)}
                    tick={{ fill: 'rgba(244,242,236,.32)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />
                  <Tooltip
                    formatter={(v) => money(Number(v) || 0)}
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: 'rgba(255,255,255,.05)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {balanceData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="lo-card">
          <div className="lo-card-head">
            <h2>Spending by category</h2>
          </div>
          {spendingData.length === 0 ? (
            <div className="fin-msg">No spending recorded this month.</div>
          ) : (
            <div className="fin-chart fin-chart-pie">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {spendingData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => money(Number(v) || 0)} contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              {/* Simple legend beside the donut. */}
              <ul className="fin-legend">
                {spendingData.map((s, i) => (
                  <li key={s.name}>
                    <span
                      className="fin-dot"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="fin-legend-name">{s.name}</span>
                    <span className="fin-legend-val">{money(s.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* Lists */}
      <AccountsSection accounts={accounts.data} loading={accounts.loading} total={totalBalance} />
      <BillsSection bills={bills.data} loading={bills.loading} />
      <TransactionsSection
        transactions={transactions.data}
        loading={transactions.loading}
        accounts={accounts.data}
      />
    </div>
  );
}

const TOOLTIP_STYLE = {
  background: '#161B24',
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 10,
  color: '#F4F2EC',
  fontSize: 12,
} as const;

// --- Stat card ------------------------------------------------------------

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: 'amber' | 'teal' | 'violet';
}) {
  return (
    <div className={'lo-card fin-stat tone-' + tone}>
      <div className="fin-stat-label">{label}</div>
      <div className="fin-stat-value">{value}</div>
      {hint && <div className="fin-stat-hint">{hint}</div>}
    </div>
  );
}

// =========================================================================
// Accounts
// =========================================================================

const ACCOUNT_TYPES: Account['type'][] = ['checking', 'savings', 'credit', 'investment'];

function AccountsSection({
  accounts,
  loading,
  total,
}: {
  accounts: Account[];
  loading: boolean;
  total: number;
}) {
  return (
    <section className="lo-card">
      <div className="lo-card-head">
        <h2>Accounts</h2>
        {accounts.length > 0 && <span className="fin-total">Total {money(total)}</span>}
      </div>

      <AccountForm mode="add" />

      {loading && <div className="fin-msg">Loading accounts…</div>}
      {!loading && accounts.length === 0 && <div className="fin-msg">No accounts yet.</div>}

      <ul className="fin-list">
        {accounts.map((a) => (
          <AccountRow key={a.id} account={a} />
        ))}
      </ul>
    </section>
  );
}

function AccountRow({ account }: { account: Account }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <li className="fin-li">
        <AccountForm mode="edit" account={account} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="fin-li fin-row">
      <button className="fin-open" type="button" onClick={() => setEditing(true)}>
        <div className="fin-row-main">
          <span className="fin-row-name">{account.name}</span>
          <span className="tcat">{account.type}</span>
        </div>
        <div className="fin-row-sub">{account.institution}</div>
      </button>
      <span className="fin-amount">{money(account.balance)}</span>
      <DeleteConfirm
        confirm={confirmDelete}
        setConfirm={setConfirmDelete}
        label="account"
        onDelete={() => deleteAccount(account.id)}
      />
    </li>
  );
}

function AccountForm({
  mode,
  account,
  onDone,
}: {
  mode: 'add' | 'edit';
  account?: Account;
  onDone?: () => void;
}) {
  const [name, setName] = useState(account?.name ?? '');
  const [type, setType] = useState<Account['type']>(account?.type ?? 'checking');
  const [balance, setBalance] = useState(account ? String(account.balance) : '');
  const [institution, setInstitution] = useState(account?.institution ?? '');
  const [busy, setBusy] = useState(false);

  const canSave = name.trim() !== '' && !busy;

  async function save() {
    if (!canSave) return;
    setBusy(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        balance: parseMoney(balance),
        institution: institution.trim(),
        lastUpdated: new Date().toISOString(),
      };
      if (mode === 'add') {
        await createAccount(payload);
        setName('');
        setBalance('');
        setInstitution('');
      } else if (account) {
        await updateAccount(account.id, payload);
        onDone?.();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fin-form">
      <input
        className="fin-input fin-grow"
        placeholder="Account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="fin-input"
        value={type}
        onChange={(e) => setType(e.target.value as Account['type'])}
        aria-label="Account type"
      >
        {ACCOUNT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        className="fin-input fin-num"
        type="number"
        step="0.01"
        placeholder="Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        aria-label="Balance"
      />
      <input
        className="fin-input"
        placeholder="Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />
      <FormButtons mode={mode} onSave={save} onCancel={onDone} disabled={!canSave} addLabel="Add account" />
    </div>
  );
}

// =========================================================================
// Bills
// =========================================================================

function BillsSection({ bills, loading }: { bills: Bill[]; loading: boolean }) {
  // Soonest due date first.
  const sorted = [...bills].sort((a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0));

  return (
    <section className="lo-card">
      <div className="lo-card-head">
        <h2>Bills</h2>
      </div>

      <BillForm mode="add" />

      {loading && <div className="fin-msg">Loading bills…</div>}
      {!loading && bills.length === 0 && <div className="fin-msg">No bills yet.</div>}

      <ul className="fin-list">
        {sorted.map((b) => (
          <BillRow key={b.id} bill={b} />
        ))}
      </ul>
    </section>
  );
}

const STATUS_LABEL: Record<BillStatus, string> = {
  paid: 'Paid',
  overdue: 'Overdue',
  soon: 'Due soon',
  upcoming: 'Upcoming',
};

function BillRow({ bill }: { bill: Bill }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = billStatus(bill);

  if (editing) {
    return (
      <li className="fin-li">
        <BillForm mode="edit" bill={bill} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="fin-li fin-row">
      {/* Paid toggle doubles as a checkbox. */}
      <button
        className={'chk' + (bill.paid ? ' on' : '')}
        type="button"
        onClick={() => updateBill(bill.id, { paid: !bill.paid })}
        aria-label={bill.paid ? 'Mark unpaid' : 'Mark paid'}
        title={bill.paid ? 'Mark unpaid' : 'Mark paid'}
      />
      <button className="fin-open" type="button" onClick={() => setEditing(true)}>
        <div className="fin-row-main">
          <span className={'fin-row-name' + (bill.paid ? ' fin-strike' : '')}>{bill.name}</span>
          <span className={'fin-badge st-' + status}>{STATUS_LABEL[status]}</span>
          {bill.recurring && <span className="tcat">recurring</span>}
        </div>
        <div className="fin-row-sub">
          <Clock size={12} /> {formatDate(bill.dueDate)}
        </div>
      </button>
      <span className="fin-amount">{money(bill.amount)}</span>
      <DeleteConfirm
        confirm={confirmDelete}
        setConfirm={setConfirmDelete}
        label="bill"
        onDelete={() => deleteBill(bill.id)}
      />
    </li>
  );
}

function BillForm({ mode, bill, onDone }: { mode: 'add' | 'edit'; bill?: Bill; onDone?: () => void }) {
  const [name, setName] = useState(bill?.name ?? '');
  const [amount, setAmount] = useState(bill ? String(bill.amount) : '');
  const [dueDate, setDueDate] = useState(bill?.dueDate ?? '');
  const [recurring, setRecurring] = useState(bill?.recurring ?? false);
  const [paid, setPaid] = useState(bill?.paid ?? false);
  const [busy, setBusy] = useState(false);

  const canSave = name.trim() !== '' && !busy;

  async function save() {
    if (!canSave) return;
    setBusy(true);
    try {
      const payload = {
        name: name.trim(),
        amount: parseMoney(amount),
        dueDate,
        recurring,
        paid,
      };
      if (mode === 'add') {
        await createBill(payload);
        setName('');
        setAmount('');
        setDueDate('');
        setRecurring(false);
        setPaid(false);
      } else if (bill) {
        await updateBill(bill.id, payload);
        onDone?.();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fin-form">
      <input
        className="fin-input fin-grow"
        placeholder="Bill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="fin-input fin-num"
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        aria-label="Amount"
      />
      <input
        className="fin-input fin-date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
      />
      <label className="fin-check">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        Recurring
      </label>
      <label className="fin-check">
        <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
        Paid
      </label>
      <FormButtons mode={mode} onSave={save} onCancel={onDone} disabled={!canSave} addLabel="Add bill" />
    </div>
  );
}

// =========================================================================
// Transactions
// =========================================================================

function TransactionsSection({
  transactions,
  loading,
  accounts,
}: {
  transactions: Transaction[];
  loading: boolean;
  accounts: Account[];
}) {
  // Newest first by date.
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <section className="lo-card">
      <div className="lo-card-head">
        <h2>Transactions</h2>
      </div>

      <TransactionForm mode="add" accounts={accounts} />

      {loading && <div className="fin-msg">Loading transactions…</div>}
      {!loading && transactions.length === 0 && <div className="fin-msg">No transactions yet.</div>}

      <ul className="fin-list">
        {sorted.map((t) => (
          <TransactionRow key={t.id} transaction={t} accounts={accounts} />
        ))}
      </ul>
    </section>
  );
}

function TransactionRow({
  transaction,
  accounts,
}: {
  transaction: Transaction;
  accounts: Account[];
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <li className="fin-li">
        <TransactionForm
          mode="edit"
          transaction={transaction}
          accounts={accounts}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  const isExpense = transaction.amount < 0;
  const accountName = accounts.find((a) => a.id === transaction.accountId)?.name;

  return (
    <li className="fin-li fin-row">
      <button className="fin-open" type="button" onClick={() => setEditing(true)}>
        <div className="fin-row-main">
          <span className="fin-row-name">{transaction.description}</span>
          <span className="tcat">{transaction.category}</span>
        </div>
        <div className="fin-row-sub">
          {formatDate(transaction.date)}
          {accountName ? ` · ${accountName}` : ''}
        </div>
      </button>
      {/* Expense shown red & negative, income green & positive. */}
      <span className={'fin-amount ' + (isExpense ? 'fin-neg' : 'fin-pos')}>
        {isExpense ? '−' : '+'}
        {money(Math.abs(transaction.amount))}
      </span>
      <DeleteConfirm
        confirm={confirmDelete}
        setConfirm={setConfirmDelete}
        label="transaction"
        onDelete={() => deleteTransaction(transaction.id)}
      />
    </li>
  );
}

function TransactionForm({
  mode,
  transaction,
  accounts,
  onDone,
}: {
  mode: 'add' | 'edit';
  transaction?: Transaction;
  accounts: Account[];
  onDone?: () => void;
}) {
  const [description, setDescription] = useState(transaction?.description ?? '');
  // Kind drives the sign of the stored amount.
  const [kind, setKind] = useState<'expense' | 'income'>(
    transaction && transaction.amount > 0 ? 'income' : 'expense',
  );
  const [amount, setAmount] = useState(transaction ? String(Math.abs(transaction.amount)) : '');
  const [category, setCategory] = useState(transaction?.category ?? 'general');
  const [date, setDate] = useState(transaction?.date ?? localDate());
  const [accountId, setAccountId] = useState(transaction?.accountId ?? '');
  const [busy, setBusy] = useState(false);

  const canSave = description.trim() !== '' && !busy;

  async function save() {
    if (!canSave) return;
    setBusy(true);
    try {
      // Expenses are stored negative, income positive.
      const magnitude = Math.abs(parseMoney(amount));
      const signed = kind === 'expense' ? -magnitude : magnitude;
      const payload = {
        description: description.trim(),
        amount: signed,
        category: category.trim() || 'general',
        date: date || localDate(),
        // Only attach accountId when one is chosen.
        ...(accountId ? { accountId } : {}),
      };
      if (mode === 'add') {
        await createTransaction(payload);
        setDescription('');
        setAmount('');
      } else if (transaction) {
        await updateTransaction(transaction.id, payload);
        onDone?.();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fin-form">
      <input
        className="fin-input fin-grow"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="fin-input"
        value={kind}
        onChange={(e) => setKind(e.target.value as 'expense' | 'income')}
        aria-label="Expense or income"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input
        className="fin-input fin-num"
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        aria-label="Amount"
      />
      <input
        className="fin-input fin-cat"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      />
      <input
        className="fin-input fin-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        aria-label="Date"
      />
      <select
        className="fin-input"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        aria-label="Account"
      >
        <option value="">No account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <FormButtons
        mode={mode}
        onSave={save}
        onCancel={onDone}
        disabled={!canSave}
        addLabel="Add transaction"
      />
    </div>
  );
}

// =========================================================================
// Shared bits: form buttons + delete confirm
// =========================================================================

function FormButtons({
  mode,
  onSave,
  onCancel,
  disabled,
  addLabel,
}: {
  mode: 'add' | 'edit';
  onSave: () => void;
  onCancel?: () => void;
  disabled: boolean;
  addLabel: string;
}) {
  if (mode === 'add') {
    return (
      <button className="btn solid fin-btn" type="button" onClick={onSave} disabled={disabled}>
        <Plus size={15} strokeWidth={2.5} /> {addLabel}
      </button>
    );
  }
  return (
    <>
      <button className="btn solid fin-btn" type="button" onClick={onSave} disabled={disabled}>
        Save
      </button>
      <button className="btn ghost fin-btn" type="button" onClick={onCancel}>
        Cancel
      </button>
    </>
  );
}

function DeleteConfirm({
  confirm,
  setConfirm,
  label,
  onDelete,
}: {
  confirm: boolean;
  setConfirm: (v: boolean) => void;
  label: string;
  onDelete: () => void;
}) {
  if (confirm) {
    return (
      <span className="fin-confirm">
        <span className="fin-confirm-q">Delete this {label}?</span>
        <button className="fin-mini fin-danger" type="button" onClick={onDelete}>
          Delete
        </button>
        <button className="fin-mini" type="button" onClick={() => setConfirm(false)}>
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button
      className="fin-iconbtn"
      type="button"
      onClick={() => setConfirm(true)}
      aria-label={'Delete ' + label}
      title={'Delete ' + label}
    >
      <X size={15} />
    </button>
  );
}

// =========================================================================
// Scoped styles (built from the shell's tokens)
// =========================================================================

function ScopedStyles() {
  return (
    <style>{`
.fin{display:flex;flex-direction:column;gap:14px;}
.fin-banner{background:rgba(240,180,95,.12);border:1px solid var(--line);border-radius:14px;
  padding:11px 14px;color:var(--amber);font-size:13px;}
.fin-msg{color:var(--faint);font-size:13px;padding:12px 2px;}

/* Summary cards */
.fin-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.fin-stat{border-radius:18px;padding:16px 18px;}
.fin-stat.tone-amber{background:linear-gradient(150deg,rgba(240,180,95,.12),rgba(255,255,255,.05));}
.fin-stat.tone-violet{background:linear-gradient(150deg,rgba(173,147,230,.12),rgba(255,255,255,.05));}
.fin-stat.tone-teal{background:linear-gradient(150deg,rgba(111,201,168,.12),rgba(255,255,255,.05));}
.fin-stat-label{font-size:12px;color:var(--dim);font-weight:600;letter-spacing:.3px;text-transform:uppercase;}
.fin-stat-value{font-size:26px;font-weight:600;letter-spacing:-.6px;margin:6px 0 3px;}
.fin-stat-hint{font-size:11.5px;color:var(--faint);}

/* Charts */
.fin-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.fin-chart{height:220px;width:100%;}
.fin-chart-pie{display:flex;align-items:center;gap:8px;}
.fin-chart-pie .recharts-responsive-container{flex:1 1 55%;min-width:0;}
.fin-legend{list-style:none;margin:0;padding:0;flex:1 1 45%;display:flex;flex-direction:column;gap:7px;min-width:0;}
.fin-legend li{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--dim);}
.fin-dot{width:9px;height:9px;border-radius:3px;flex:0 0 9px;}
.fin-legend-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fin-legend-val{color:var(--text);font-weight:600;}
.fin-total{font-size:12.5px;color:var(--text);font-weight:600;}

/* Forms */
.fin-form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;}
.fin-input{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:11px;
  color:var(--text);font-family:inherit;font-size:13.5px;padding:9px 11px;outline:none;}
.fin-input:focus{border-color:var(--amber);}
.fin-input::placeholder{color:var(--faint);}
.fin-grow{flex:1;min-width:150px;}
.fin-num{width:110px;}
.fin-cat{width:120px;}
.fin-date{color-scheme:dark;}
select.fin-input{cursor:pointer;}
.fin-check{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--dim);cursor:pointer;}
.fin-check input{accent-color:var(--amber);width:15px;height:15px;}
.fin-btn{flex:0 0 auto;display:inline-flex;align-items:center;gap:5px;padding:9px 14px;}

/* Rows */
.fin-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;}
.fin-li{padding:4px 0;}
.fin-row{display:flex;align-items:center;gap:11px;border-top:1px solid rgba(255,255,255,.07);padding:11px 0;}
.fin-list .fin-li:first-child .fin-row{border-top:none;}
.fin-open{flex:1;min-width:0;background:transparent;border:none;text-align:left;cursor:pointer;
  font-family:inherit;padding:0;color:inherit;display:flex;flex-direction:column;gap:3px;}
.fin-row-main{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.fin-row-name{font-size:14px;font-weight:500;}
.fin-open:hover .fin-row-name{color:var(--amber);}
.fin-strike{text-decoration:line-through;color:var(--faint);}
.fin-row-sub{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--faint);}
.fin-amount{font-size:14px;font-weight:600;letter-spacing:-.3px;flex:0 0 auto;}
.fin-pos{color:#6FC9A8;} .fin-neg{color:#F2756B;}

/* Bill status badges */
.fin-badge{font-size:10.5px;font-weight:600;border-radius:6px;padding:2px 7px;border:1px solid var(--line);}
.st-overdue{color:#F2756B;border-color:rgba(242,117,107,.4);background:rgba(242,117,107,.1);}
.st-soon{color:var(--amber);border-color:rgba(240,180,95,.4);background:rgba(240,180,95,.1);}
.st-paid{color:#6FC9A8;border-color:rgba(111,201,168,.4);}
.st-upcoming{color:var(--faint);}

/* Delete confirm + icon button (same pattern as Tasks/Notes) */
.fin-iconbtn{background:transparent;border:none;color:var(--faint);cursor:pointer;padding:6px;
  border-radius:9px;display:grid;place-items:center;flex:0 0 auto;}
.fin-iconbtn:hover{color:var(--text);background:rgba(255,255,255,.06);}
.fin-confirm{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;flex-wrap:wrap;justify-content:flex-end;}
.fin-confirm-q{font-size:12px;color:var(--dim);}
.fin-mini{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text);
  font-family:inherit;font-size:12px;font-weight:600;padding:5px 9px;border-radius:9px;cursor:pointer;}
.fin-mini:hover{background:rgba(255,255,255,.1);}
.fin-danger{color:#F2756B;border-color:rgba(242,117,107,.4);}
.fin-danger:hover{background:rgba(242,117,107,.12);}

@media (max-width:820px){
  .fin-stats{grid-template-columns:1fr;}
  .fin-grid{grid-template-columns:1fr;}
}
`}</style>
  );
}
