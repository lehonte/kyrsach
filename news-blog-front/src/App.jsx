import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './pages/Layout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Articles from './pages/Articles';
import MyArticles from './pages/MyArticles';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Admin from './pages/Admin';
import './App.css';
import './index.css';

function RedirectRoute() {
  const { token } = useAuth();
  return <Navigate to={token ? "/articles" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/articles" replace />} />
        <Route path="articles" element={<Articles />} />
        <Route path="my-articles" element={<MyArticles />} />
        <Route path="article/:id" element={<ArticleDetail />} />
        <Route path="create-article" element={<CreateArticle />} />
        <Route path="edit-article/:id" element={<EditArticle />} />
        <Route path="admin" element={<Admin />} />
      </Route>
      
      <Route path="*" element={<RedirectRoute />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

