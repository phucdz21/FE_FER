import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { AlertCircle, CheckCircle, Trophy, RotateCcw } from 'lucide-react';

export function ReviewView({
  questionsById,
  incorrectQuestions,
  bookmarkedQuestions,
  onToggleBookmark,
  onRemoveFromReview,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Independent local state so questions start clean for re-attempting
  const [localAnswers, setLocalAnswers] = useState({});

  const reviewQuestions = incorrectQuestions
    .map((id) => questionsById.get(id))
    .filter(Boolean);

  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, reviewQuestions.length - 1));
  const currentQuestion = reviewQuestions[safeIndex];

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
      <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 bg-rose-500/5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Danh Sách Cần Ôn Lại
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30">
                {reviewQuestions.length} câu
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Các câu hỏi bạn từng làm sai. Hãy chọn lại đáp án để kiểm tra mức độ ghi nhớ!
            </p>
          </div>
        </div>

        {currentQuestion && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetAttempts}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
              title="Làm lại từ đầu danh sách này"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => onRemoveFromReview(currentQuestion.id)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all"
              title="Đã thuộc câu này, xóa khỏi danh sách ôn lại"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Đã thuộc (Xóa khỏi danh sách)</span>
            </button>
          </div>
        )}
      </div>

      {/* Review Questions Content */}
      {reviewQuestions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12 animate-pop">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Tuyệt vời! Không có câu hỏi nào cần ôn lại</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Bạn chưa làm sai câu hỏi nào hoặc đã ôn tập hoàn tất tất cả các câu hỏi sai.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <QuestionCard
            question={currentQuestion}
            userAnswer={localAnswers[currentQuestion.id]}
            isBookmarked={bookmarkedQuestions.includes(currentQuestion.id)}
            onAnswer={handleAnswer}
            onToggleBookmark={onToggleBookmark}
            currentNumber={safeIndex + 1}
            totalCount={reviewQuestions.length}
            hasPrev={safeIndex > 0}
            hasNext={safeIndex < reviewQuestions.length - 1}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(reviewQuestions.length - 1, prev + 1))}
            showFeedback={true}
          />
        </div>
      )}

    </div>
  );
}
