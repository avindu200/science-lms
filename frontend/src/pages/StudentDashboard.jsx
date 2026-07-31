// frontend/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, FileText, Bell, Award, CheckCircle, Clock, 
  CreditCard, LogOut, Download, Send, Calendar, User, TrendingUp 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [papers, setPapers] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [myMarks, setMyMarks] = useState([]);
  const [uploadingHwId, setUploadingHwId] = useState(null);
  const [hwFile, setHwFile] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [paymentMonth, setPaymentMonth] = useState('October 2024');
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Student');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Profile details
      const profileRes = await axios.get('http://localhost:5001/api/student/profile', config);
      setStudentGrade(profileRes.data.grade);

      // Announcements
      const announceRes = await axios.get('http://localhost:5001/api/student/announcements', config);
      setAnnouncements(announceRes.data);

      // Leaderboard
      const leaderRes = await axios.get('http://localhost:5001/api/student/leaderboard', config);
      setLeaderboard(leaderRes.data);

      // Papers
      const papersRes = await axios.get('http://localhost:5001/api/student/papers', config);
      setPapers(papersRes.data);

      // Homeworks
      const hwRes = await axios.get('http://localhost:5001/api/student/homeworks', config);
      setHomeworks(hwRes.data);

      // Marks for Chart
      const marksRes = await axios.get('http://localhost:5001/api/student/my-marks', config);
      setMyMarks(marksRes.data);

    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
  };

  // Live Homework Countdown Timer Component
  const HomeworkTimer = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        const diff = +new Date(deadline) - +new Date();
        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const mins = Math.floor((diff / 1000 / 60) % 60);
          setTimeLeft(`${days}d ${hours}h ${mins}m`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [deadline]);

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${timeLeft === 'Expired' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
        <Clock className="w-3.5 h-3.5" />
        {timeLeft}
      </span>
    );
  };

  // Download PDF Direct Function (Using Blob for premium download experience)
  const handleDownload = async (url, title) => {
    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Download failed. Opening in new tab instead.");
      window.open(url, '_blank');
    }
  };

  // Submit Homework File
  const handleHwSubmit = async (e, hwId) => {
    e.preventDefault();
    if (!hwFile) return alert("Select a file first!");
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('homeworkFile', hwFile);

    try {
      await axios.post(`http://localhost:5001/api/student/submit-homework/${hwId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("Homework submitted successfully!");
      setUploadingHwId(null);
      setHwFile(null);
      fetchDashboardData();
    } catch (err) {
      alert("Submission failed");
    }
  };

  // Upload Payment Slip
  const handleSlipSubmit = async (e) => {
    e.preventDefault();
    if (!slipFile) return alert("Please select your bank slip!");
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('slipFile', slipFile);
    formData.append('month', paymentMonth);

    try {
      await axios.post('http://localhost:5001/api/student/upload-slip', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("Payment slip uploaded successfully for review!");
      setSlipFile(null);
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      
      {/* 1. Dribbble Style Sleek Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">🔬</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ScienceLMS</h1>
              <span className="text-xs text-slate-400 font-medium">Grade {studentGrade} Student</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: BookOpen },
              { id: 'papers', label: 'Class Papers', icon: FileText },
              { id: 'homeworks', label: 'Homeworks', icon: Clock },
              { id: 'fees', label: 'Class Fees', icon: CreditCard },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition duration-200">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-bold">{new Date().toDateString()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">Grade {studentGrade}</div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold"><User className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-slate-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Contents */}
        <div className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Modern Welcoming Hero Banner */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                  <div className="relative z-10 max-w-md">
                    <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">Welcome back, {userName}! 👋</h2>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-4">Let's continue learning today. You have pending assignments waiting for you.</p>
                    <button onClick={() => setActiveTab('homeworks')} className="bg-white text-indigo-600 font-bold text-xs px-5 py-2.5 rounded-full shadow hover:bg-indigo-50 transition">Go to Homeworks</button>
                  </div>
                  <div className="absolute right-6 bottom-0 text-9xl opacity-15 select-none pointer-events-none font-bold">⚛️</div>
                </div>

                {/* Progress Chart Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-800">Your Progress</h3>
                      <p className="text-xs text-slate-400">Monthly test results trend</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><TrendingUp className="w-4 h-4" /> Science</div>
                  </div>
                  <div className="h-64">
                    {myMarks.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={myMarks}>
                          <defs>
                            <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="test_name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} />
                          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0,0,0,0.05)' }} />
                          <Area type="monotone" dataKey="marks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMarks)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">Marks not added yet. Keep working!</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (Sidebar Widgets) */}
              <div className="space-y-8">
                
                {/* 1. Leaderboard Widget */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-extrabold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-500" /> Leaderboard
                  </h3>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((student, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0 ? 'bg-amber-100 text-amber-700' :
                              idx === 1 ? 'bg-slate-200 text-slate-700' :
                              idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                            }`}>{idx + 1}</span>
                            <span className="text-sm font-bold text-slate-700">{student.full_name}</span>
                          </div>
                          <span className="text-sm font-extrabold text-indigo-600">{student.marks}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">Waiting for test results.</p>
                  )}
                </div>

                {/* 2. Notice Board Widget */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-extrabold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-500" /> Announcements
                  </h3>
                  {announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.slice(0, 3).map((notice, idx) => (
                        <div key={idx} className="border-l-4 border-indigo-500 pl-3">
                          <h4 className="font-bold text-sm text-slate-700">{notice.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{notice.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">No active notices.</p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB: CLASS PAPERS */}
          {activeTab === 'papers' && (
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Class Papers</h3>
              <p className="text-slate-400 text-sm mb-6">Download your Past papers and Model papers</p>
              
              {papers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {papers.map(paper => (
                    <div key={paper.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full mb-3">{paper.paper_type === 'past_paper' ? 'Past Paper' : 'Model Paper'}</span>
                        <h4 className="font-extrabold text-lg text-slate-700 mb-4">{paper.title}</h4>
                      </div>
                      <button onClick={() => handleDownload(paper.file_url, paper.title)} className="w-full bg-slate-50 hover:bg-violet-50 hover:text-violet-600 text-slate-500 font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition">
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center text-slate-400 border border-dashed">No papers uploaded for your grade yet.</div>
              )}
            </div>
          )}

          {/* TAB: HOMEWORKS */}
          {activeTab === 'homeworks' && (
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Your Homeworks</h3>
              <p className="text-slate-400 text-sm mb-6">Do and upload your homework on time</p>

              {homeworks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {homeworks.map(hw => (
                    <div key={hw.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-extrabold text-lg text-slate-700">{hw.title}</h4>
                          <HomeworkTimer deadline={hw.deadline} />
                        </div>
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{hw.description}</p>
                      </div>

                      {/* Upload Homework Form */}
                      <div className="border-t border-slate-50 pt-4 mt-4">
                        {hw.is_submitted ? (
                          <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl">
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Handed In</span>
                            {hw.marks !== null && <span className="text-sm font-extrabold text-emerald-700">Marks: {hw.marks}/100</span>}
                          </div>
                        ) : uploadingHwId === hw.id ? (
                          <form onSubmit={(e) => handleHwSubmit(e, hw.id)} className="space-y-3">
                            <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" onChange={e => setHwFile(e.target.files[0])} required />
                            <div className="flex gap-2">
                              <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Submit</button>
                              <button onClick={() => setUploadingHwId(null)} className="bg-slate-100 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setUploadingHwId(hw.id)} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition">
                            <Send className="w-4 h-4" /> Hand In Homework
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center text-slate-400 border border-dashed">No homework assigned yet. Enjoy!</div>
              )}
            </div>
          )}

          {/* TAB: FEES SLIP UPLOAD */}
          {activeTab === 'fees' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">Class Fees Slip</h3>
                <p className="text-slate-400 text-sm mb-6">Upload your bank slip photo or receipt</p>

                <form onSubmit={handleSlipSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Select Month</label>
                    <select className="w-full p-3 border rounded-xl" onChange={e => setPaymentMonth(e.target.value)} value={paymentMonth}>
                      {['October 2024', 'November 2024', 'December 2024'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Upload Slip (Image/PDF)</label>
                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setSlipFile(e.target.files[0])} required />
                  </div>
                  <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold p-3 rounded-2xl shadow-lg shadow-indigo-100 transition mt-4">Upload and Submit Slip</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
