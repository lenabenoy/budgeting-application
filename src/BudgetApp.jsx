import React, { useState, useMemo } from 'react';
import './BudgetApp.css';

const CATEGORIES = ['Food', 'Rent/Utilities', 'Entertainment', 'Transportation', 'Insurance', 'Other'];

export default function BudgetApp() {
  const [budget, setBudget] = useState(2000);
  const [budgetInput, setBudgetInput] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, text: 'Groceries', amount: 150, category: 'Food', date: '2026-03-01' },
    { id: 2, text: 'Monthly Rent', amount: 1000, category: 'Rent/Utilities', date: '2026-03-02' },
    { id: 3, text: 'Movie Night', amount: 45, category: 'Entertainment', date: '2026-03-03' },
  ]);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Calculations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, item) => acc + item.amount, 0);
  }, [expenses]);

  const remainingBalance = budget - totalExpenses;
  const alertUser = remainingBalance < 0;

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    if (filterCategory === 'All') return expenses;
    return expenses.filter(exp => exp.category === filterCategory);
  }, [expenses, filterCategory]);

  // Handlers
  const handleUpdateBudget = (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput) || Number(budgetInput) <= 0) return;
    setBudget(Number(budgetInput));
    setBudgetInput('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!text || !amount || isNaN(amount) || Number(amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      text,
      amount: Number(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    setText('');
    setAmount('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="budget-container">
      <header className="budget-header">
        <h1>Finance Tracker</h1>
        <p>Keep your spending in check</p>
      </header>

      {/* Overview Cards */}
      <div className="dashboard-grid">
        <div className="card card-budget">
          <h3>Monthly Budget</h3>
          <p>${budget.toFixed(2)}</p>
        </div>
        <div className="card card-expenses">
          <h3>Total Spent</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`card card-remaining ${alertUser ? 'danger' : 'success'}`}>
          <h3>Remaining</h3>
          <p>${remainingBalance.toFixed(2)}</p>
          {alertUser && <span className="warning-text">Over Budget!</span>}
        </div>
      </div>

      <div className="main-content-grid">
        {/* Forms Section */}
        <div className="forms-section">
          {/* Update Budget Form */}
          <div className="form-card">
            <h3>Set Budget</h3>
            <form onSubmit={handleUpdateBudget} className="inline-form">
              <input 
                type="number" 
                placeholder="e.g. 2500" 
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <button type="submit">Update</button>
            </form>
          </div>

          {/* Add Expense Form */}
          <div className="form-card">
            <h3>Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="stack-form">
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  placeholder="What did you buy?" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-submit">Add Expense</button>
            </form>
          </div>
        </div>

        {/* History Section */}
        <div className="history-section">
          <div className="history-header">
            <h3>Expense Log</h3>
            <div className="filter-group">
              <label>Filter:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="expense-list">
            {filteredExpenses.length === 0 ? (
              <p className="empty-state">No expenses tracked for this category.</p>
            ) : (
              filteredExpenses.map(exp => (
                <div key={exp.id} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-title">{exp.text}</span>
                    <div className="expense-meta">
                      <span className="badge">{exp.category}</span>
                      <span className="date">{exp.date}</span>
                    </div>
                  </div>
                  <div className="expense-action">
                    <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete expense"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}