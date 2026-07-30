import React from 'react';
import { CheckCircle, XCircle, Target, HelpCircle, Flame } from 'lucide-react';

export function ProgressBar({ stats }) {
  const {
    answeredCount,
    correctCount,
    incorrectCount,
    totalQuestionsCount,
    progressPercentage,
    accuracyPercentage,
  } = stats;

  const remainingCount = totalQuestionsCount - answeredCount;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl mb-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Tiến Trình Học Tập 
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {progressPercentage}%
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Đã làm <strong className="text-white">{answeredCount}</strong> / {totalQuestionsCount} câu
            </p>
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="flex items-center space-x-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Đúng: {correctCount}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">
            <XCircle className="w-4 h-4" />
            <span>Sai: {incorrectCount}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold hidden lg:flex">
            <Target className="w-4 h-4" />
            <span>Chính xác: {accuracyPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden flex p-0.5 border border-slate-700/50 shadow-inner">
          {/* Correct Portion */}
          <div 
            style={{ width: `${(correctCount / totalQuestionsCount) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500 ease-out"
            title={`Đúng: ${correctCount} câu`}
          />
          {/* Incorrect Portion */}
          <div 
            style={{ width: `${(incorrectCount / totalQuestionsCount) * 100}%` }}
            className="h-full bg-gradient-to-r from-rose-500 to-red-400 transition-all duration-500 ease-out"
            title={`Sai: ${incorrectCount} câu`}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
          <span>0 câu</span>
          <span>Còn lại: {remainingCount} câu chưa trả lời</span>
          <span>{totalQuestionsCount} câu</span>
        </div>
      </div>

    </div>
  );
}
