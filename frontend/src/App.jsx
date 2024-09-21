import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Toaster position="top-right" />
      {token && <Header />}
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;