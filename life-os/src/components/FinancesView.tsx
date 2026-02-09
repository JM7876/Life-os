'use client';

import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart3,
  Eye,
  EyeOff,
} from 'lucide-react';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

const accounts = [
  { name: 'Chase Checking', type: 'checking', balance: 4825.50, change: +245.00, institution: 'Chase' },
  { name: 'Amex Savings', type: 'savings', balance: 12840.00, change: +840.00, institution: 'American Express' },
  { name: 'Fidelity Brokerage', type: 'investment', balance: 28450.00, change: +672.30, institution: 'Fidelity' },
  { name: 'Amex Platinum', type: 'credit', balance: -1245.00, change: -380.00, institution: 'American Express' },
];

const recentTransactions = [
  { id: '1', merchant: 'Adobe Creative Cloud', amount: -54.99, category: 'Software', date: 'Today', icon: '🎨' },
  { id: '2', merchant: 'Delta Air Lines', amount: -347.00, category: 'Travel', date: 'Yesterday', icon: '✈️' },
  { id: '3', merchant: 'Client Payment - Martinez', amount: 2500.00, category: 'Income', date: 'Feb 7', icon: '📸' },
  { id: '4', merchant: 'Whole Foods Market', amount: -86.43, category: 'Groceries', date: 'Feb 7', icon: '🛒' },
  { id: '5', merchant: 'AT&T Wireless', amount: -85.00, category: 'Utilities', date: 'Feb 6', icon: '📱' },
  { id: '6', merchant: 'Lens Rental - BorrowLenses', amount: -175.00, category: 'Equipment', date: 'Feb 5', icon: '📷' },
  { id: '7', merchant: 'Client Payment - Thompson', amount: 1800.00, category: 'Income', date: 'Feb 4', icon: '📸' },
  { id: '8', merchant: 'Shell Gas Station', amount: -52.30, category: 'Auto', date: 'Feb 4', icon: '⛽' },
];

const upcomingBills = [
  { name: 'Rent', amount: 1650.00, dueDate: 'Mar 1', status: 'upcoming' as const },
  { name: 'Amex Platinum', amount: 1245.00, dueDate: 'Feb 15', status: 'due-soon' as const },
  { name: 'Car Insurance', amount: 185.00, dueDate: 'Feb 20', status: 'upcoming' as const },
  { name: 'Adobe CC', amount: 54.99, dueDate: 'Mar 5', status: 'upcoming' as const },
  { name: 'AT&T Wireless', amount: 85.00, dueDate: 'Mar 8', status: 'upcoming' as const },
];

const budgetCategories = [
  { name: 'Housing', spent: 1650, budget: 1700, color: 'bg-violet-500' },
  { name: 'Food & Dining', spent: 420, budget: 600, color: 'bg-cyan-500' },
  { name: 'Transportation', spent: 237, budget: 400, color: 'bg-emerald-500' },
  { name: 'Equipment', spent: 175, budget: 500, color: 'bg-amber-500' },
  { name: 'Entertainment', spent: 89, budget: 200, color: 'bg-pink-500' },
  { name: 'Software', spent: 155, budget: 200, color: 'bg-blue-500' },
];

const billStatusColors = {
  'due-soon': 'text-amber-400 bg-amber-500/20',
  upcoming: 'text-white/50 bg-white/5',
  paid: 'text-emerald-400 bg-emerald-500/20',
};

export default function FinancesView() {
  const [showBalances, setShowBalances] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'transactions' | 'budget'>('overview');

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalChange = accounts.reduce((sum, acc) => sum + acc.change, 0);
  const monthlyIncome = recentTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlySpending = Math.abs(recentTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            Finances
          </h2>
          <p className="text-white/50 mt-1">Your financial overview</p>
        </div>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          {showBalances ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Net Worth Card */}
      <div className="relative rounded-[1.5rem] p-6 overflow-hidden" style={glassStyle}>
        <div className="absolute inset-x-0 top-0 h-20 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
        <div className="relative">
          <p className="text-sm text-white/50 mb-1">Net Worth</p>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-bold">
              {showBalances ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </p>
            <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${totalChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {totalChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {showBalances ? `${totalChange >= 0 ? '+' : ''}$${Math.abs(totalChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/50">Income (MTD)</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                {showBalances ? `$${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-white/50">Spending (MTD)</span>
              </div>
              <p className="text-lg font-bold text-rose-400">
                {showBalances ? `$${monthlySpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'transactions' as const, label: 'Transactions', icon: Receipt },
          { id: 'budget' as const, label: 'Budget', icon: PiggyBank },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeSection === tab.id
                ? 'bg-violet-500/30 text-violet-300 border border-violet-500/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts */}
          <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
            <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><CreditCard className="w-5 h-5" /></div>
                <h3 className="font-semibold">Accounts</h3>
              </div>
              <div className="space-y-3">
                {accounts.map((account, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="font-medium text-sm">{account.name}</p>
                      <p className="text-xs text-white/40">{account.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${account.balance < 0 ? 'text-rose-400' : ''}`}>
                        {showBalances ? `${account.balance < 0 ? '-' : ''}$${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                      </p>
                      <p className={`text-xs ${account.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {showBalances ? `${account.change >= 0 ? '+' : ''}$${Math.abs(account.change).toFixed(2)}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
            <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Receipt className="w-5 h-5" /></div>
                <h3 className="font-semibold">Upcoming Bills</h3>
                <span className="ml-auto px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">
                  ${upcomingBills.reduce((s, b) => s + b.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="space-y-2">
                {upcomingBills.map((bill, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${billStatusColors[bill.status]}`}>
                        {bill.dueDate}
                      </div>
                      <p className="font-medium text-sm">{bill.name}</p>
                    </div>
                    <p className="font-bold text-sm">
                      {showBalances ? `$${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'transactions' && (
        <div className="relative rounded-[1.5rem] overflow-hidden" style={glassStyle}>
          <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
          <div className="relative">
            <div className="flex items-center gap-3 p-5 pb-3">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400"><Receipt className="w-5 h-5" /></div>
              <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-white/5">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{tx.merchant}</p>
                    <p className="text-xs text-white/40">{tx.category} &middot; {tx.date}</p>
                  </div>
                  <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {showBalances
                      ? `${tx.amount >= 0 ? '+' : '-'}$${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : '••••'
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'budget' && (
        <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
          <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400"><PiggyBank className="w-5 h-5" /></div>
              <h3 className="font-semibold">Monthly Budget</h3>
              <span className="ml-auto text-sm text-white/50">February 2026</span>
            </div>
            <div className="space-y-5">
              {budgetCategories.map((cat, i) => {
                const pct = Math.round((cat.spent / cat.budget) * 100);
                const isOver = pct > 90;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-sm text-white/60">
                        {showBalances ? `$${cat.spent}` : '••••'}
                        <span className="text-white/30"> / ${cat.budget}</span>
                      </p>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : cat.color}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isOver ? 'text-rose-400' : 'text-white/30'}`}>
                      {pct}% used &middot; {showBalances ? `$${cat.budget - cat.spent}` : '••••'} remaining
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between">
                <p className="font-medium">Total Budget</p>
                <p className="font-bold">
                  {showBalances
                    ? `$${budgetCategories.reduce((s, c) => s + c.spent, 0).toLocaleString()} / $${budgetCategories.reduce((s, c) => s + c.budget, 0).toLocaleString()}`
                    : '••••'
                  }
                </p>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  style={{ width: `${Math.round((budgetCategories.reduce((s, c) => s + c.spent, 0) / budgetCategories.reduce((s, c) => s + c.budget, 0)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
