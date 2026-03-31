import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../api/api';
import CIcon from '@coreui/icons-react';
import { cilHeart, cilSad, cilArrowLeft, cilArrowRight } from '@coreui/icons';

function MyArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const DEFAULT_IMAGE = '/images/default-article.jpg';

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const fetchMyArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getMyArticles();
      setArticles(data);
    } catch (err) {
      setError('Ошибка при загрузке ваших статей');
      console.error('MyArticles fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId) => {
    try {
      setArticles(prevArticles =>
        prevArticles.map(article => {
          if (article.id === articleId) {
            const currentUser = localStorage.getItem('username');
            const likedByUsers = article.likedByUsers || [];
            const isLiked = likedByUsers.includes(currentUser);

            const newLikedByUsers = isLiked
              ? likedByUsers.filter(user => user !== currentUser)
              : [...likedByUsers, currentUser];

            return {
              ...article,
              likedByUsers: newLikedByUsers,
              likesCount: newLikedByUsers.length
            };
          }
          return article;
        })
      );

      await articlesAPI.like(articleId);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const categories = [...new Set(articles
    .filter(article => article.category && article.category.trim() !== '')
    .map(article => article.category))];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  const handleDelete = async (articleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await articlesAPI.delete(articleId);
        setArticles(prev => prev.filter(article => article.id !== articleId));
      } catch (err) {
        console.error('Delete error:', err);
        fetchMyArticles();
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/create-article');
  };

  if (loading) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> MY ARTICLES
          </h1>
        </div>
        <div className="loading">Загрузка ваших статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> MY ARTICLES
          </h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> MY ARTICLES
          </h1>
          <p className="page-subtitle">Статьи пользователя @{localStorage.getItem('username')}</p>
        </div>

        <div className="no-articles">
          <p>У вас пока нет статей <CIcon icon={cilSad} className="icon-small" /> . Создайте свою первую статью!</p>
          <button onClick={handleCreateNew} className="angled-btn white">
            CREATE FIRST ARTICLE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1 className="red-title">
          <span className="red-slash">//</span> MY ARTICLES
        </h1>
        <p className="page-subtitle">Статьи пользователя @{localStorage.getItem('username')}</p>
      </div>

      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">Все мои категории</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => {
          const likedByUsers = article.likedByUsers || [];
          const likesCount = article.likesCount || likedByUsers.length;
          const currentUser = localStorage.getItem('username');
          const isLiked = likedByUsers.includes(currentUser);
          const categoryName = article.category || 'Без категории';
          const authorName = article.author || 'Аноним';

          return (
              <div key={article.id} className="article-card-with-image">            <div className="article-image-container">
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
                <span className="article-category">#{categoryName}</span>
                <button
                  className={`like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(article.id)}
                >
                  <CIcon icon={cilHeart} size="sm" className="icon-small" /> {likesCount}
                </button>
              </div>

              <h3 className="article-title">
                <span className="red-slash">//</span> {article.title}
              </h3>

              <div className="article-meta">
                <span className="article-author">@{authorName}</span>
              </div>

              <p className="article-preview">
                {article.content && article.content.length > 100
                  ? `${article.content.substring(0, 100)}...`
                  : article.content || ''}
              </p>

              <div className="article-actions-my">


                <div className="my-articles-buttons">
                  <Link
                    to={`/edit-article/${article.id}`}
                    className="angled-btn black small-btn"
                  >
                    EDIT
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="angled-btn delete-btn small-btn"
                  >
                    DELETE
                  </button>
                </div>
                <Link to={`/article/${article.id}`} className="read-more">
                                  MORE <CIcon icon={cilArrowRight} className="icon-small" />
                                </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="create-new-section-my">
        <button onClick={handleCreateNew} className="angled-btn white">
          CREATE NEW
        </button>
      </div>
    </div>
  );
}

export default MyArticles;