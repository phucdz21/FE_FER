import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Send,
  Sparkles
} from 'lucide-react';
import { getCorrectAnswers, isMultiAnswer, checkIsCorrect } from '../utils/quizUtils';

export function QuestionCard({
  question,
  userAnswer,
  isBookmarked,
  onAnswer,
  onToggleBookmark,
  onNext,
  onPrev,
  hasPrev = true,
  hasNext = true,
  currentNumber,
  totalCount,
  showNavigation = true,
  readOnlyMode = false,
  showFeedback = true, // If true, reveal right/wrong feedback after check
}) {
  if (!question) return null;

  const correctAnswers = getCorrectAnswers(question);
  const isMulti = isMultiAnswer(question);

  // Convert userAnswer prop to normalized array e.g. ['A', 'B']
  const getNormalizedUserAnswer = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((v) => String(v).trim().toUpperCase());
    if (typeof val === 'string') {
      if (val.includes(',')) return val.split(',').map((v) => v.trim().toUpperCase());
      return [val.trim().toUpperCase()];
    }
    return [];
  };

  const selectedLetters = getNormalizedUserAnswer(userAnswer);
  const isAnswered = selectedLetters.length > 0;
  const isCorrect = isAnswered && checkIsCorrect(selectedLetters, question);

  // Local state to track whether user clicked "Kiểm Tra Đáp Án" for multi-answer questions in practice mode
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  // Reset local submission state when question changes
  useEffect(() => {
    setHasSubmittedAnswer(false);
  }, [question.id]);

  // Extract letter (A, B, C, D) and text content
  const parseOption = (optionStr) => {
    const match = optionStr.match(/^([A-D])\.\s*(.*)/s);
    if (match) {
      return { letter: match[1].toUpperCase(), text: match[2] };
    }
    return { letter: optionStr.charAt(0).toUpperCase(), text: optionStr };
  };

  // Handle clicking an option
  const handleOptionClick = (letter) => {
    if (readOnlyMode) return;

    if (isMulti) {
      // Toggle choice in array
      let updated;
      if (selectedLetters.includes(letter)) {
        updated = selectedLetters.filter((l) => l !== letter);
      } else {
        updated = [...selectedLetters, letter].sort();
      }
      onAnswer(question.id, updated);
      setHasSubmittedAnswer(false); // Reset submit state until user clicks Check button
    } else {
      // Single select: immediate choice
      onAnswer(question.id, letter);
      setHasSubmittedAnswer(true);
    }
  };

  // Click "Kiểm Tra Đáp Án" button
  const handleCheckAnswer = () => {
    if (selectedLetters.length === 0) return;
    setHasSubmittedAnswer(true);
    onAnswer(question.id, selectedLetters);
  };

  // Should we show green/red feedback for this question right now?
  // For single-answer: show if answered & showFeedback is true.
  // For multi-answer: show if user clicked "Kiểm Tra Đáp Án" (or readOnly/post-exam review) & showFeedback is true.
  const isFeedbackRevealed = isAnswered && showFeedback && (!isMulti || hasSubmittedAnswer || readOnlyMode);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-2xl transition-all duration-300">
      
      {/* Question Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          <span className="px-3 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs sm:text-sm font-extrabold tracking-wide">
            Câu {currentNumber || question.id} {totalCount ? `/ ${totalCount}` : ''}
          </span>
          
          {/* Multi-answer badge indicator */}
          {isMulti && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Chọn nhiều đáp án ({correctAnswers.length} câu đúng)</span>
            </span>
          )}

          {/* Feedback status badge */}
          {isFeedbackRevealed && (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
              isCorrect 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{isCorrect ? 'Đã làm đúng' : 'Đã làm sai'}</span>
            </span>
          )}

          {isAnswered && !isFeedbackRevealed && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <span>Đã chọn ({selectedLetters.join(', ')})</span>
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => onToggleBookmark(question.id)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
            isBookmarked
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={isBookmarked ? 'Bỏ đánh dấu câu này' : 'Đánh dấu câu hỏi chưa chắc chắn'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span className="hidden sm:inline">
            {isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu câu này'}
          </span>
        </button>

      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-100 leading-snug tracking-tight select-text">
          {question.question}
        </h3>
        {isMulti && (
          <p className="text-xs text-amber-400/90 font-medium mt-1.5">
            💡 * Câu hỏi này có {correctAnswers.length} đáp án đúng. Hãy chọn các đáp án bạn cho là đúng rồi nhấn nút "Kiểm Tra Đáp Án" bên dưới.
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((optStr, idx) => {
          const { letter, text } = parseOption(optStr);
          const isSelected = selectedLetters.includes(letter);
          const isTheRightAnswer = correctAnswers.includes(letter);

          let optionStyle = "bg-slate-800/50 border-slate-700/70 text-slate-200 hover:bg-slate-800 hover:border-slate-600";
          let badgeStyle = "bg-slate-700/60 text-slate-300 border-slate-600/50";
          let statusText = null;

          if (isFeedbackRevealed) {
            // Feedback is revealed
            if (isTheRightAnswer) {
              optionStyle = "bg-emerald-950/60 border-emerald-500/70 text-emerald-100 ring-2 ring-emerald-500/30";
              badgeStyle = "bg-emerald-500 text-slate-950 font-black border-emerald-400";
              statusText = <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> ĐÁP ÁN ĐÚNG</span>;
            } else if (isSelected && !isTheRightAnswer) {
              optionStyle = "bg-rose-950/60 border-rose-500/70 text-rose-100 ring-2 ring-rose-500/30";
              badgeStyle = "bg-rose-500 text-white font-black border-rose-400";
              statusText = <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> BẠN ĐÃ CHỌN SAI</span>;
            } else {
              optionStyle = "bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-60";
            }
          } else {
            // Silent selection mode or unsubmitted multi-answer selection
            if (isSelected) {
              optionStyle = "bg-brand-500/20 border-brand-500 text-brand-100 ring-2 ring-brand-500/40 font-semibold";
              badgeStyle = "bg-brand-500 text-white font-black border-brand-400";
              statusText = <span className="text-xs font-bold text-brand-300 flex items-center gap-1"><CheckSquare className="w-4 h-4" /> Đã chọn</span>;
            }
          }

          return (
            <button
              key={idx}
              disabled={readOnlyMode}
              onClick={() => handleOptionClick(letter)}
              className={`w-full text-left p-4 rounded-xl border font-medium text-sm sm:text-base transition-all duration-200 flex items-start justify-between gap-3 ${optionStyle}`}
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${badgeStyle}`}>
                  {isMulti ? (
                    isSelected ? <CheckSquare className="w-4 h-4" /> : letter
                  ) : (
                    letter
                  )}
                </span>
                <span className="pt-0.5 whitespace-pre-line leading-relaxed font-sans text-slate-100">
                  {text}
                </span>
              </div>

              {statusText && (
                <div className="flex-shrink-0 pt-1">
                  {statusText}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Button "Kiểm Tra Đáp Án" for multi-select questions in practice / review modes */}
      {isMulti && !readOnlyMode && showFeedback && !hasSubmittedAnswer && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleCheckAnswer}
            disabled={selectedLetters.length === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-sm shadow-xl transition-all ${
              selectedLetters.length > 0
                ? 'bg-gradient-to-r from-amber-500 via-brand-500 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-white shadow-amber-500/20 hover:scale-105'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kiểm Tra Đáp Án ({selectedLetters.length > 0 ? `Đã chọn ${selectedLetters.length}` : 'Chưa chọn'})</span>
          </button>
        </div>
      )}

      {/* Feedback Banner */}
      {isFeedbackRevealed && (
        <div className={`p-4 rounded-xl border mb-6 transition-all duration-300 animate-slide-up ${
          isCorrect
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
        }`}>
          <div className="flex items-start space-x-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base">
                {isCorrect ? 'Tuyệt vời! Bạn đã chọn chính xác tất cả các đáp án.' : 'Chưa chính xác!'}
              </h4>
              {!isCorrect && (
                <p className="text-xs sm:text-sm text-rose-300/90 leading-relaxed">
                  Đáp án đúng là: <strong className="text-emerald-400 font-extrabold">{correctAnswers.join(', ')}</strong>. Câu hỏi này đã được tự động thêm vào mục <strong className="underline text-white">"Cần ôn lại"</strong>.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Controls & Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              hasPrev
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold border shadow-lg transition-all ${
              hasNext
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white border-brand-500/40 shadow-brand-600/20'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            <span>Câu tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
