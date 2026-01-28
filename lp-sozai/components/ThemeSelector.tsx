import React from 'react';
import { ThemeType } from '../types';
import { Palette, Sparkles, Coffee, Moon, Flower, Cpu, Music, Cloud, Minus, Zap, Disc, CassetteTape, Monitor, Layers, Umbrella } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      <div className="bg-white/90 backdrop-blur shadow-2xl rounded-xl p-4 border border-gray-200 w-64 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm uppercase tracking-wide border-b pb-2">
          <Palette size={16} /> Design Switcher
        </div>
        <div className="space-y-2">
          {/* Group 1: Standard */}
          <div className="text-xs font-bold text-gray-400 mt-2 mb-1 pl-1">STANDARD</div>
          <button
            onClick={() => onThemeChange(ThemeType.MODERN)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.MODERN
                ? 'bg-slate-900 text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <span className="font-bold block">Theme A: Modern</span>
          </button>
          <button
            onClick={() => onThemeChange(ThemeType.ELEGANT)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.ELEGANT
                ? 'bg-[#78716c] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <span className="font-serif block">Theme B: Elegant</span>
          </button>
          <button
            onClick={() => onThemeChange(ThemeType.CLEAN)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.CLEAN
                ? 'bg-[#0e7490] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <span className="font-sans block">Theme C: Professional</span>
          </button>

          {/* Group 2: Vibe */}
          <div className="text-xs font-bold text-gray-400 mt-2 mb-1 pl-1">ATMOSPHERE</div>
          <button
            onClick={() => onThemeChange(ThemeType.POP)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.POP
                ? 'bg-[#ff0080] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-bold block">Theme D: Pop</span>
                <Sparkles size={12}/>
            </div>
          </button>
          <button
            onClick={() => onThemeChange(ThemeType.LUXURY)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.LUXURY
                ? 'bg-[#121212] text-[#d4af37] border border-[#d4af37] shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-serif block">Theme E: Luxury</span>
                <Moon size={12}/>
            </div>
          </button>
          <button
            onClick={() => onThemeChange(ThemeType.NATURE)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.NATURE
                ? 'bg-[#4d7c0f] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-sans block">Theme F: Nature</span>
                <Coffee size={12}/>
            </div>
          </button>

          {/* Group 3: Concept */}
          <div className="text-xs font-bold text-gray-400 mt-2 mb-1 pl-1">CONCEPT</div>
          <button
            onClick={() => onThemeChange(ThemeType.JAPAN)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.JAPAN
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-serif block">Theme G: Japan</span>
                <Flower size={12}/>
            </div>
          </button>
          
          <button
            onClick={() => onThemeChange(ThemeType.CYBER)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.CYBER
                ? 'bg-[#020617] text-[#d946ef] border border-[#d946ef] shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-mono block">Theme H: Cyber</span>
                <Cpu size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.RETRO)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.RETRO
                ? 'bg-[#ef4444] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-retro block">Theme I: Retro</span>
                <Music size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.NORDIC)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.NORDIC
                ? 'bg-[#64748b] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-sans block">Theme K: Nordic</span>
                <Minus size={12}/>
            </div>
          </button>

           <button
            onClick={() => onThemeChange(ThemeType.BOLD)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.BOLD
                ? 'bg-black text-[#a3e635] shadow-md border border-[#a3e635]'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-bold block uppercase">Theme L: Bold</span>
                <Zap size={12}/>
            </div>
          </button>

          {/* Group 4: LoFi Series */}
          <div className="text-xs font-bold text-pink-400 mt-2 mb-1 pl-1">LO-FI SERIES</div>
          <button
            onClick={() => onThemeChange(ThemeType.LOFI)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.LOFI
                ? 'bg-[#2e1065] text-pink-300 shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-pixel block text-lg">Theme J: LoFi</span>
                <Cloud size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.LOFI_WARM)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.LOFI_WARM
                ? 'bg-[#78350f] text-[#fff8dc] shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-hand block text-lg font-bold">Theme M: Warm</span>
                <Coffee size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.CITY_POP)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.CITY_POP
                ? 'bg-[#1e1b4b] text-[#ec4899] shadow-md border border-[#ec4899]'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-dot block">Theme N: City Pop</span>
                <Disc size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.ANALOG)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.ANALOG
                ? 'bg-[#e5e7eb] text-[#dc2626] shadow-md border border-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-typewriter block font-bold">Theme O: Analog</span>
                <CassetteTape size={12}/>
            </div>
          </button>

           <button
            onClick={() => onThemeChange(ThemeType.VAPORWAVE)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.VAPORWAVE
                ? 'bg-[#ffdeeb] text-[#06b6d4] shadow-md border border-[#06b6d4]'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-vapor block font-bold italic">Theme P: Vapor</span>
                <Monitor size={12}/>
            </div>
          </button>

          <button
            onClick={() => onThemeChange(ThemeType.ABSTRACT)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.ABSTRACT
                ? 'bg-[#f3f4f6] text-[#1e293b] shadow-md border border-slate-800'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-block block uppercase">Theme Q: Abstract</span>
                <Layers size={12}/>
            </div>
          </button>

           <button
            onClick={() => onThemeChange(ThemeType.RAINY)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              currentTheme === ThemeType.RAINY
                ? 'bg-[#0f172a] text-[#60a5fa] shadow-md border border-[#60a5fa]'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-clean block">Theme R: Rainy</span>
                <Umbrella size={12}/>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;