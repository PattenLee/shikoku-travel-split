import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppState, Expense, Member, Currency } from '../types';
import { generateMemberSummaries, calculateSettlements } from '../utils/expenseUtils';

interface ExpenseContextType {
  state: AppState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  setCurrency: (currency: Currency) => void;
  setExchangeRate: (rate: number) => void;
  clearAllData: () => void;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: '成員 A' },
  { id: '2', name: '成員 B' },
  { id: '3', name: '成員 C' },
  { id: '4', name: '成員 D' },
];

const STORAGE_KEY = 'shikoku_travel_split_data';
const DEFAULT_STATE: AppState = {
  members: DEFAULT_MEMBERS,
  expenses: [],
  currency: 'JPY',
  exchangeRate: 3.5, // Default JPY to TWD rate
};

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      saveData(state);
    }
  }, [state, isLoading]);

  const loadData = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setState(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = (data: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const id = Date.now().toString();
    const newExpense: Expense = { ...expense, id };
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...expense, id } : e)),
    }));
  };

  const deleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const setCurrency = (currency: Currency) => {
    setState((prev) => ({
      ...prev,
      currency,
    }));
  };

  const setExchangeRate = (rate: number) => {
    setState((prev) => ({
      ...prev,
      exchangeRate: rate,
    }));
  };

  const clearAllData = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        addExpense,
        updateExpense,
        deleteExpense,
        setCurrency,
        setExchangeRate,
        clearAllData,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
}

export function useMemberSummaries() {
  const { state } = useExpense();
  return generateMemberSummaries(state.members, state.expenses);
}

export function useSettlements() {
  const summaries = useMemberSummaries();
  return calculateSettlements(summaries);
}
