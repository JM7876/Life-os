'use client';

// Life OS data layer.
//
// A small, typed wrapper around Firestore that always scopes reads and writes to
// the *currently signed-in* user, i.e. everything lives under
//   users/{uid}/{collection}
// which is exactly what our owner-only security rules allow.
//
// The uid is always read live from Firebase Auth — never hard-coded — so the
// same code works for any signed-in user and refuses to touch Firestore when
// nobody is signed in.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  type CollectionReference,
  type DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { auth, db } from './firebase';
import type { Account, Bill, Note, Task, Transaction } from './types';

// ---------------------------------------------------------------------------
// Layer 1 — the user-scoped collection reference
// ---------------------------------------------------------------------------

// Returns a reference to users/{uid}/{name} for the signed-in user, or null if
// nobody is signed in yet. Returning null (instead of throwing) lets callers
// quietly do nothing until auth is ready, rather than crashing on first render.
export function userCollection(
  name: string,
): CollectionReference<DocumentData> | null {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  return collection(db, 'users', uid, name);
}

// Fields the data layer fills in itself, so callers never pass them.
type Managed = 'id' | 'createdAt' | 'updatedAt';

// The shape a caller provides when creating a document: the real type minus the
// id and timestamps. (Omit silently ignores keys a given type doesn't have.)
type NewDoc<T> = Omit<T, Managed>;

// ---------------------------------------------------------------------------
// Layer 2 — live read hook
// ---------------------------------------------------------------------------

export type CollectionState<T> = {
  data: T[];
  loading: boolean;
  error: Error | null;
};

// Subscribes to users/{uid}/{name} in real time. Any change (from this device
// or another) flows straight back into `data`. Each document's Firestore id is
// merged onto the object so callers always have it.
export function useUserCollection<T>(name: string): CollectionState<T> {
  const { user } = useAuth();
  const uid = user?.uid;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // No uid yet → don't open a listener. Settle into a clean empty state so the
    // UI can render "nothing" instead of spinning forever.
    if (!uid) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const col = collection(db, 'users', uid, name);

    const unsubscribe = onSnapshot(
      col,
      (snapshot) => {
        // Spread the stored fields, then set id last so the real doc id wins.
        const rows = snapshot.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
        setData(rows);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    // Cleanup: drop the listener on unmount, or before re-subscribing when the
    // uid or collection name changes (e.g. sign-out then sign-in).
    return unsubscribe;
  }, [uid, name]);

  return { data, loading, error };
}

// ---------------------------------------------------------------------------
// Layer 3 — generic write helpers (all scoped to the signed-in user)
// ---------------------------------------------------------------------------

// Create a document. Stamps createdAt/updatedAt as ISO strings (matching our
// string-typed timestamp fields) and returns the new document's id.
export async function create<T>(name: string, data: NewDoc<T>): Promise<string> {
  const col = userCollection(name);
  if (!col) throw new Error(`Cannot create in "${name}": no signed-in user.`);

  const now = new Date().toISOString();
  const ref = await addDoc(col, { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

// Update part of a document and refresh updatedAt. Callers pass only the fields
// they want to change.
export async function update<T>(
  name: string,
  id: string,
  partial: Partial<NewDoc<T>>,
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error(`Cannot update "${name}/${id}": no signed-in user.`);

  const ref = doc(db, 'users', uid, name, id);
  await updateDoc(ref, { ...partial, updatedAt: new Date().toISOString() });
}

// Delete a document.
export async function remove(name: string, id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error(`Cannot delete "${name}/${id}": no signed-in user.`);

  await deleteDoc(doc(db, 'users', uid, name, id));
}

// ---------------------------------------------------------------------------
// Layer 4 — thin, typed per-type wrappers
// ---------------------------------------------------------------------------
// These just pin the collection name and the type so screens get clean access
// like useTasks() / createTask() without repeating string names or generics.

// Tasks → users/{uid}/tasks
export const useTasks = () => useUserCollection<Task>('tasks');
export const createTask = (data: NewDoc<Task>) => create<Task>('tasks', data);
export const updateTask = (id: string, partial: Partial<NewDoc<Task>>) =>
  update<Task>('tasks', id, partial);
export const deleteTask = (id: string) => remove('tasks', id);

// Notes → users/{uid}/notes
export const useNotes = () => useUserCollection<Note>('notes');
export const createNote = (data: NewDoc<Note>) => create<Note>('notes', data);
export const updateNote = (id: string, partial: Partial<NewDoc<Note>>) =>
  update<Note>('notes', id, partial);
export const deleteNote = (id: string) => remove('notes', id);

// Accounts → users/{uid}/accounts
export const useAccounts = () => useUserCollection<Account>('accounts');
export const createAccount = (data: NewDoc<Account>) =>
  create<Account>('accounts', data);
export const updateAccount = (id: string, partial: Partial<NewDoc<Account>>) =>
  update<Account>('accounts', id, partial);
export const deleteAccount = (id: string) => remove('accounts', id);

// Transactions → users/{uid}/transactions
export const useTransactions = () => useUserCollection<Transaction>('transactions');
export const createTransaction = (data: NewDoc<Transaction>) =>
  create<Transaction>('transactions', data);
export const updateTransaction = (
  id: string,
  partial: Partial<NewDoc<Transaction>>,
) => update<Transaction>('transactions', id, partial);
export const deleteTransaction = (id: string) => remove('transactions', id);

// Bills → users/{uid}/bills
export const useBills = () => useUserCollection<Bill>('bills');
export const createBill = (data: NewDoc<Bill>) => create<Bill>('bills', data);
export const updateBill = (id: string, partial: Partial<NewDoc<Bill>>) =>
  update<Bill>('bills', id, partial);
export const deleteBill = (id: string) => remove('bills', id);
