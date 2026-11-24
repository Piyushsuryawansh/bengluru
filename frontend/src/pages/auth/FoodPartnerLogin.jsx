import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.Frontend_URL}/api/auth/food-partner/login`, {
        email: e.target.email.value.trim(),
        password: e.target.password.value,
      }, { withCredentials: true });
      navigate(location.state?.from || '/create-food', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="error-text" role="alert">{error}</p>}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;