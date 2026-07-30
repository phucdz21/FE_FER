import React from 'react';
import { X, CheckCircle, XCircle, Bookmark, HelpCircle } from 'lucide-react';

export function QuestionGrid({
  isOpen,
  onClose,
  questions,
  userAnswers,
  incorrectQuestions,
  bookmarkedQuestions,
  onSelectQuestion,
  currentIndex,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Sơ Đồ Câu Hỏi ({questions.length} câu)
            </h3>
            <p className="text-xs text-slate-400">
              Nhấn vào bất kỳ câu nào để chuyển nhanh đến câu hỏi đó
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 py-3 border-b border-slate-800/60 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500"></span>
            <span>Đã làm đúng</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-500"></span>
            <span>Đã làm sai</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500"></span>
            <span>Đã đánh dấu</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700"></span>
            <span>Chưa làm</span>
          </div>
        </div>

        {/* Scrollable Pill Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {questions.map((q, index) => {
            const isCurrent = index === currentIndex;
            const choice = userAnswers[q.id];
            const isAnswered = Boolean(choice);
            const isCorrect = isAnswered && choice === q.answer;
            const isBookmarked = bookmarkedQuestions.includes(q.id);

            let btnStyle = "bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-700";

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
              } else {
                btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
              }
            }

            if (isCurrent) {
              btnStyle += " ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900";
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(index);
                  onClose();
                }}
                className={`relative h-10 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-center ${btnStyle}`}
              >
                <span>{q.id}</span>
                {isBookmarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
