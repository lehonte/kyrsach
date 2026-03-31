import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../api/api';
import CIcon from '@coreui/icons-react';
import { cilHeart, cilSad, cilArrowLeft, cilArrowRight } from '@coreui/icons';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const username = localStorage.getItem('username');

  const userRole = localStorage.getItem('role');
  const DEFAULT_IMAGE = '/images/default-article.jpg';

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await articlesAPI.getById(id);
        const likedBy = Array.isArray(data.likedByUsers) ? data.likedByUsers : [];
        setArticle({ ...data, likedByUsers: likedBy });
        setLikes(data.likedByUsers?.length || 0);
        setHasLiked(username ? likedBy.includes(username) : false);
      } catch (err) {
        setError('Статья не найдена или произошла ошибка');
        console.error('ArticleDetail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (!article || !username) return;

    try {
      const updatedArticle = await articlesAPI.like(id);

      const fresh = await articlesAPI.getById(id);
      const likedBy = Array.isArray(fresh.likedByUsers) ? fresh.likedByUsers : [];
      const liked = username ? likedBy.includes(username) : false;

      setArticle({ ...fresh, likedByUsers: likedBy });
      setLikes(likedBy.length);
      setHasLiked(liked);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const currentUser = localStorage.getItem('username');
  const isAuthor = article?.author === currentUser;

  const isAdmin = userRole === 'ROLE_ADMIN';

  const canEdit = isAuthor || isAdmin;

  const handleDelete = async () => {
    if (!canEdit) return;

    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await articlesAPI.delete(id);
        navigate('/articles');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Ошибка при удалении статьи');
      }
    }
  };

  if (loading) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> LOADING...
          </h1>
        </div>
        <div className="loading">Загрузка статьи...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="articles-page">
        <div className="page-header">
          <h1 className="red-title">
            <span className="red-slash">//</span> NOT FOUND <CIcon icon={cilSad} className="icon-small" />
          </h1>
        </div>
        <div className="no-articles">
          <p>Статья не найдена или была удалена.</p>
          <button onClick={() => navigate('/articles')} className="angled-btn white">
            <CIcon icon={cilArrowLeft} className="icon-small" />BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1 className="red-title">
          <span className="red-slash">//</span> {article.title}
        </h1>
      </div>

      <div className="article-detail-container">
        <div className="article-detail-card">
          <div className="article-detail-top">
            <div className="article-detail-image-container">
              <img
                src={article.imageUrl || DEFAULT_IMAGE}
                alt={article.title}
                className="article-detail-image"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </div>

            <div className="article-detail-meta-column">
              <div className="article-detail-category">
                #{article.category || 'Без категории'}
              </div>

              <button
                onClick={handleLike}
                className={`like-btn ${hasLiked ? 'liked' : ''}`}
              >
                <CIcon icon={cilHeart} className="icon-small" />{likes}
              </button>

              <div className="article-detail-author-info">
                <span className="article-detail-author">@{article.author}</span>
                {isAdmin && !isAuthor && (
                  <span className="article-admin-badge">
                    (Admin mode)
                  </span>
                )}
              </div>

              <div className="article-detail-actions-group">
                {canEdit && (
                  <div className="article-detail-actions-row">
                    <button
                      onClick={() => navigate(`/edit-article/${article.id}`)}
                      className="angled-btn black"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={handleDelete}
                      className="angled-btn delete-btn"
                    >
                      DELETE
                    </button>
                  </div>
                )}

                <button
                  onClick={() => navigate('/articles')}
                  className="angled-btn white article-detail-back-btn"
                >
                  <CIcon icon={cilArrowLeft} className="icon-small" /> BACK
                </button>
              </div>
            </div>
          </div>

          <div className="article-detail-content-bottom">
            {article.content && article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      </div>

  );
}

export default ArticleDetail;