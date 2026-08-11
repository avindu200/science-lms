// frontend/src/pages/PeriodicTable.jsx
import React, { useState } from 'react';
import { Beaker, Info, Award, BookOpen } from 'lucide-react';

// O/Level විද්‍යාව සඳහා අත්‍යවශ්‍ය ප්‍රථම මූලද්‍රව්‍ය 20 ක දත්ත
const elementsData = [
  { num: 1, symbol: 'H', name: 'Hydrogen / හයිඩ්‍රජන්', mass: '1.008', group: 1, period: 1, valency: 1, config: '1s¹', desc: 'විශ්වයේ බහුලම මූලද්‍රව්‍යයයි. සැහැල්ලුම වායුවයි.' },
  { num: 2, symbol: 'He', name: 'Helium / හීලියම්', mass: '4.002', group: 18, period: 1, valency: 0, config: '1s²', desc: 'නිෂ්ක්‍රීය වායුවකි. බැලූන පිරවීමට භාවිතා කරයි.' },
  { num: 3, symbol: 'Li', name: 'Lithium / ලිතියම්', mass: '6.94', group: 1, period: 2, valency: 1, config: '2, 1', desc: 'සැහැල්ලුම ලෝහයයි. බැටරි නිෂ්පාදනයට ගනී.' },
  { num: 4, symbol: 'Be', name: 'Beryllium / බෙරිලියම්', mass: '9.012', group: 2, period: 2, valency: 2, config: '2, 2', desc: 'අභ්‍යවකාශ ක්ෂේත්‍රයේ මිශ්‍ර ලෝහ සෑදීමට ගනී.' },
  { num: 5, symbol: 'B', name: 'Boron / බෝරෝන්', mass: '10.81', group: 13, period: 2, valency: 3, config: '2, 3', desc: 'ලෝහාලෝහයකි. වීදුරු ශක්තිමත් කිරීමට ගනී.' },
  { num: 6, symbol: 'C', name: 'Carbon / කාබන්', mass: '12.011', group: 14, period: 2, valency: 4, config: '2, 4', desc: 'ජීවීන්ගේ ප්‍රධානතම ද්‍රව්‍යයයි. බහුරූපීතා පෙන්වයි.' },
  { num: 7, symbol: 'N', name: 'Nitrogen / නයිට්‍රජන්', mass: '14.007', group: 15, period: 2, valency: 3, config: '2, 5', desc: 'වායුගෝලයේ 78%ක් පවතී. අලස වායුවකි.' },
  { num: 8, symbol: 'O', name: 'Oxygen / ඔක්සිජන්', mass: '15.999', group: 16, period: 2, valency: 2, config: '2, 6', desc: 'ශ්වසනයට අත්‍යවශ්‍ය වේ. දහනයට උදව් වේ.' },
  { num: 9, symbol: 'F', name: 'Fluorine / ෆ්ලෝරීන්', mass: '18.998', group: 17, period: 2, valency: 1, config: '2, 7', desc: 'ඉතා ක්‍රියාකාරී හැලජනයකි. දන්තාලේපන වල අඩංගු වේ.' },
  { num: 10, symbol: 'Ne', name: 'Neon / නියොන්', mass: '20.18', group: 18, period: 2, valency: 0, config: '2, 8', desc: 'නිෂ්ක්‍රීය වායුවකි. විදුලි ලාම්පු සඳහා යොදාගනී.' },
  { num: 11, symbol: 'Na', name: 'Sodium / සෝඩියම්', mass: '22.99', group: 1, period: 3, valency: 1, config: '2, 8, 1', desc: 'ඉතා මෘදු, සක්‍රීය ලෝහයකි. භූමිතෙල් තුල ගබඩා කරයි.' },
  { num: 12, symbol: 'Mg', name: 'Magnesium / මැග්නීසියම්', mass: '24.305', group: 2, period: 3, valency: 2, config: '2, 8, 2', desc: 'දීප්තිමත් සුදු දැල්ලකින් දැවේ. හරිතප්‍රද වල අඩංගු වේ.' },
  { num: 13, symbol: 'Al', name: 'Aluminium / ඇලුමිනියම්', mass: '26.982', group: 13, period: 3, valency: 3, config: '2, 8, 3', desc: 'සැහැල්ලු, මළ නොබැඳෙන ලෝහයකි. තහඩු සෑදීමට ගනී.' },
  { num: 14, symbol: 'Si', name: 'Silicon / සිලිකන්', mass: '28.085', group: 14, period: 3, valency: 4, config: '2, 8, 4', desc: 'අර්ධ සන්නායකයකි. පරිගණක චිප් සෑදීමට ගනී.' },
  { num: 15, symbol: 'P', name: 'Phosphorus / පොස්පරස්', mass: '30.974', group: 15, period: 3, valency: 3, config: '2, 8, 5', desc: 'ගිනිපෙට්ටි නිෂ්පාදනයට සහ පොහොර වලට ගනී.' },
  { num: 16, symbol: 'S', name: 'Sulfur / සල්ෆර්', mass: '32.06', group: 16, period: 3, valency: 2, config: '2, 8, 6', desc: 'කහ පැහැති අලෝහයකි. රබර් වල්කනයිස් කිරීමට ගනී.' },
  { num: 17, symbol: 'Cl', name: 'Chlorine / ක්ලෝරීන්', mass: '35.45', group: 17, period: 3, valency: 1, config: '2, 8, 7', desc: 'විෂබීජ නාශකයකි. ජලය පිරිසිදු කිරීමට යොදාගනී.' },
  { num: 18, symbol: 'Ar', name: 'Argon / ආගන්', mass: '39.948', group: 18, period: 3, valency: 0, config: '2, 8, 8', desc: 'විදුලි බුබුළු පිරවීමට ගන්නා නිෂ්ක්‍රීය වායුවකි.' },
  { num: 19, symbol: 'K', name: 'Potassium / පොටෑසියම්', mass: '39.098', group: 1, period: 4, valency: 1, config: '2, 8, 8, 1', desc: 'අතිශය සක්‍රීය ලෝහයකි. ජලය සමඟ ක්ෂණිකව ප්‍රතික්‍රියා කරයි.' },
  { num: 20, symbol: 'Ca', name: 'Calcium / කැල්සියම්', mass: '40.078', group: 2, period: 4, valency: 2, config: '2, 8, 8, 2', desc: 'ඇටකටු සහ දත් ශක්තිමත් කිරීමට අත්‍යවශ්‍ය ලෝහයකි.' }
];

function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(elementsData[0]);

  // grid එකේ හරි තැනට element එක දාන function එක
  const getGridStyle = (group, period) => {
    // පළමු මූලද්‍රව්‍ය 20 සඳහා grid පිහිටීම් සකස් කිරීම
    let col = group;
    if (group === 13) col = 3;
    if (group === 14) col = 4;
    if (group === 15) col = 5;
    if (group === 16) col = 6;
    if (group === 17) col = 7;
    if (group === 18) col = 8;
    
    return {
      gridColumn: col,
      gridRow: period,
    };
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ආවර්තිතා වගු Grid එක (Left Side) */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Beaker className="text-violet-600 w-6 h-6" />
            <div>
              <h3 className="font-extrabold text-xl text-slate-800">O/Level Interactive Periodic Table</h3>
              <p className="text-xs text-slate-400">පළමු මූලද්‍රව්‍ය 20 (Click on any element to learn details)</p>
            </div>
          </div>

          {/* 8 Columns Grid layout (O/Level Layout) */}
          <div className="grid grid-cols-8 gap-2.5 max-w-2xl mx-auto">
            {elementsData.map((el) => {
              const isSelected = selectedElement?.num === el.num;
              return (
                <button
                  key={el.num}
                  style={getGridStyle(el.group, el.period)}
                  onClick={() => setSelectedElement(el)}
                  className={`aspect-square p-2 rounded-2xl flex flex-col justify-between items-center transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white scale-105 shadow-lg shadow-indigo-200' 
                      : 'bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-600 border border-slate-100'
                  }`}
                >
                  <span className="text-[9px] font-bold self-start opacity-70">{el.num}</span>
                  <span className="text-lg font-black tracking-tighter">{el.symbol}</span>
                  <span className="text-[9px] font-bold opacity-80">{el.mass}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Element Details Card (Right Side) */}
        <div className="w-full lg:w-80">
          {selectedElement && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
              {/* Decorative Watermark */}
              <div className="absolute -right-6 -bottom-6 text-9xl font-black opacity-5 select-none">{selectedElement.symbol}</div>
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs text-emerald-400 uppercase tracking-widest font-black block">Element Details</span>
                    <h4 className="text-2xl font-black">{selectedElement.name}</h4>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-black border border-white/10">
                    {selectedElement.symbol}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-slate-400 font-semibold">පරමාණුක ක්‍රමාංකය</span>
                    <span className="font-bold text-emerald-400">{selectedElement.num}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-slate-400 font-semibold">සාපේක්ෂ ස්කන්ධය</span>
                    <span className="font-bold">{selectedElement.mass}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-slate-400 font-semibold">සංයුජතාව</span>
                    <span className="font-bold text-amber-400">{selectedElement.valency}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-slate-400 font-semibold">ඉලෙක්ට්‍රෝන වින්‍යාසය</span>
                    <span className="font-bold text-indigo-300">{selectedElement.config}</span>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">විස්තරය</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {selectedElement.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[10px] text-slate-500 italic text-center">
                Denuwan Karunarathna Science LMS Tool
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PeriodicTable;