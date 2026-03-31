import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import HoverVideo from './HoverVideo';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

function Layout() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || "testuser";
  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN'
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className={`nav-container ${menuOpen ? 'menu-open' : ''}`}>
          <div className="nav-left-icon">
            <CIcon icon={cilX} className="icon-layout" />
            <CIcon icon={cilX} className="icon-layout" />
            <CIcon icon={cilX} className="icon-layout" />
           </div>
          <div className="nav-left">
            <span className="nav-logo">NEWS_BLOG</span>
          </div>

          <div className="nav-center">
            <Link to="/articles" className="nav-link">
              <span className="nav-slash">//</span> ARTICLES
            </Link>
            <Link to="/my-articles" className="nav-link">
              <span className="nav-slash">//</span> MY ARTICLES
            </Link>
            <Link to="/create-article" className="nav-link">
              <span className="nav-slash">//</span> CREATE ARTICLE
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link">
                <span className="nav-slash">//</span> ADMIN
              </Link>
            )}
          </div>

          <div className="nav-right">
            <span className="nav-user">@{username}</span>
            <button onClick={handleLogout} className="nav-logout">
              <span className="nav-slash">//</span> LOGOUT
            </button>
            <button
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
      
      <HoverVideo />
    </div>
  );
}

export default Layout;