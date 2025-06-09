import React from 'react';
import './Login.css';

function Login({ selectedUser, handleUserChange, handleLogin, isLoggedIn, zimInstance }) {
  return (
    <div className="login-section">
      <select value={selectedUser} onChange={handleUserChange} disabled={isLoggedIn}>
        <option value="suraj">Suraj</option>
        <option value="aman">Aman</option>
      </select>
      <button onClick={handleLogin} disabled={isLoggedIn || !zimInstance}>
        Login as {selectedUser === 'suraj' ? 'Suraj' : 'Aman'}
      </button>
    </div>
  );
}

export default Login;