import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

interface SettingsPageProps {
  onNavigate: (page: 'home' | 'add-expense' | 'settlement' | 'settings') => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { state, setExchangeRate, clearAllData } = useExpense();
  const [exchangeRate, setExchangeRateInput] = useState(state.exchangeRate.toString());

  const handleSaveExchangeRate = () => {
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      alert('請輸入有效的匯率');
      return;
    }
    setExchangeRate(rate);
    alert('匯率已更新');
  };

  const handleClearData = () => {
    if (confirm('確定要清空所有數據嗎？此操作無法復原。')) {
      clearAllData();
      alert('所有數據已清空');
      onNavigate('home');
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">設置</h2>

      {/* Exchange Rate */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>
        匯率設置
      </h3>
      <div className="card">
        <label className="form-label">日幣 (¥) 對台幣 (NT$) 匯率</label>
        <input
          className="form-input"
          type="number"
          placeholder="3.5"
          value={exchangeRate}
          onChange={(e) => setExchangeRateInput(e.target.value)}
          step="0.01"
          style={{ marginBottom: '1rem' }}
        />
        <button className="button button-primary" onClick={handleSaveExchangeRate} style={{ width: '100%' }}>
          保存匯率
        </button>
      </div>

      {/* Current Settings */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--foreground)' }}>
        當前設置
      </h3>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--muted)' }}>當前幣別</span>
          <span style={{ fontWeight: 600 }}>{state.currency === 'JPY' ? '日幣 (¥)' : '台幣 (NT$)'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--muted)' }}>匯率</span>
          <span style={{ fontWeight: 600 }}>1 ¥ = {state.exchangeRate} NT$</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--muted)' }}>消費記錄數</span>
          <span style={{ fontWeight: 600 }}>{state.expenses.length}</span>
        </div>
      </div>

      {/* Danger Zone */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--error)' }}>
        危險區域
      </h3>
      <button className="button button-danger" onClick={handleClearData} style={{ width: '100%' }}>
        清空所有數據
      </button>

      {/* Back Button */}
      <button className="button button-secondary" onClick={() => onNavigate('home')} style={{ width: '100%', marginTop: '1.5rem' }}>
        返回首頁
      </button>
    </div>
  );
}
