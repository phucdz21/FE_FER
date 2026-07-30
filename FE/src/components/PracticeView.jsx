import React, { useState, useMemo } from 'react';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { Search, Filter, Layers, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export function PracticeView({
  questions,
  userAnswers,
  bookmarkedQuestions,
  incorrectQuestions,
  stats,
  onAnswer,
  onToggleBookmark,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unanswered' | 'incorrect' | 'bookmarked'
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'list'
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions based on search term & selected status filter
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Keyword matching (id or question text)
      const matchesSearch =
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toString().includes(searchTerm);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'unanswered') {
        return !userAnswers[q.id];
      }
      if (statusFilter === 'incorrect') {
        return incorrectQuestions.includes(q.id);
      }
      if (statusFilter === 'bookmarked') {
        return bookmarkedQuestions.includes(q.id);
      }

      return true;
    });
  }, [questions, searchTerm, statusFilter, userAnswers, incorrectQuestions, bookmarkedQuestions]);

  // Handle index clamp
  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, filteredQuestions.length - 1));
  const currentQuestion = filteredQuestions[safeIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Progress Bar */}
      <ProgressBar stats={stats} />

      {/* Control Bar: Search & Filters */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi hoặc ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <button
            onClick={() => { setStatusFilter('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Tất cả ({questions.length})
          </button>

          <button
            onClick={() => { setStatusFilter('unanswered'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === 'unanswered'
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Chưa làm ({stats.totalQuestionsCount - stats.answeredCount})
          </button>

          <button
            onClick={() => { setStatusFilter('incorrect'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === 'incorrect'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Làm sai ({stats.reviewCount})
          </button>

          <button
            onClick={() => { setStatusFilter('bookmarked'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === 'bookmarked'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Đã đánh dấu ({stats.bookmarkCount})
          </button>

        </div>
      </div>

      {/* Questions Content */}
      {filteredQuestions.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Không tìm thấy câu hỏi nào</h3>
          <p className="text-sm text-slate-400">
            Vui lòng thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <QuestionCard
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            isBookmarked={bookmarkedQuestions.includes(currentQuestion.id)}
            onAnswer={onAnswer}
            onToggleBookmark={onToggleBookmark}
            currentNumber={currentQuestion.id}
            totalCount={questions.length}
            hasPrev={safeIndex > 0}
            hasNext={safeIndex < filteredQuestions.length - 1}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
          />
        </div>
      )}

    </div>
  );
}
