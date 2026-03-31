import React, { useState, useEffect } from 'react';
import { usersAPI, categoriesAPI } from '../api/api';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

function Admin() {
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' или 'error'
  const [stats, setStats] = useState({ articles: 0, users: 0, categories: 0 });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersData, categoriesData, statsData] = await Promise.all([
        usersAPI.getAll(),
        categoriesAPI.getAll(),
        usersAPI.getStats()
      ]);

      setUsers(usersData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (err) {
      console.error('Admin fetch error:', err);
      showMessage('Ошибка при загрузке данных администратора', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      showMessage('Введите название категории', 'error');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      showMessage('Такая категория уже существует', 'error');
      return;
    }

    try {
      await categoriesAPI.create(newCategory);

      const updatedCategories = await categoriesAPI.getAll();
      setCategories(updatedCategories);
      setStats(prev => ({ ...prev, categories: updatedCategories.length }));

      showMessage(`Категория "${newCategory}" успешно создана!`, 'success');
      setNewCategory('');
    } catch (err) {
      showMessage('Ошибка при создании категории', 'error');
      console.error('Create category error:', err);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await usersAPI.makeAdmin(userId);

      const updatedUsers = await usersAPI.getAll();
      setUsers(updatedUsers);

      showMessage('Пользователь назначен администратором', 'success');
    } catch (err) {
      showMessage('Ошибка при назначении администратора', 'error');
      console.error('Make admin error:', err);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> ADMIN PANEL
          </h1>
        </div>
        <div className="loading">Загрузка данных администратора...</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1 className="red-title">
          <span className="red-slash">//</span> ADMIN PANEL
        </h1>
      </div>

      {message && (
        <div className={`admin-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="admin-content">
        <div className="admin-column">
          <div className="admin-section">
            <h3>Статистика</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Статей</span>
                <span className="stat-value">{stats.articles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Пользователей</span>
                <span className="stat-value">{stats.users || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Категорий</span>
                <span className="stat-value">{stats.categories || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-column">
          <div className="admin-section">
            <h3>Создать категорию</h3>
            <form onSubmit={handleCreateCategory} className="category-form">
              <input
                type="text"
                placeholder="Название категории"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-input"
                style={{ marginBottom: '15px' }}
              />
              <button type="submit" className="angled-btn black" style={{ width: '100%' }}>
                CREATE
              </button>
            </form>
          </div>
          <div className="admin-icon-note">
            <CIcon icon={cilX} className="icon-cross" /><CIcon icon={cilX} className="icon-cross" /><CIcon icon={cilX} className="icon-cross" />
          </div>
        </div>
      </div>



      <div className="admin-divider"></div>

      <div className="admin-section full-width">
        <h3>Список пользователей</h3>
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <span className="user-username">@{user.username}</span>
                <span className="user-email">{user.email}</span>
                <span className={`user-role ${user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                  {user.role === 'ROLE_ADMIN' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
              {user.role === 'ROLE_USER' && (
                <button
                  onClick={() => handleMakeAdmin(user.id)}
                  className="make-admin-btn white"
                >
                  MAKE ADMIN
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;