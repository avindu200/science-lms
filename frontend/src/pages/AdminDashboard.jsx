// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, FileText, Clock, Bell, LogOut, Check, X, PlusCircle, Award 
} from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingStudents, setPendingStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState(6);
  const [paperType, setPaperType] = useState('past_paper');
  const [paperFile, setPaperFile] = useState(null);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [marksStudentId, setMarksStudentId] = useState('');
  const [testName, setTestName] = useState('');
  const [marks, setMarks] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.get('http://localhost:5001/api/admin/pending-students', config);
      setPendingStudents(res.data);
    } catch (err) {
      console.error("Error loading pending list", err);
    }
  };

  // Decide Student Registration (Approve/Reject)
  const handleStudentDecision = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/admin/decide-student/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Student successfully ${status}!`);
      fetchPendingStudents();
    } catch (err) {
      alert("Action failed");
    }
  };

  // Upload Paper PDF
  const handlePaperUpload = async (e) => {
    e.preventDefault();
    if (!paperFile) return alert("Please select a PDF file!");
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('grade', grade);
    formData.append('paperType', paperType);
    formData.append('paperFile', paperFile);

    try {
      await axios.post('http://localhost:5001/api/admin/upload-paper', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("Paper uploaded and saved successfully!");
      setTitle('');
      setPaperFile(null);
    } catch (err) {
      alert("Paper upload failed");
    }
  };

  // Create Homework
  const handleAddHomework = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/admin/add-homework', {
        title: hwTitle,
        description: hwDesc,
        grade,
        deadline
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Homework assigned successfully!");
      setHwTitle('');
      setHwDescription('');
      setDeadline('');
    } catch (err) {
      alert("Failed to assign homework");
    }
  };

  // Enter Test Marks
  const handleAddMarks = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/admin/add-marks', {
        studentId: marksStudentId,
        testName,
        marks: parseInt(marks)
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Marks entered successfully!");
      setMarksStudentId('');
      setTestName('');
      setMarks('');
    } catch (err) {
      alert("Failed to enter marks");
    }
  };

  // Post Announcement
  const handleAddNotice = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/admin/add-announcement', {
        title: noticeTitle,
        content: noticeContent,
        targetGrade: grade
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Notice posted successfully!");
      setNoticeTitle('');
      setNoticeContent('');
    } catch (err) {
      alert("Failed to post notice");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      
      {/* Sleek Dark Admin Sidebar */}
      <aside className="w-72 bg-gray-900 flex flex-col justify-between p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-gray-900 font-black shadow-lg shadow-emerald-500/20">🏆</div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">Teacher LMS</h1>
              <span className="text-xs text-gray-400 font-medium">Control Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'approvals', label: 'Pending Approvals', icon: Users },
              { id: 'papers', label: 'Upload Paper', icon: FileText },
              { id: 'homeworks', label: 'Assign Homework', icon: Clock },
              { id: 'marks', label: 'Enter Test Marks', icon: Award },
              { id: 'notices', label: 'Post Notice', icon: Bell },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-500 text-gray-900 shadow-lg shadow-emerald-500/10' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition duration-200">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Teacher Dashboard</h2>
          <p className="text-slate-400 text-sm">Welcome back, manage your class students and syllabus assets</p>
        </header>

        {/* TAB: STUDENT APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4">Pending Student Approvals</h3>
            {pendingStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-xs">
                      <th className="p-4 text-left">Full Name</th>
                      <th className="p-4 text-left">Username</th>
                      <th className="p-4 text-left">Grade</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStudents.map(student => (
                      <tr key={student.id} className="border-b border-slate-50 text-slate-600 font-semibold">
                        <td className="p-4">{student.full_name}</td>
                        <td className="p-4">{student.username}</td>
                        <td className="p-4">Grade {student.grade}</td>
                        <td className="p-4 flex gap-2 justify-center">
                          <button onClick={() => handleStudentDecision(student.id, 'approved')} className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-100 transition"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleStudentDecision(student.id, 'rejected')} className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition"><X className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 text-sm py-4">No pending student approval requests.</p>
            )}
          </div>
        )}

        {/* TAB: UPLOAD PAPER */}
        {activeTab === 'papers' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2"><PlusCircle className="text-emerald-500" /> Upload Paper</h3>
            <form onSubmit={handlePaperUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Paper Title</label>
                <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g., Grade 9 Science Term 1" onChange={e => setTitle(e.target.value)} value={title} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Grade</label>
                  <select className="w-full p-3 border rounded-xl" onChange={e => setGrade(parseInt(e.target.value))} value={grade}>
                    {[6,7,8,9,10,11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Paper Type</label>
                  <select className="w-full p-3 border rounded-xl" onChange={e => setPaperType(e.target.value)} value={paperType}>
                    <option value="past_paper">Past Paper</option>
                    <option value="model_paper">Model Paper</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Upload File (PDF)</label>
                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setPaperFile(e.target.files[0])} required />
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold p-3 rounded-2xl transition">Upload to LMS</button>
            </form>
          </div>
        )}

        {/* TAB: ASSIGN HOMEWORK */}
        {activeTab === 'homeworks' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Clock className="text-emerald-500" /> Assign New Homework</h3>
            <form onSubmit={handleAddHomework} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Homework Title</label>
                <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g., Structure of Atom Questions" onChange={e => setHwTitle(e.target.value)} value={hwTitle} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Instructions / Description</label>
                <textarea className="w-full p-3 border rounded-xl h-24" placeholder="Brief instruction on what questions to do..." onChange={e => setHwDescription(e.target.value)} value={hwDesc} required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Grade</label>
                  <select className="w-full p-3 border rounded-xl" onChange={e => setGrade(parseInt(e.target.value))} value={grade}>
                    {[6,7,8,9,10,11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deadline Date & Time</label>
                  <input type="datetime-local" className="w-full p-3 border rounded-xl" onChange={e => setDeadline(e.target.value)} value={deadline} required />
                </div>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold p-3 rounded-2xl transition">Assign Homework</button>
            </form>
          </div>
        )}

        {/* TAB: ENTER TEST MARKS */}
        {activeTab === 'marks' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Award className="text-emerald-500" /> Enter Student Test Marks</h3>
            <form onSubmit={handleAddMarks} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Student ID (Database ID)</label>
                <input type="text" className="w-full p-3 border rounded-xl" placeholder="Enter student's numeric ID" onChange={e => setMarksStudentId(e.target.value)} value={marksStudentId} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Test / Exam Name</label>
                  <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g., October Unit Test" onChange={e => setTestName(e.target.value)} value={testName} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Marks (Out of 100)</label>
                  <input type="number" className="w-full p-3 border rounded-xl" placeholder="e.g., 85" min="0" max="100" onChange={e => setMarks(e.target.value)} value={marks} required />
                </div>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold p-3 rounded-2xl transition">Save Marks</button>
            </form>
          </div>
        )}

        {/* TAB: POST NOTICE */}
        {activeTab === 'notices' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Bell className="text-emerald-500" /> Post New Announcement</h3>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Notice Title</label>
                <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g., Class Rescheduled Notice" onChange={e => setNoticeTitle(e.target.value)} value={noticeTitle} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Announcement Body</label>
                <textarea className="w-full p-3 border rounded-xl h-24" placeholder="Write full details about the notice here..." onChange={e => setNoticeContent(e.target.value)} value={noticeContent} required></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Grade (Optional)</label>
                <select className="w-full p-3 border rounded-xl" onChange={e => setGrade(parseInt(e.target.value))} value={grade}>
                  <option value="">Everyone (Global)</option>
                  {[6,7,8,9,10,11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold p-3 rounded-2xl transition">Post Notice</button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;