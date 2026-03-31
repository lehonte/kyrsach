import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      setLoading(false);
      return;
    }

    try {
      const userData = { username, email, password };
      await authAPI.register(userData);

      setSuccess('Регистрация успешна! Теперь вы можете войти.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-container">
          <h1 className="red-title">
            <span className="red-slash">//</span> REGISTRATION
          </h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <div className="input-field full">
                <label>USERNAME</label>
                <input
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <div className="input-field full">
                <label>EMAIL</label>
                <input
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <div className="input-field">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <div className="input-field">
                <label>CONFIRM PASSWORD</label>
                <input
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="angled-btn black"
                disabled={loading}
              >
                {loading ? 'REGISTRATION...' : 'CREATE ACC'}
              </button>
              <button
                type="button"
                className="angled-btn white"
                onClick={handleBackClick}
                disabled={loading}
              >
                BACK
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;