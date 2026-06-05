import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { calculateSplitAmount, formatCurrency } from '../utils/expenseUtils';

interface AddExpensePageProps {
  onNavigate: (page: 'home' | 'add-expense' | 'settlement' | 'settings') => void;
}

export default function AddExpensePage({ onNavigate }: AddExpensePageProps) {
  const { state, addExpense } = useExpense();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(state.members[0]?.id || '');
  const [splitAmong, setSplitAmong] = useState<Set<string>>(
    new Set(state.members.map((m) => m.id))
  );

  const handleToggleSplit = (memberId: string) => {
    const newSplit = new Set(splitAmong);
    if (newSplit.has(memberId)) {
      newSplit.delete(memberId);
    } else {
      newSplit.add(memberId);
    }
    setSplitAmong(newSplit);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('請輸入項目名稱');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount))) {
      alert('請輸入有效的金額');
      return;
    }

    if (splitAmong.size === 0) {
      alert('請至少選擇一個分攤對象');
      return;
    }

    addExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      currency: state.currency,
      paidBy,
      splitAmong: Array.from(splitAmong),
      date: Date.now(),
    });

    alert('消費記錄已新增');
    onNavigate('home');
  };

  return (
    <div className="page">
      <h2 className="page-title">新增消費</h2>

      {/* Title Input */}
      <div className="form-group">
        <label className="form-label">項目名稱</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：晚餐"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Amount Input */}
      <div className="form-group">
        <label className="form-label">金額 ({state.currency})</label>
        <input
          className="form-input"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
        />
      </div>

      {/* Paid By */}
      <div className="form-group">
        <label className="form-label">付款人</label>
        <div className="member-list">
          {state.members.map((member) => (
            <button
              key={member.id}
              className={`member-item ${paidBy === member.id ? 'selected' : ''}`}
              onClick={() => setPaidBy(member.id)}
              style={{
                backgroundColor: paidBy === member.id ? 'var(--primary)' : 'var(--surface)',
                color: paidBy === member.id ? 'var(--background)' : 'var(--foreground)',
                border: paidBy === member.id ? 'none' : '1px solid var(--border)',
              }}
            >
              <span className="member-name">{member.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split Among */}
      <div className="form-group">
        <label className="form-label">分攤對象</label>
        <div className="member-list">
          {state.members.map((member) => (
            <label key={member.id} className="member-item" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="member-checkbox"
                checked={splitAmong.has(member.id)}
                onChange={() => handleToggleSplit(member.id)}
              />
              <span className="member-name">{member.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Split Preview */}
      {amount && splitAmong.size > 0 && (
        <div className="card">
          <div className="card-title">分攤預覽</div>
          <div className="card-text">
            每人應付：{formatCurrency(
              calculateSplitAmount(parseFloat(amount), splitAmong.size),
              state.currency
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button className="button button-secondary" onClick={() => onNavigate('home')}>
          取消
        </button>
        <button className="button button-primary" onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  );
}
