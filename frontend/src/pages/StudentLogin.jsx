// frontend/src/pages/StudentLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Eye, EyeOff, Beaker } from 'lucide-react';

function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login/student', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('userName', res.data.user.name);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070913] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* 🔮 3D Fluid Glowing Blobs (ඔයා එවපු පින්තූරයේ ඇති Glowing Waves මෙන්) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450h-450px] h-[450px] rounded-full bg-indigo-500/20 blur-[130px]" />
      
      {/* Organic Fluid Wavy Vectors (Tailwind Custom Curves) */}
      <div className="absolute inset-0 opacity-30 select-none pointer-events-none z-0">
        <svg className="absolute top-20 left-10 w-80 h-80 text-emerald-500/10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M45,-60C58.3,-50.2,69.1,-36.1,73.1,-20.3C77.1,-4.6,74.3,12.8,67.3,28.8C60.2,44.8,49,59.3,34.2,67.2C19.3,75,0.9,76.2,-17.1,72C-35.1,67.8,-52.7,58.2,-63.8,43.2C-74.8,28.2,-79.3,7.8,-76.3,-11.2C-73.3,-30.2,-62.8,-47.8,-47.8,-57.2C-32.8,-66.6,-13.3,-67.7,2,-70.5C17.3,-73.2,29,-69.8,45,-60Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-20 right-10 w-96 h-96 text-indigo-500/10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M38.1,-52.2C49.9,-43.8,59.5,-31.6,63.4,-17.6C67.3,-3.6,65.5,12.2,59.4,26.7C53.3,41.2,42.8,54.4,29,61.9C15.2,69.4,-2,71.2,-18.2,67.2C-34.4,63.1,-49.6,53.2,-58.5,39.3C-67.4,25.4,-70.1,7.7,-67.4,-8.8C-64.7,-25.3,-56.7,-40.4,-44.2,-48.6C-31.7,-56.8,-14.8,-58,-0.1,-58.2C14.7,-58.3,26.3,-60.7,38.1,-52.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* 🏢 Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-gray-900 font-black shadow-lg shadow-emerald-500/20 mx-auto mb-4">
            <Beaker className="w-7 h-7 text-gray-950" />
          </div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block mb-1">Denuwan Karunarathna</span>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">SCIENCE</h2>
          <p className="text-xs text-slate-400 font-medium">Student Portal Login</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl mb-6 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Enter your username" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-emerald-400 hover:underline font-semibold">Forgot Password?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-11 pr-12 py-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
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
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-gray-950 font-black rounded-2xl shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition duration-200 mt-6 text-sm uppercase tracking-wider flex items-center justify-center"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-slate-400 font-medium">
          New Student? <Link to="/register" className="text-emerald-400 font-black hover:underline ml-1">Register for free</Link>
        </p>

        {/* Separator / Portal Switch */}
        <div className="border-t border-slate-800 mt-6 pt-4 text-center">
          <Link to="/admin-login" className="text-xs text-slate-500 hover:text-emerald-400 font-bold transition">
            Teacher Portal Access &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}

export default StudentLogin;