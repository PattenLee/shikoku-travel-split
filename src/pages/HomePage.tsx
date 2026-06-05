import { useExpense, useMemberSummaries } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/expenseUtils';

interface HomePageProps {
  onNavigate: (page: 'home' | 'add-expense' | 'settlement' | 'settings') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { state, setCurrency } = useExpense();
  const summaries = useMemberSummaries();

  const totalExpenses = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="page">
      {/* Currency Selector */}
      <div className="currency-selector">
        <button
          className={`currency-button ${state.currency === 'JPY' ? 'active' : ''}`}
          onClick={() => setCurrency('JPY')}
        >
          日幣 (¥)
        </button>
        <button
          className={`currency-button ${state.currency === 'TWD' ? 'active' : ''}`}
          onClick={() => setCurrency('TWD')}
        >
          台幣 (NT$)
        </button>
      </div>

      {/* Total Expenses */}
      <div className="card" style={{ backgroundColor: 'rgba(10, 126, 164, 0.1)', borderColor: 'rgba(10, 126, 164, 0.2)' }}>
        <div className="card-title">總消費金額</div>
        <div className="card-value" style={{ color: 'var(--primary)' }}>
          {formatCurrency(totalExpenses, state.currency)}
        </div>
      </div>

      {/* Member Summaries */}
      <h2 className="page-title">成員狀態</h2>
      <div>
        {summaries.map((summary) => (
          <div key={summary.memberId} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div className="card-title">{summary.memberName}</div>
              <div
                className="balance-indicator"
                style={{
                  backgroundColor:
                    summary.balance > 0
                      ? 'rgba(34, 197, 94, 0.1)'
                      : summary.balance < 0
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(104, 112, 118, 0.1)',
                  color:
                    summary.balance > 0
                      ? 'var(--success)'
                      : summary.balance < 0
                      ? 'var(--error)'
                      : 'var(--muted)',
                }}
              >
                {summary.balance > 0
                  ? `應收 ${formatCurrency(summary.balance, state.currency)}`
                  : summary.balance < 0
                  ? `應付 ${formatCurrency(Math.abs(summary.balance), state.currency)}`
                  : '已結清'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
              <span>已付：{formatCurrency(summary.totalPaid, state.currency)}</span>
              <span>應付：{formatCurrency(summary.totalOwed, state.currency)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button className="button button-primary" onClick={() => onNavigate('add-expense')}>
          新增消費
        </button>
        <button className="button button-secondary" onClick={() => onNavigate('settlement')}>
          查看結算
        </button>
      </div>
    </div>
  );
}
