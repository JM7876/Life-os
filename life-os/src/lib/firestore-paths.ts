import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

// Firestore layout for Life OS — every document lives under
// users/{uid}, so security rules can lock access by ownership.
//
//   users/{uid}                     // profile / settings doc
//   users/{uid}/tasks/{taskId}
//   users/{uid}/events/{eventId}
//   users/{uid}/accounts/{accountId}
//   users/{uid}/transactions/{txId}
//   users/{uid}/bills/{billId}
//   users/{uid}/notes/{noteId}
//
// No seed data is written in Phase 1. These helpers exist so Phase 2
// reads/writes (and tests) consistently point at the right place.

export const userDoc = (uid: string) => doc(db, 'users', uid);

export const tasksCol = (uid: string) => collection(db, 'users', uid, 'tasks');
export const eventsCol = (uid: string) => collection(db, 'users', uid, 'events');
export const accountsCol = (uid: string) => collection(db, 'users', uid, 'accounts');
export const transactionsCol = (uid: string) => collection(db, 'users', uid, 'transactions');
export const billsCol = (uid: string) => collection(db, 'users', uid, 'bills');
export const notesCol = (uid: string) => collection(db, 'users', uid, 'notes');
