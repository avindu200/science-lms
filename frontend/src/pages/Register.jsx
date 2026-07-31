import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState(6);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
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
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">Science LMS</h2>
        <p className="text-center text-gray-500 mb-6">Create your student account</p>
        
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">{message}</div>}
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" placeholder="Amal Perera" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username (Used for Login)</label>
            <input type="text" placeholder="amal99" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your School Grade</label>
            <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={e => setGrade(parseInt(e.target.value))} value={grade}>
              {[6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition duration-200">Register</button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Login Here</Link></p>
      </div>
    </div>
  );
}
export default Register;