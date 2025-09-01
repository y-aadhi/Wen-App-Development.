import { useState } from 'react';
import { login } from '../utils/api';

export default function Login({ setToken, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      setToken(res.data.token);
      setRole(res.data.role);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
