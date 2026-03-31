import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = { username, password };
      const response = await authAPI.login(credentials);

      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      localStorage.setItem('role', response.role);

      navigate('/articles');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-container">
          <h1 className="red-title">
            <span className="red-slash">//</span> LOGIN
          </h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
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
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="angled-btn black"
                disabled={loading}
              >
                {loading ? 'ENTIRING...' : 'LOG IN'}
              </button>
              <button
                type="button"
                className="angled-btn white"
                onClick={handleRegisterClick}
                disabled={loading}
              >
                NO ACC
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;