import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login/student', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('userName', res.data.user.name);
      navigate('/dashboard'); // Student Dashboard එකට යැවීම
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">Science Portal</h2>
        <p className="text-center text-gray-500 mb-6">Student Login</p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" placeholder="Enter username" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="Enter password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition duration-200">Login</button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">New Student? <Link to="/register" className="text-blue-500 font-bold hover:underline">Register Here</Link></p>
        <div className="border-t mt-6 pt-4 text-center">
          <Link to="/admin-login" className="text-xs text-gray-400 hover:text-gray-600 font-semibold">Teacher Login Portal &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
export default StudentLogin;