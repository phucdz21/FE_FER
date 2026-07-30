import React from 'react';
import { 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

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
  showFeedback = true, // Control whether instant green/red feedback is displayed
}) {
  if (!question) return null;

  const isAnswered = Boolean(userAnswer);
  const isCorrect = isAnswered && userAnswer === question.answer;

  // Extract letter (A, B, C, D) and content from option string
  const parseOption = (optionStr) => {
    const match = optionStr.match(/^([A-D])\.\s*(.*)/s);
    if (match) {
      return { letter: match[1], text: match[2] };
    }
    return { letter: optionStr.charAt(0), text: optionStr };
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-2xl transition-all duration-300">
      
      {/* Question Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs sm:text-sm font-extrabold tracking-wide">
            Câu {currentNumber || question.id} {totalCount ? `/ ${totalCount}` : ''}
          </span>
          
          {isAnswered && showFeedback && (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
              isCorrect 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{isCorrect ? 'Đã làm đúng' : 'Đã làm sai'}</span>
            </span>
          )}

          {isAnswered && !showFeedback && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <span>Đã chọn đáp án</span>
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
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((optStr, idx) => {
          const { letter, text } = parseOption(optStr);
          const isSelected = userAnswer === letter;
          const isTheRightAnswer = question.answer === letter;

          // Default style for unselected / default state
          let optionStyle = "bg-slate-800/50 border-slate-700/70 text-slate-200 hover:bg-slate-800 hover:border-slate-600";
          let badgeStyle = "bg-slate-700/60 text-slate-300 border-slate-600/50";
          let statusText = null;

          if (isAnswered) {
            if (showFeedback) {
              // Showing instant feedback (Practice / Submitted Exam / Review after click)
              if (isTheRightAnswer) {
                optionStyle = "bg-emerald-950/60 border-emerald-500/70 text-emerald-100 ring-2 ring-emerald-500/30";
                badgeStyle = "bg-emerald-500 text-slate-950 font-black border-emerald-400";
                statusText = <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> ĐÁP ÁN ĐÚNG</span>;
              } else if (isSelected && !isCorrect) {
                optionStyle = "bg-rose-950/60 border-rose-500/70 text-rose-100 ring-2 ring-rose-500/30";
                badgeStyle = "bg-rose-500 text-white font-black border-rose-400";
                statusText = <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> BẠN ĐÃ CHỌN SAI</span>;
              } else {
                optionStyle = "bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-60";
              }
            } else {
              // Silent mode during active Exam (no green/red feedback revealed!)
              if (isSelected) {
                optionStyle = "bg-brand-500/20 border-brand-500 text-brand-100 ring-2 ring-brand-500/40 font-semibold";
                badgeStyle = "bg-brand-500 text-white font-black border-brand-400";
                statusText = <span className="text-xs font-bold text-brand-300">Đã chọn</span>;
              }
            }
          }

          return (
            <button
              key={idx}
              disabled={readOnlyMode}
              onClick={() => onAnswer(question.id, letter)}
              className={`w-full text-left p-4 rounded-xl border font-medium text-sm sm:text-base transition-all duration-200 flex items-start justify-between gap-3 ${optionStyle}`}
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${badgeStyle}`}>
                  {letter}
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

      {/* Answer Feedback Banner (Only if showFeedback is true and answered) */}
      {isAnswered && showFeedback && (
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
                {isCorrect ? 'Tuyệt vời! Bạn đã chọn đáp án chính xác.' : 'Chưa chính xác!'}
              </h4>
              {!isCorrect && (
                <p className="text-xs sm:text-sm text-rose-300/90 leading-relaxed">
                  Đáp án đúng là <strong className="text-emerald-400 font-extrabold">{question.answer}</strong>. Câu hỏi này đã được tự động thêm vào mục <strong className="underline text-white">"Cần ôn lại"</strong>.
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
