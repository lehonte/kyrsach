import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../api/api';
import CIcon from '@coreui/icons-react';
import { cilHeart, cilSad, cilArrowLeft, cilArrowRight } from '@coreui/icons';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ROLE_ADMIN';
  const DEFAULT_IMAGE = '/images/default-article.jpg';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          articlesAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Ошибка при загрузке статей');
        console.error('Articles fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (articleId) => {
    try {
      await articlesAPI.like(articleId);
      const updatedArticles = await articlesAPI.getAll();
      setArticles(updatedArticles);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  if (loading) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> ARTICLES
          </h1>
        </div>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> ARTICLES
          </h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1 className="red-title">
          <span className="red-slash">//</span> ARTICLES
        </h1>
      </div>

      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">Все категории</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => (
          <div key={article.id} className="article-card-with-image">
          <div className="article-image-container">
                  <img
                    src={article.imageUrl || DEFAULT_IMAGE}
                    alt={article.title}
                    className="article-image"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
             <div className="article-content">
            <div className="article-header">
              <span className="article-category">#{article.category || 'Без категории'}</span>
              <button
                className="like-btn"
                onClick={() => handleLike(article.id)}
              >
                <CIcon icon={cilHeart} size="sm" className="icon-small" /> {article.likesCount || 0}
              </button>
            </div>

            <h3 className="article-title">
              <span className="red-slash">//</span> {article.title}
            </h3>

            <div className="article-meta">
              <span className="article-author">@{article.author || 'Аноним'}</span>
            </div>

            <p className="article-preview">
              {article.content && article.content.length > 100
                ? `${article.content.substring(0, 100)}...`
                : article.content || ''}
            </p>

            <Link to={`/article/${article.id}`} className="read-more">
              MORE <CIcon icon={cilArrowRight} className="icon-small" />
            </Link>
          </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="no-articles">
          <p>Статей пока нет <CIcon icon={cilSad} className="icon-small" /> . Будьте первым, кто создаст статью!</p>
          <Link to="/create-article" className="create-first-btn">
            CREATE FIRST ARTICLE
          </Link>
        </div>
      )}
    </div>
  );
}

export default Articles;