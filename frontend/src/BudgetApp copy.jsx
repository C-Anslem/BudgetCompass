import { useState } from 'react';
import './App.css';

function BudgetApp() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [transactionType, setTransactionType] = useState('income');
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const addTransaction = () => {
    if (description.trim() === '' || amount === 0) {
      alert('Please enter a valid description and amount.');
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      description,
      amount,
      type: transactionType,
    };

    setTransactions([...transactions, newTransaction]);

    if (transactionType === 'income') {
      setIncome(income + amount);
      setBudget(budget + amount);
    } else {
      setExpenses(expenses + amount);
      setBudget(budget - amount);
    }

    setDescription('');
    setAmount(0); 
  };


  return (
    <div className="container">
      <img  src='logo.png' />
      <h1>Budget Compass</h1>
      
      <div className="budget-info">
        <div className="budget-amount">
          <p>Budget: ${budget.toFixed(2)}</p>
        </div>
        <div className="income-amount">
          <p>Income: ${income.toFixed(2)}</p>
        </div>
        <div className="expense-amount">
          <p>Expenses: ${expenses.toFixed(2)}</p>
        </div>
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
          onChange={(e) => setAmount(parseFloat(e.target.value))}
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
              <span className="transaction-amount">
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              {/* <button onClick={() => deleteTransaction(transaction.id)}>Delete</button> */}
            </li>     
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BudgetApp;