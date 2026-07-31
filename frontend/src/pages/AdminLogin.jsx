import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login/admin', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('userName', res.data.user.name);
      navigate('/admin/dashboard'); // Admin Dashboard එකට යැවීම
    } catch (err) {
      setError(err.response?.data?.message || 'Admin Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-emerald-400 mb-2">Teacher Portal</h2>
        <p className="text-center text-gray-400 mb-6">Science Class Administration</p>

        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/30">{error}</div>}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Admin Username</label>
            <input type="text" placeholder="Teacher Username" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold p-3 rounded-lg transition duration-200">Access Control Panel</button>
        </form>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-gray-200 font-semibold">&larr; Back to Student Portal</Link>
        </div>
      </div>
    </div>
  );
}
export default AdminLogin;