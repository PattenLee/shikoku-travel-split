import type { Expense, Member, MemberSummary, Settlement, Currency } from '../types';

/**
 * Calculate the amount each person should pay for a split expense
 */
export function calculateSplitAmount(amount: number, splitCount: number): number {
  return Math.round((amount / splitCount) * 100) / 100;
}

/**
 * Generate member summaries from expenses
 */
export function generateMemberSummaries(
  members: Member[],
  expenses: Expense[]
): MemberSummary[] {
  const summaries: Record<string, MemberSummary> = {};

  // Initialize summaries for all members
  members.forEach((member) => {
    summaries[member.id] = {
      memberId: member.id,
      memberName: member.name,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0,
    };
  });

  // Calculate totals from expenses
  expenses.forEach((expense) => {
    // Add to paid amount
    if (summaries[expense.paidBy]) {
      summaries[expense.paidBy].totalPaid += expense.amount;
    }

    // Add to owed amount
    const splitAmount = calculateSplitAmount(expense.amount, expense.splitAmong.length);
    expense.splitAmong.forEach((memberId) => {
      if (summaries[memberId]) {
        summaries[memberId].totalOwed += splitAmount;
      }
    });
  });

  // Calculate balance (positive = should receive, negative = should pay)
  Object.values(summaries).forEach((summary) => {
    summary.balance = summary.totalPaid - summary.totalOwed;
  });

  return Object.values(summaries);
}

/**
 * Calculate settlements needed to balance all debts
 */
export function calculateSettlements(summaries: MemberSummary[]): Settlement[] {
  const settlements: Settlement[] = [];

  // Create copies to avoid modifying originals
  const balances = summaries.map((s) => ({
    memberId: s.memberId,
    memberName: s.memberName,
    balance: s.balance,
  }));

  // Separate debtors and creditors
  let debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
  let creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);

  // Match debtors with creditors
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const debtAmount = Math.abs(debtor.balance);
    const creditAmount = creditor.balance;
    const settlementAmount = Math.min(debtAmount, creditAmount);

    settlements.push({
      from: debtor.memberId,
      fromName: debtor.memberName,
      to: creditor.memberId,
      toName: creditor.memberName,
      amount: Math.round(settlementAmount * 100) / 100,
    });

    debtor.balance += settlementAmount;
    creditor.balance -= settlementAmount;

    // Remove if balance is settled (within rounding tolerance)
    if (Math.abs(debtor.balance) < 0.01) {
      debtors.shift();
    }
    if (Math.abs(creditor.balance) < 0.01) {
      creditors.shift();
    }
  }

  return settlements;
}

/**
 * Format currency display
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = currency === 'JPY' ? '¥' : 'NT$';
  return `${symbol}${amount.toFixed(currency === 'JPY' ? 0 : 2)}`;
}

/**
 * Convert between currencies
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number
): number {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === 'JPY' && toCurrency === 'TWD') {
    return Math.round((amount * exchangeRate) * 100) / 100;
  } else if (fromCurrency === 'TWD' && toCurrency === 'JPY') {
    return Math.round((amount / exchangeRate) * 100) / 100;
  }

  return amount;
}
