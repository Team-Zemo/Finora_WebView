import React, { useState, useEffect } from 'react';

type Transaction = {
    id: number;
    description: string;
    amount: number;
};

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            });
    }, []);

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount === '') return;
        fetch('http://localhost:8080/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                amount: Number(amount)
            }),
        })
            .then(res => res.json())
            .then(newTx => {
                setTransactions([...transactions, newTx]);
                setDescription('');
                setAmount('');
            });
    };

    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                padding: '2rem',
                maxWidth: 400,
                width: '100%',
                fontFamily: 'Inter, sans-serif'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: 24,
                    letterSpacing: 1,
                    color: '#2d3748'
                }}>💸 Financial Tracker</h2>
                <div style={{
                    marginBottom: 24,
                    background: balance < 0 ? '#ffe5e5' : '#e6ffed',
                    color: balance < 0 ? '#e53e3e' : '#38a169',
                    borderRadius: 8,
                    padding: '1rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    <span style={{ color: '#2d3748' }}>Balance:</span> ${balance.toFixed(2)}
                </div>
                <form onSubmit={addTransaction} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginBottom: 24
                }}>
                    <div>
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
                    </div>
                    <div>
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
                                fontSize: 16,
                            }}
                        />
                    </div>
                    <button type="submit" style={{
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1.2rem',
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}>Add</button>
                </form>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Loading...</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {transactions.map(t => (
                            <li key={t.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 10,
                                padding: '0.5rem 0.75rem',
                                borderRadius: 8,
                                background: '#f7fafc',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                            }}>
                                <span style={{ color: '#2d3748', fontWeight: 500 }}>{t.description}</span>
                                <span style={{
                                    color: t.amount < 0 ? '#e53e3e' : '#38a169',
                                    background: t.amount < 0 ? '#ffe5e5' : '#e6ffed',
                                    borderRadius: 6,
                                    padding: '0.2rem 0.7rem',
                                    fontWeight: 600,
                                    fontSize: 15
                                }}>
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;