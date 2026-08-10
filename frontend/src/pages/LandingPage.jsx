// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Beaker, BookOpen, Users, Award, ChevronRight, Phone, MapPin, Mail, ArrowRight } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Header / Navigation Bar */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 lg:px-16 py-5 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-gray-900 font-black shadow-lg shadow-emerald-500/20">🔬</div>
            <div>
              <h1 className="font-extrabold text-lg leading-none tracking-wider text-emerald-400">SCIENCE</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Denuwan Karunarathna</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#home" className="hover:text-emerald-400 transition">ප්‍රධාන පිටුව</a>
            <a href="#process" className="hover:text-emerald-400 transition">අපේ ක්‍රියාවලිය</a>
            <a href="#about" className="hover:text-emerald-400 transition">දෙනුවන් සර් ගැන</a>
            <a href="#contact" className="hover:text-emerald-400 transition">සම්බන්ධතා</a>
          </nav>

          {/* Login Button */}
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/5"
          >
            Student Portal
          </button>
        </div>
      </header>

      {/* 2. Premium Hero Section with Dark Chemical Lab Overlay */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Background Dark Science Image with Rich Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1920&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070913]/95 via-[#0B0F19]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Grid */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Class Year Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              O/Level Science (Grade 6 - 11)
            </div>

            {/* Slogans */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-300 leading-tight">
                🅰️ - Level එකට හරියන්න O - Level
              </h3>
              <h2 className="text-4xl lg:text-7xl font-black leading-[1.15] tracking-tight">
                ආස හිතෙන <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
                  SCIENCE
                </span> පංතිය 🔬🧪
              </h2>
            </div>

            <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-xl">
              කටපාඩම් කරපු විද්‍යාව වෙනුවට, ප්‍රායෝගික පරීක්ෂණ සමඟින් විෂය නිර්දේශයේ සියලුම සිද්ධාන්ත සරලව මනසට ධාරණය කරවන දිවයිනේ විශිෂ්ටතම O/Level විද්‍යාව පන්තිය.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-gray-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                ලියාපදිංචි වී ඇතුල් වන්න <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/admin-login')}
                className="px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-extrabold text-sm text-slate-300 transition-all duration-200"
              >
                Teacher Portal &rarr;
              </button>
            </div>

          </div>

          {/* Right Highlight Board (Mimicking the Chem Image statistics) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-20">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 font-bold">A+</div>
              
              <div className="text-center space-y-6">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block mb-1">විශිෂ්ටතම ප්‍රතිඵල වාර්තාව</span>
                  <h4 className="text-5xl lg:text-6xl font-black text-white tracking-tight">A<span className="text-emerald-400">98%</span></h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">පසුගිය වසරේ සමස්ත විද්‍යාව විෂය සඳහා A සහ B සාමාර්ථ ප්‍රතිශතය.</p>
                </div>

                <hr className="border-slate-800" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <h5 className="text-2xl font-black text-white">30+</h5>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">සක්‍රීය සිසුන්</span>
                  </div>
                  <div className="text-center">
                    <h5 className="text-2xl font-black text-emerald-400">Grade 6-11</h5>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">පන්ති ශ්‍රේණි</span>
                  </div>
                </div>

                <hr className="border-slate-800" />

                <div className="text-xs text-slate-400 italic">
                  "🅰️ - Level විද්‍යා විෂය ධාරාවන්ට පදනම වැටෙන O - Level පන්තිය."
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Features / Our Process Section */}
      <section id="process" className="py-24 bg-[#070913] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Our Methodology</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-2">විභාගය ජයගන්නා අපේ රහස් ක්‍රියාවලිය</h2>
            <p className="text-slate-400 text-sm mt-3">LMS තාක්ෂණය සමඟින් විද්‍යාව විෂය ඉතාමත් ආසාවෙන් ඉගෙන ගන්නා ආකාරය.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Beaker, title: 'ප්‍රායෝගික පරීක්ෂණ', desc: 'පාඩම් වලට අදාළ සියලුම පරීක්ෂණ ප්‍රායෝගිකව සහ දෘශ්‍ය මාධ්‍ය ඇසුරින් උගන්වයි.' },
              { icon: BookOpen, title: 'ප්‍රශ්න පත්‍ර සාකච්ඡාව', desc: 'වාර පරීක්ෂණ, පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ආදර්ශ ප්‍රශ්න පත්‍ර කල්තියා සාකච්ඡා කර විභාගයට බිය නැති කරයි.' },
              { icon: Award, title: 'LMS Progress Tracker', desc: 'ළමයාගේ ලකුණු ප්‍රස්ථාර live පෙන්වීම සහ දුර්වල තැන් හඳුනාගෙන ඒවාට විශේෂ මඟපෙන්වීම් ලබාදෙයි.' }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/60 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Footer Section */}
      <footer id="contact" className="bg-black/40 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-extrabold text-lg text-emerald-400 mb-3">දෙනුවන් කරුණාරත්න</h5>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">ලංකාවේ විශිෂ්ටතම O/Level විද්‍යාව පන්තිය. ආසාවෙන් ඉගෙන ගන්න, විශිෂ්ට ජයක් ලබන්න.</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">සම්බන්ධතා විස්තර</h5>
            <div className="flex items-center gap-2 text-xs text-slate-400"><Phone className="w-4 h-4 text-emerald-400" /> 070 424 4444</div>
            <div className="flex items-center gap-2 text-xs text-slate-400"><Mail className="w-4 h-4 text-emerald-400" /> info@scienceclass.lk</div>
          </div>
          <div className="space-y-2">
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">පන්ති පැවැත්වෙන ස්ථාන</h5>
            <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="w-4 h-4 text-emerald-400" /> කොළඹ, ගම්පහ සහ ඔන්ලයින් (LMS හරහා)</div>
          </div>
        </div>
        <div className="text-center text-[10px] text-slate-600 mt-12 border-t border-slate-900 pt-6">
          &copy; {new Date().getFullYear()} ScienceLMS - Denuwan Karunarathna. Designed with passion.
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;