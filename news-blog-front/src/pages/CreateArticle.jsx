import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../api/api';

function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Categories fetch error:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!title.trim()) {
      setError('Введите заголовок статьи');
      setLoading(false);
      return;
    }
    if (!content.trim()) {
      setError('Введите содержание статьи');
      setLoading(false);
      return;
    }
    if (!categoryId) {
      setError('Выберите категорию');
      setLoading(false);
      return;
    }

    try {
      const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId));
      if (!selectedCategory) {
        setError('Категория не найдена');
        setLoading(false);
        return;
      }

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory.name,
        imageUrl: imageUrl.trim()
      };

      await articlesAPI.create(articleData);

      setSuccess('Статья успешно создана!');

      setTimeout(() => {
        navigate('/articles');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Ошибка при создании статьи');
      console.error('Create article error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-container">
          <h1 className="red-title">
            <span className="red-slash">//</span> CREATE ARTICLE
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

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-field full">
                <label>TITLE</label>
                <input
                  type="text"
                  placeholder="Введите заголовок статьи"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="input-field full">
                <label>CATEGORY</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="form-select"
                  required
                  disabled={loading || categories.length === 0}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-field full">
                <label>IMAGE URL (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="input-field full">
                <label>CONTENT</label>
                <textarea
                  placeholder="Содержание статьи..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={loading}
                  className="form-textarea"
                  rows="8"
                />
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="angled-btn black"
                disabled={loading}
              >
                {loading ? 'CREATING...' : 'PUBLISH'}
              </button>
              <button
                type="button"
                className="angled-btn white"
                onClick={handleCancel}
                disabled={loading}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle;