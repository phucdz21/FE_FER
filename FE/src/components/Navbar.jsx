import React, { useState } from 'react';
import { 
  BookOpen, 
  RotateCcw, 
  Bookmark, 
  Award, 
  Moon, 
  Sun, 
  Trash2, 
  Grid,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  darkMode, 
  setDarkMode, 
  onOpenQuestionGrid,
  onResetProgress 
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems = [
    {
      id: 'practice',
      label: 'Luyện tập',
      icon: BookOpen,
      badge: null,
      color: 'text-sky-400',
    },
    {
      id: 'review',
      label: 'Cần ôn lại',
      icon: AlertCircle,
      badge: stats.reviewCount,
      badgeColor: 'bg-rose-500 text-white',
      color: 'text-rose-400',
    },
    {
      id: 'bookmarks',
      label: 'Đã đánh dấu',
      icon: Bookmark,
      badge: stats.bookmarkCount,
      badgeColor: 'bg-amber-500 text-white',
      color: 'text-amber-400',
    },
    {
      id: 'exam',
      label: 'Kiểm tra (50 câu)',
      icon: Award,
      badge: null,
      color: 'text-emerald-400',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('practice')}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-xl">
                ⚛️
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-brand-300 to-indigo-300">
                  WDU Quiz Master
                </h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  Ôn luyện WDU203c Interactive ({stats.totalQuestionsCount} câu hỏi)
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center space-x-2">
              
              {/* Question Map / Grid Button */}
              <button
                onClick={onOpenQuestionGrid}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition-all"
                title="Mở sơ đồ danh sách 295 câu hỏi"
              >
                <Grid className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Sơ đồ câu hỏi</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
                title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Reset Progress */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 border border-slate-800 transition-all"
                title="Đặt lại tiến trình học"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-900/90 py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-md text-xs font-medium ${
                  isActive ? 'text-sky-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[11px] truncate max-w-[70px]">{item.label}</span>
                {item.badge > 0 && (
                  <span className={`absolute -top-1 right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Xác nhận đặt lại tiến trình</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa toàn bộ câu trả lời, danh sách câu sai cần ôn lại, danh sách đánh dấu và lịch sử kiểm tra không?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
