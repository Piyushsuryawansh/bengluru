import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.Frontend_URL}/api/auth/user/login`, {
        email: e.target.email.value.trim(),
        password: e.target.password.value,
      }, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="error-text" role="alert">{error}</p>}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;