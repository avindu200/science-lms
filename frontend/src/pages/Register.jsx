// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, BookOpen, Sparkles, GraduationCap } from 'lucide-react';

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState(6);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', {
        fullName,
        username,
        password,
        grade
      });
      setMessage(res.data.message);
      // තත්පර 3කින් ලොගින් පිටුවට ඔටෝමැටිකලි යැවීම
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070913] flex items-center justify-center relative overflow-hidden py-12 px-4">
      
      {/* 🔮 Glowing Ambient Background Blobs */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[130px]" />

      {/* Organic Chemical Wavy Curves (Background Decoration) */}
      <div className="absolute inset-0 opacity-20 select-none pointer-events-none z-0">
        <svg className="absolute top-10 right-10 w-96 h-96 text-emerald-500/10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M40,-53.4C51.6,-45.5,60.7,-32.8,63.1,-18.7C65.5,-4.6,61.1,10.8,54.1,24.8C47.1,38.8,37.5,51.4,24.4,58C11.3,64.6,-5.3,65.2,-20.8,60.5C-36.3,55.8,-50.7,45.8,-59,32.2C-67.3,18.6,-69.5,1.4,-65.9,-14C-62.3,-29.4,-52.9,-43.1,-40.4,-50.8C-27.9,-58.5,-12.3,-60.2,1.6,-62.4C15.5,-64.6,28.4,-61.3,40,-53.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* 🏢 Glassmorphic Register Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-gray-900 font-black shadow-lg shadow-emerald-500/20 mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-gray-950 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block mb-1">Join the Science Class</span>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">Create Account</h2>
          <p className="text-xs text-slate-400 font-medium">A-Level එකට පදනම වැටෙන O-Level පන්තිය</p>
        </div>

        {message && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Amal Perera" 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                onChange={e => setFullName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Username (For Login)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <GraduationCap className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="amal123" 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Grade Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Your School Grade</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <select 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800/80 rounded-2xl text-white focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm appearance-none cursor-pointer"
                onChange={e => setGrade(parseInt(e.target.value))} 
                value={grade}
              >
                {[6, 7, 8, 9, 10, 11].map(g => (
                  <option key={g} value={g} className="bg-[#070913] text-white">Grade {g}</option>
                ))}
              </select>
              {/* Custom Chevron Down for Select */}
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                ▼
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-gray-950 font-black rounded-2xl shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition duration-200 mt-6 text-sm uppercase tracking-wider flex items-center justify-center"
          >
            {isLoading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-emerald-400 font-black hover:underline ml-1">Login Here</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;