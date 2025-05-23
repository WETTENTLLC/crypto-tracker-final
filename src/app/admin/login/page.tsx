'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // TODO: Implement actual authentication logic
    if (email === 'admin@example.com' && password === 'password') {
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
