import { useState, useEffect } from 'react';
import './App.css';
import API_BASE_URL from './config'; // Import API_BASE_URL from config.js

function BudgetApp() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []); // Fetch transactions on component mount

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        updateBudget(data.transactions);
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to fetch transactions. Please try again.');
    }
  };

  const addTransaction = async () => {
    if (description.trim() === '' || amount === '') {
      alert('Please enter a valid description and amount.');
      return;
    }

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type: transactionType,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        const savedTransaction = await response.json();
        setTransactions([...transactions, savedTransaction]);
        updateBudget(savedTransaction);
        setDescription('');
        setAmount('');
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
        const deletedTransaction = transactions.find(transaction => transaction.id === id);
        if (deletedTransaction) {
          const multiplier = deletedTransaction.type === 'income' ? 1 : -1;
          setBudget(prevBudget => prevBudget - (multiplier * deletedTransaction.amount));
        }
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const updateBudget = (transactions) => {
    const totalIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpenses = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    setBudget(totalIncome - totalExpenses);
  };

  return (
    <div className="container">
      <img src='logo.png' alt="Logo" />
      <h1>Budget Compass</h1>
      
      <div className="budget-info">
        <div className="budget-amount">
          <p>Budget: ${budget.toFixed(2)}</p>
        </div>
        {/* Display other budget info (income, expenses) here */}
      </div>

      <div className="input-section">
        <select
          id="transaction-type"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          id="amount"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button id="add-transaction" onClick={addTransaction}>
          Add
        </button>
      </div>

      <div className="transactions">
        <h2>Transactions</h2>
        <ul id="transaction-list">
        {transactions.map((transaction) => (
  <li key={transaction.id} className={transaction.type}>
    <span className="transaction-description">{transaction.description}</span>
    {typeof transaction.amount === 'number' && (
      <span className="transaction-amount">
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </span>
    )}
    <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
  </li>
))} 

        </ul>
      </div>
    </div>
  );
}

export default BudgetApp;
