/**
 * Types and interfaces for the travel expense splitting web app
 */

export type Currency = 'JPY' | 'TWD';

export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  paidBy: string; // Member ID
  splitAmong: string[]; // Array of Member IDs
  date: number; // Timestamp
}

export interface MemberSummary {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // Positive = should receive, Negative = should pay
}

export interface Settlement {
  from: string; // Member ID
  fromName: string;
  to: string; // Member ID
  toName: string;
  amount: number;
}

export interface AppState {
  members: Member[];
  expenses: Expense[];
  currency: Currency;
  exchangeRate: number; // JPY to TWD
}
