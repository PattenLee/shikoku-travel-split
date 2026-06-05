import { useState } from 'react';
import { useExpense } from './context/ExpenseContext';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import SettlementPage from './pages/SettlementPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

type Page = 'home' | 'add-expense' | 'settlement' | 'settings';

function App() {
  const { isLoading } = useExpense();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading">載入中...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>四國旅行分攤</h1>
        <p>4 人費用分攤記帳</p>
      </header>

      <main className="app-main">
        {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === 'add-expense' && <AddExpensePage onNavigate={setCurrentPage} />}
        {currentPage === 'settlement' && <SettlementPage onNavigate={setCurrentPage} />}
        {currentPage === 'settings' && <SettingsPage onNavigate={setCurrentPage} />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          首頁
        </button>
        <button
          className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentPage('settings')}
        >
          設置
        </button>
      </nav>
    </div>
  );
}

export default App;
