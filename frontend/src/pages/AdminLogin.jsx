// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Eye, EyeOff, Award } from 'lucide-react';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login/admin', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('userName', res.data.user.name);
      navigate('/admin/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05070F] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* 🔴 Deep Crimson/Purple Glowing Blobs for Admin Security Theme */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px]" />

      {/* 🏢 Glassmorphic Admin Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Headings */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-500 flex items-center justify-center text-gray-900 font-black shadow-lg shadow-indigo-500/20 mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] text-teal-400 uppercase tracking-widest font-black block mb-1">LMS Security</span>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">TEACHER PORTAL</h2>
          <p className="text-xs text-slate-400 font-medium">Authorized administration access only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl mb-6 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          
          {/* Admin Username Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Admin Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Shield className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Enter admin username" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all font-medium text-sm"
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-11 pr-12 py-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all font-medium text-sm"
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-teal-400 to-indigo-500 text-gray-950 font-black rounded-2xl shadow-lg shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition duration-200 mt-6 text-sm uppercase tracking-wider flex items-center justify-center"
          >
            {isLoading ? "Verifying..." : "Access Control Panel"}
          </button>
        </form>

        {/* Back to Student Portal Switch */}
        <div className="border-t border-slate-800 mt-6 pt-4 text-center">
          <Link to="/login" className="text-xs text-slate-500 hover:text-teal-400 font-bold transition">
            &larr; Back to Student Portal
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;