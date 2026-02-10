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
const btnPrimary = "w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-medium text-sm hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all";

const CATEGORIES = ['Dining', 'Transport', 'Shopping', 'Software', 'Entertainment', 'Groceries', 'Health', 'Income', 'Other'];
const ACCOUNT_TYPES = ['checking', 'savings', 'credit', 'investment'] as const;

export default function FinancesTab() {
  const {
    accounts, addAccount, deleteAccount,
    transactions, addTransaction, deleteTransaction,
    bills, addBill, toggleBillPaid, deleteBill,
    monthlyBudget, setMonthlyBudget,
  } = useLifeOSStore();

  const [modal, setModal] = useState<'account' | 'transaction' | 'bill' | 'budget' | null>(null);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'checking' as typeof ACCOUNT_TYPES[number], balance: '', institution: '' });
  const [newTx, setNewTx] = useState({ amount: '', category: 'Dining', description: '', date: new Date().toISOString().split('T')[0] });
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '', recurring: true });
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));

  // Computed values
  const netWorth = useMemo(() => {
    return accounts.reduce((sum, a) => {
      return a.type === 'credit' ? sum - a.balance : sum + a.balance;
    }, 0);
  }, [accounts]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlySpending = useMemo(() => {
    return transactions
      .filter(t => t.amount < 0 && new Date(t.date) >= monthStart)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter(t => t.amount < 0 && new Date(t.date) >= monthStart)
      .forEach(t => {
        cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const budgetRemaining = monthlyBudget - monthlySpending;
  const budgetPct = monthlyBudget > 0 ? Math.min(100, (monthlySpending / monthlyBudget) * 100) : 0;

  const upcomingBills = useMemo(() => {
    return [...bills]
      .filter(b => !b.paid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleAddAccount = () => {
    if (!newAccount.name.trim() || !newAccount.balance) return;
    addAccount({ name: newAccount.name.trim(), type: newAccount.type, balance: parseFloat(newAccount.balance), institution: newAccount.institution.trim() });
    setNewAccount({ name: '', type: 'checking', balance: '', institution: '' });
    setModal(null);
  };

  const handleAddTx = () => {
    if (!newTx.description.trim() || !newTx.amount) return;
    addTransaction({ amount: parseFloat(newTx.amount), category: newTx.category, description: newTx.description.trim(), date: new Date(newTx.date).toISOString() });
    setNewTx({ amount: '', category: 'Dining', description: '', date: new Date().toISOString().split('T')[0] });
    setModal(null);
  };

  const handleAddBill = () => {
    if (!newBill.name.trim() || !newBill.amount || !newBill.dueDate) return;
    addBill({ name: newBill.name.trim(), amount: parseFloat(newBill.amount), dueDate: new Date(newBill.dueDate).toISOString(), recurring: newBill.recurring, paid: false });
    setNewBill({ name: '', amount: '', dueDate: '', recurring: true });
    setModal(null);
  };

  const handleSetBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) setMonthlyBudget(val);
    setModal(null);
  };

  const accountTypeIcons: Record<string, string> = { checking: 'bg-blue-500/20 text-blue-400', savings: 'bg-emerald-500/20 text-emerald-400', credit: 'bg-rose-500/20 text-rose-400', investment: 'bg-purple-500/20 text-purple-400' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Finances</span>
        </h2>
        <p className="text-white/60 text-sm">Track accounts, spending, and bills</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Net Worth', value: `$${netWorth.toLocaleString()}`, color: 'text-emerald-400', sub: `${accounts.length} accounts` },
          { label: 'Monthly Budget', value: `$${monthlyBudget.toLocaleString()}`, color: 'text-cyan-400', sub: <button onClick={() => { setBudgetInput(String(monthlyBudget)); setModal('budget'); }} className="text-cyan-400/60 hover:text-cyan-400 underline underline-offset-2">Edit</button> },
          { label: 'Spent This Month', value: `$${monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: budgetPct > 80 ? 'text-rose-400' : 'text-amber-400', sub: `${budgetPct.toFixed(0)}% of budget` },
          { label: 'Budget Remaining', value: `$${budgetRemaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: budgetRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400', sub: budgetRemaining >= 0 ? 'On track' : 'Over budget' },
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

      {/* Budget Progress Bar */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Monthly Budget Usage</p>
            <p className="text-xs text-white/50">${monthlySpending.toFixed(0)} / ${monthlyBudget.toLocaleString()}</p>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${budgetPct > 90 ? 'bg-gradient-to-r from-rose-500 to-red-500' : budgetPct > 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
              style={{ width: `${Math.min(100, budgetPct)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Accounts */}
        <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Accounts</h3>
              <button onClick={() => setModal('account')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div className="space-y-2">
              {accounts.map(acct => (
                <div key={acct.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${accountTypeIcons[acct.type]}`}>
                    {acct.type[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{acct.name}</p>
                    <p className="text-xs text-white/40">{acct.institution} &middot; {acct.type}</p>
                  </div>
                  <p className={`font-bold text-sm ${acct.type === 'credit' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {acct.type === 'credit' ? '-' : ''}${acct.balance.toLocaleString()}
                  </p>
                  <button onClick={() => deleteAccount(acct.id)} className="p-1.5 rounded-lg text-white/0 group-hover:text-white/20 hover:!text-rose-400 hover:bg-rose-500/10 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
              {accounts.length === 0 && <p className="text-white/30 text-sm text-center py-4">No accounts yet</p>}
            </div>
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upcoming Bills</h3>
              <button onClick={() => setModal('bill')} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div className="space-y-2">
              {upcomingBills.map(bill => {
                const daysLeft = Math.ceil((new Date(bill.dueDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={bill.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group">
                    <button onClick={() => toggleBillPaid(bill.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${bill.paid ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-emerald-400'} transition-all`}>
                      {bill.paid && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${bill.paid ? 'line-through text-white/40' : ''}`}>{bill.name}</p>
                      <p className="text-xs text-white/40">
                        {formatDate(bill.dueDate)}
                        {bill.recurring && <span className="ml-1.5 text-white/20">&middot; Recurring</span>}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-sm text-rose-400">${bill.amount.toLocaleString()}</p>
                        <p className={`text-[10px] ${daysLeft <= 3 ? 'text-rose-400' : 'text-white/30'}`}>
                          {daysLeft <= 0 ? 'Due today' : `${daysLeft}d left`}
                        </p>
                      </div>
                      <button onClick={() => deleteBill(bill.id)} className="p-1.5 rounded-lg text-white/0 group-hover:text-white/20 hover:!text-rose-400 hover:bg-rose-500/10 transition-all">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* Paid bills */}
              {bills.filter(b => b.paid).length > 0 && (
                <p className="text-xs text-white/30 pt-2">{bills.filter(b => b.paid).length} paid bill{bills.filter(b => b.paid).length > 1 ? 's' : ''} hidden</p>
              )}
              {bills.length === 0 && <p className="text-white/30 text-sm text-center py-4">No bills tracked</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      {spendingByCategory.length > 0 && (
        <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <h3 className="font-semibold mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {spendingByCategory.map(([cat, amount]) => {
                const pct = monthlySpending > 0 ? (amount / monthlySpending) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-white/80">{cat}</p>
                      <p className="text-sm font-medium">${amount.toFixed(2)}</p>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="relative rounded-[1.5rem] p-4 lg:p-5 overflow-hidden" style={glassCard}>
        <ShineOverlay />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button onClick={() => setModal('transaction')} className="p-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 10).map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${tx.amount >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                  {tx.amount >= 0 ? '+' : '-'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{tx.description}</p>
                  <p className="text-xs text-white/40">{formatDate(tx.date)} &middot; {tx.category}</p>
                </div>
                <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-emerald-400' : 'text-white/80'}`}>
                  {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-lg text-white/0 group-hover:text-white/20 hover:!text-rose-400 hover:bg-rose-500/10 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-white/30 text-sm text-center py-4">No transactions yet</p>}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-[2rem] p-6 overflow-hidden" style={glassModal}>
              <ModalShine />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">
                    {modal === 'account' && 'Add Account'}
                    {modal === 'transaction' && 'Add Transaction'}
                    {modal === 'bill' && 'Add Bill'}
                    {modal === 'budget' && 'Set Monthly Budget'}
                  </h3>
                  <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {modal === 'account' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Account Name</label>
                      <input type="text" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="e.g. Chase Checking" autoFocus className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Type</label>
                      <div className="flex gap-2">
                        {ACCOUNT_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => setNewAccount({ ...newAccount, type: t })} className={`flex-1 px-2 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${newAccount.type === t ? accountTypeIcons[t] + ' border-current' : 'border-white/10 text-white/40 hover:border-white/20'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Balance ($)</label>
                        <input type="number" step="0.01" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: e.target.value })} placeholder="0.00" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Institution</label>
                        <input type="text" value={newAccount.institution} onChange={e => setNewAccount({ ...newAccount, institution: e.target.value })} placeholder="e.g. Chase" className={inputCls} />
                      </div>
                    </div>
                    <button onClick={handleAddAccount} disabled={!newAccount.name.trim() || !newAccount.balance} className={btnPrimary}>Add Account</button>
                  </div>
                )}

                {modal === 'transaction' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Description</label>
                      <input type="text" value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} placeholder="e.g. Coffee at Blue Bottle" autoFocus className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Amount ($) <span className="text-white/30">negative = expense</span></label>
                        <input type="number" step="0.01" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} placeholder="-12.50" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Date</label>
                        <input type="date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} className={inputCls + ' [color-scheme:dark]'} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <button key={cat} type="button" onClick={() => setNewTx({ ...newTx, category: cat })} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${newTx.category === cat ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'border-white/10 text-white/40 hover:border-white/20'}`}>{cat}</button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleAddTx} disabled={!newTx.description.trim() || !newTx.amount} className={btnPrimary}>Add Transaction</button>
                  </div>
                )}

                {modal === 'bill' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Bill Name</label>
                      <input type="text" value={newBill.name} onChange={e => setNewBill({ ...newBill, name: e.target.value })} placeholder="e.g. Electric Bill" autoFocus className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Amount ($)</label>
                        <input type="number" step="0.01" value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} placeholder="0.00" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Due Date</label>
                        <input type="date" value={newBill.dueDate} onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })} className={inputCls + ' [color-scheme:dark]'} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setNewBill({ ...newBill, recurring: !newBill.recurring })} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${newBill.recurring ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                        {newBill.recurring && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                      <span className="text-sm text-white/60">Recurring monthly</span>
                    </div>
                    <button onClick={handleAddBill} disabled={!newBill.name.trim() || !newBill.amount || !newBill.dueDate} className={btnPrimary}>Add Bill</button>
                  </div>
                )}

                {modal === 'budget' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Monthly Budget ($)</label>
                      <input type="number" step="1" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} autoFocus className={inputCls} />
                    </div>
                    <button onClick={handleSetBudget} disabled={!budgetInput || parseFloat(budgetInput) <= 0} className={btnPrimary}>Save Budget</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
