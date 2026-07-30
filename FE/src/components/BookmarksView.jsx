import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { Bookmark, Star, RotateCcw } from 'lucide-react';

export function BookmarksView({
  questionsById,
  bookmarkedQuestions,
  onToggleBookmark,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Independent local state so bookmarked questions start clean for re-attempting
  const [localAnswers, setLocalAnswers] = useState({});

  const bookmarkedItems = bookmarkedQuestions
    .map((id) => questionsById.get(id))
    .filter(Boolean);

  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, bookmarkedItems.length - 1));
  const currentQuestion = bookmarkedItems[safeIndex];

  const handleAnswer = (questionId, optionLetter) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  const handleResetAttempts = () => {
    setLocalAnswers({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
            <Bookmark className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Danh Sách Đã Đánh Dấu
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                {bookmarkedItems.length} câu
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Các câu hỏi bạn chưa chắc chắn. Hãy chọn đáp án để rèn luyện lại!
            </p>
          </div>
        </div>

        {currentQuestion && (
          <button
            onClick={handleResetAttempts}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center space-x-1.5 text-xs font-semibold"
            title="Làm lại tất cả câu đã đánh dấu"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Làm lại từ đầu</span>
          </button>
        )}
      </div>

      {/* Bookmarks Content */}
      {bookmarkedItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12 animate-pop">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Chưa có câu hỏi nào được đánh dấu</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Trong quá trình làm bài, bạn có thể nhấn vào nút <strong className="text-amber-400">"Đánh dấu câu này"</strong> ở góc câu hỏi để lưu lại vào đây.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <QuestionCard
            question={currentQuestion}
            userAnswer={localAnswers[currentQuestion.id]}
            isBookmarked={true}
            onAnswer={handleAnswer}
            onToggleBookmark={onToggleBookmark}
            currentNumber={safeIndex + 1}
            totalCount={bookmarkedItems.length}
            hasPrev={safeIndex > 0}
            hasNext={safeIndex < bookmarkedItems.length - 1}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(bookmarkedItems.length - 1, prev + 1))}
            showFeedback={true}
          />
        </div>
      )}

    </div>
  );
}
