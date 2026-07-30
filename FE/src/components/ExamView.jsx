import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuestionCard } from './QuestionCard';
import { 
  Award, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ListChecks, 
  Trophy, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function ExamView({
  questionsById,
  currentExam,
  examHistory,
  bookmarkedQuestions,
  onStartExam,
  onSubmitExam,
  onToggleBookmark,
  onGoToReview,
}) {
  const [examAnswers, setExamAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45 * 60); // 45 minutes

  // Countdown timer when exam is active
  useEffect(() => {
    if (!currentExam || currentExam.isSubmitted) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when timer runs out
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExam]);

  // Trigger confetti when exam results are displayed with high score
  useEffect(() => {
    if (currentExam && currentExam.isSubmitted && currentExam.percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentExam?.isSubmitted]);

  // Reset local state when a new exam starts
  const handleStartNewExam = () => {
    setExamAnswers({});
    setCurrentIndex(0);
    setTimerSeconds(45 * 60);
    onStartExam();
  };

  const handleSelectOption = (questionId, letter) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: letter,
    }));
  };

  const handleForceSubmit = () => {
    onSubmitExam(examAnswers);
    setShowSubmitModal(false);
  };

  // Format time (MM:SS)
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. WELCOME / START EXAM SCREEN
  if (!currentExam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-slate-900/50 to-slate-900 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bài Kiểm Tra Thử (50 Câu Ngẫu Nhiên)
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Hệ thống sẽ chọn ngẫu nhiên 50 câu hỏi từ ngân hàng 295 câu hỏi FER202 để đánh giá năng lực của bạn.
            </p>
          </div>

          {/* Key Exam Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
              <ListChecks className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Số lượng câu</div>
                <div className="text-base font-bold text-white">50 câu hỏi</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
              <Clock className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Thời gian</div>
                <div className="text-base font-bold text-white">45 phút</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Đạt chuẩn</div>
                <div className="text-base font-bold text-white">&ge; 35 câu (70%)</div>
              </div>
            </div>
          </div>

          {/* Start Exam CTA */}
          <button
            onClick={handleStartNewExam}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-200"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Bắt Đầu Làm Bài Ngay</span>
          </button>
        </div>

        {/* Past Exam History */}
        {examHistory.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Lịch Sử Bài Kiểm Tra ({examHistory.length} lượt làm)
            </h3>

            <div className="space-y-3">
              {examHistory.slice(0, 5).map((exam, idx) => (
                <div
                  key={exam.id || idx}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">
                      Lượt làm #{examHistory.length - idx}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(exam.submittedAt || exam.createdTime).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-lg text-sm font-black ${
                      exam.percentage >= 70
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {exam.score} / {exam.total} ({exam.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // 2. EXAM SUBMITTED RESULTS & REVIEW SCREEN
  if (currentExam.isSubmitted) {
    const examQuestions = currentExam.questionIds.map((id) => questionsById.get(id)).filter(Boolean);
    const reviewQuestion = examQuestions[currentIndex];
    const isPassed = currentExam.percentage >= 70;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Score Card */}
        <div className={`glass-panel rounded-3xl p-8 border text-center space-y-5 shadow-2xl ${
          isPassed 
            ? 'border-emerald-500/30 bg-emerald-950/20' 
            : 'border-rose-500/30 bg-rose-950/20'
        }`}>
          <div className="inline-flex p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-inner">
            <Trophy className={`w-12 h-12 ${isPassed ? 'text-amber-400' : 'text-rose-400'}`} />
          </div>

          <div>
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
              isPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {isPassed ? 'ĐẠT KẾT QUẢ' : 'CHƯA ĐẠT KẾT QUẢ'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {currentExam.score} / {currentExam.total} câu đúng ({currentExam.percentage}%)
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Các câu hỏi bạn làm sai đã được tự động thêm vào danh sách <strong className="text-rose-400">"Cần ôn lại"</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartNewExam}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm bài kiểm tra mới</span>
            </button>

            <button
              onClick={onGoToReview}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-sm transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Đến mục Cần Ôn Lại</span>
            </button>
          </div>
        </div>

        {/* Detailed Review of All 50 Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Xem Lại Chi Tiết 50 Câu Hỏi Bài Kiểm Tra
            </h3>
            <span className="text-xs text-slate-400">
              Câu {currentIndex + 1} / {examQuestions.length}
            </span>
          </div>

          {reviewQuestion && (
            <QuestionCard
              question={reviewQuestion}
              userAnswer={currentExam.userAnswers[reviewQuestion.id]}
              isBookmarked={bookmarkedQuestions.includes(reviewQuestion.id)}
              onAnswer={() => {}} // read-only after submit
              onToggleBookmark={onToggleBookmark}
              currentNumber={currentIndex + 1}
              totalCount={examQuestions.length}
              hasPrev={currentIndex > 0}
              hasNext={currentIndex < examQuestions.length - 1}
              onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              onNext={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
              readOnlyMode={true}
            />
          )}
        </div>

      </div>
    );
  }

  // 3. ACTIVE EXAM TAKING SCREEN
  const examQuestions = currentExam.questionIds.map((id) => questionsById.get(id)).filter(Boolean);
  const currentExamQuestion = examQuestions[currentIndex];
  const answeredCount = Object.keys(examAnswers).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Active Exam Header Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-30 shadow-xl">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Thời gian còn lại</div>
            <div className="text-lg font-extrabold text-amber-400 font-mono tracking-wider">
              {formatTime(timerSeconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs sm:text-sm font-semibold text-slate-300">
            Đã trả lời: <strong className="text-emerald-400 text-base">{answeredCount}</strong> / 50 câu
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-extrabold shadow-lg shadow-emerald-600/20 transition-all"
          >
            Nộp Bài Kiểm Tra
          </button>
        </div>

      </div>

      {/* Question Card */}
      {currentExamQuestion && (
        <QuestionCard
          question={currentExamQuestion}
          userAnswer={examAnswers[currentExamQuestion.id]}
          isBookmarked={bookmarkedQuestions.includes(currentExamQuestion.id)}
          onAnswer={handleSelectOption}
          onToggleBookmark={onToggleBookmark}
          currentNumber={currentIndex + 1}
          totalCount={examQuestions.length}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < examQuestions.length - 1}
          onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
          showFeedback={false}
        />
      )}

      {/* Exam Grid Pill Map */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Danh sách 50 câu hỏi kiểm tra:
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {examQuestions.map((q, idx) => {
            const isAnswered = Boolean(examAnswers[q.id]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                  isCurrent
                    ? 'bg-brand-500 text-white border-brand-400 ring-2 ring-brand-400/50'
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Xác nhận nộp bài kiểm tra
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bạn đã hoàn thành <strong className="text-emerald-400">{answeredCount} / 50</strong> câu hỏi. Bạn có chắc chắn muốn kết thúc và nộp bài ngay bây giờ?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={handleForceSubmit}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-colors"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
