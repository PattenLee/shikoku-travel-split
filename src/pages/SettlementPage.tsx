import { useState } from 'react';
import { useExpense, useMemberSummaries, useSettlements } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/expenseUtils';

interface SettlementPageProps {
  onNavigate: (page: 'home' | 'add-expense' | 'settlement' | 'settings') => void;
}

export default function SettlementPage({ onNavigate }: SettlementPageProps) {
  const { state, deleteExpense } = useExpense();
  const summaries = useMemberSummaries();
  const settlements = useSettlements();
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

  const handleDeleteExpense = (id: string) => {
    if (confirm('確定要刪除此消費記錄嗎？')) {
      deleteExpense(id);
      alert('消費記錄已刪除');
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">結算詳情</h2>

      {/* Member Summaries */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>
        每人消費總覽
      </h3>
      <div style={{ marginBottom: '1.5rem' }}>
        {summaries.map((summary) => (
          <div key={summary.memberId} className="card">
            <div className="card-title">{summary.memberName}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
              <div>已付金額：{formatCurrency(summary.totalPaid, state.currency)}</div>
              <div>應付金額：{formatCurrency(summary.totalOwed, state.currency)}</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600, color: summary.balance > 0 ? 'var(--success)' : 'var(--error)' }}>
                {summary.balance > 0 ? '應收' : '應付'}：{formatCurrency(Math.abs(summary.balance), state.currency)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settlements */}
      {settlements.length > 0 && (
        <>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>
            結算建議
          </h3>
          <div className="settlement-list">
            {settlements.map((settlement, index) => (
              <div key={index} className="settlement-item">
                <div className="settlement-text">
                  <strong>{settlement.fromName}</strong> 應付 <strong>{settlement.toName}</strong>{' '}
                  <span className="settlement-amount">{formatCurrency(settlement.amount, state.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Expenses List */}
      {state.expenses.length > 0 && (
        <>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>
            消費記錄
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            {state.expenses.map((expense) => {
              const paidByMember = state.members.find((m) => m.id === expense.paidBy);
              const isExpanded = expandedExpense === expense.id;

              return (
                <div
                  key={expense.id}
                  className="expense-item"
                  onClick={() => setExpandedExpense(isExpanded ? null : expense.id)}
                >
                  <div className="expense-header">
                    <div>
                      <div className="expense-title">{expense.title}</div>
                      <div className="expense-payer">{paidByMember?.name} 付款</div>
                    </div>
                    <div className="expense-amount">{formatCurrency(expense.amount, expense.currency)}</div>
                  </div>

                  {isExpanded && (
                    <div className="expense-details">
                      <div className="expense-split-label">分攤對象</div>
                      <div className="expense-split-tags">
                        {expense.splitAmong.map((memberId) => {
                          const member = state.members.find((m) => m.id === memberId);
                          return (
                            <span key={memberId} className="split-tag">
                              {member?.name}
                            </span>
                          );
                        })}
                      </div>

                      <div className="expense-actions">
                        <button
                          className="expense-delete-btn"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {state.expenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">還沒有消費記錄</div>
        </div>
      )}

      {/* Back Button */}
      <button className="button button-secondary" onClick={() => onNavigate('home')} style={{ width: '100%' }}>
        返回首頁
      </button>
    </div>
  );
}
