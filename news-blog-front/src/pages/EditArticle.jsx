import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../api/api';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleLoading, setArticleLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setArticleLoading(true);
        const [articleData, categoriesData] = await Promise.all([
          articlesAPI.getById(id),
          categoriesAPI.getAll()
        ]);

        setTitle(articleData.title);
        setImageUrl(articleData.imageUrl || '');
        setContent(articleData.content);
        const categoryId = categoriesData.find(cat => cat.name === articleData.category)?.id || '';
        setCategoryId(categoryId);
        setCategories(categoriesData);
      } catch (err) {
        setError('Ошибка при загрузке данных статьи');
        console.error('EditArticle fetch error:', err);
      } finally {
        setArticleLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

      await articlesAPI.update(id, articleData);

      setSuccess('Статья успешно обновлена!');

      setTimeout(() => {
        navigate(`/article/${id}`);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Ошибка при обновлении статьи');
      console.error('Update article error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/article/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await articlesAPI.delete(id);
        navigate('/my-articles');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Ошибка при удалении статьи: ' + (err.message || ''));
      }
    }
  };

  if (articleLoading) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="form-container">
            <h1 className="red-title">
              <span className="red-slash">//</span> EDIT ARTICLE
            </h1>
            <div className="loading">Загрузка данных...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-container">
          <h1 className="red-title">
            <span className="red-slash">//</span> EDIT ARTICLE
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
                  disabled={loading}
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
                  rows="10"
                />
              </div>
            </div>

            <div className="button-group edit-page-buttons">
              <button
                type="submit"
                className="angled-btn black edit-page-btn"
                disabled={loading}
              >
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button
                type="button"
                className="angled-btn white edit-page-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="angled-btn delete-btn edit-page-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                DELETE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditArticle;