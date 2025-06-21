import React, { useState, useEffect } from 'react';

type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

type Transaction = {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    status: TransactionStatus;
};

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<TransactionStatus>('PENDING');
    const [loading, setLoading] = useState(true);

    // Search state
    const [searchDate, setSearchDate] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchStatus, setSearchStatus] = useState<TransactionStatus | ''>('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            });
    };

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount === '' || !date || !category || !status) return;
        fetch('http://localhost:8080/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                amount: Number(amount),
                date,
                category,
                status
            }),
        })
            .then(res => res.json())
            .then(newTx => {
                setTransactions([...transactions, newTx]);
                setDescription('');
                setAmount('');
                setDate('');
                setCategory('');
                setStatus('PENDING');
            });
    };

    const deleteTransaction = (id: number) => {
        fetch(`http://localhost:8080/api/transactions/${id}`, {
            method: 'DELETE'
        }).then(() => {
            setTransactions(transactions.filter(t => t.id !== id));
        });
    };

    const searchTransactions = () => {
        setLoading(true);
        let url = 'http://localhost:8080/api/transactions';
        if (searchDate) {
            url = `http://localhost:8080/api/transactions/search/date/${searchDate}`;
        } else if (searchCategory) {
            url = `http://localhost:8080/api/transactions/search/category/${searchCategory}`;
        } else if (searchStatus) {
            url = `http://localhost:8080/api/transactions/search/status/${searchStatus}`;
        }
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            });
    };

    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                    padding: '2rem',
                    maxWidth: 500,
                    width: '100%',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        marginBottom: 24,
                        letterSpacing: 1,
                        color: '#2d3748'
                    }}
                >
                    💸 Financial Tracker
                </h2>
                <div
                    style={{
                        marginBottom: 24,
                        background: balance < 0 ? '#ffe5e5' : '#e6ffed',
                        color: balance < 0 ? '#e53e3e' : '#38a169',
                        borderRadius: 8,
                        padding: '1rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: 20,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                >
                    <span style={{ color: '#2d3748' }}>Balance:</span> ${balance.toFixed(2)}
                </div>

                {/* Search Section */}
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        marginBottom: 16
                    }}
                >
                    <input
                        type="date"
                        value={searchDate}
                        onChange={e => setSearchDate(e.target.value)}
                        style={{
                            flex: 1,
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            padding: '0.3rem 0.7rem'
                        }}
                        placeholder="Search by date"
                    />
                    <select
                        value={searchCategory}
                        onChange={e => setSearchCategory(e.target.value)}
                        style={{
                            flex: 1,
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            padding: '0.3rem 0.7rem'
                        }}
                    >
                        <option value="">Category</option>
                        <option value="FOOD">Food</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="UTILITIES">Utilities</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <select
                        value={searchStatus}
                        onChange={e => setSearchStatus(e.target.value as TransactionStatus)}
                        style={{
                            flex: 1,
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            padding: '0.3rem 0.7rem'
                        }}
                    >
                        <option value="">Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                    </select>
                    <button
                        onClick={searchTransactions}
                        style={{
                            background: '#667eea',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '0.3rem 1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => {
                            setSearchDate('');
                            setSearchCategory('');
                            setSearchStatus('');
                            fetchTransactions();
                        }}
                        style={{
                            background: '#e2e8f0',
                            color: '#2d3748',
                            border: 'none',
                            borderRadius: 8,
                            padding: '0.3rem 1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Reset
                    </button>
                </div>

                {/* Add Transaction Form */}
                <form
                    onSubmit={addTransaction}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        marginBottom: 24
                    }}
                >
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        style={{
                            width: '91.5%',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: 16
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                        style={{
                            width: '91.5%',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: 16
                        }}
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        style={{
                            width: '91.5%',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: 16
                        }}
                    />
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                        style={{
                            width: '95%',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: 16
                        }}
                    >
                        <option value="">Select Category</option>
                        <option value="FOOD">Food</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="UTILITIES">Utilities</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as TransactionStatus)}
                        required
                        style={{
                            width: '95%',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: 16
                        }}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                    </select>
                    <button
                        type="submit"
                        style={{
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '0.5rem 1.2rem',
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        Add
                    </button>
                </form>

                {/* Transactions List */}
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Loading...</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {transactions.map(t => (
                            <li
                                key={t.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    marginBottom: 10,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 8,
                                    background: '#f7fafc',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                <span style={{ color: '#2d3748', fontWeight: 500 }}>
                                    {t.description}
                                </span>
                                    <span
                                        style={{
                                            color: t.amount < 0 ? '#e53e3e' : '#38a169',
                                            background: t.amount < 0 ? '#ffe5e5' : '#e6ffed',
                                            borderRadius: 6,
                                            padding: '0.2rem 0.7rem',
                                            fontWeight: 600,
                                            fontSize: 15
                                        }}
                                    >
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                </span>
                                    <button
                                        onClick={() => deleteTransaction(t.id)}
                                        style={{
                                            marginLeft: 12,
                                            background: '#e53e3e',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '0.2rem 0.7rem',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                                    <span>Date: {t.date}</span> |{' '}
                                    <span>Category: {t.category}</span> |{' '}
                                    <span>Status: {t.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;