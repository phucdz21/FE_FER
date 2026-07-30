import React, { useState } from 'react';
import { useQuizState } from './hooks/useQuizState';
import { Navbar } from './components/Navbar';
import { PracticeView } from './components/PracticeView';
import { ReviewView } from './components/ReviewView';
import { BookmarksView } from './components/BookmarksView';
import { ExamView } from './components/ExamView';
import { QuestionGrid } from './components/QuestionGrid';

export default function App() {
  const {
    title,
    questions,
    questionsById,
    userAnswers,
    incorrectQuestions,
    bookmarkedQuestions,
    examHistory,
    currentExam,
    activeTab,
    darkMode,
    stats,
    setActiveTab,
    setDarkMode,
    answerQuestion,
    toggleBookmark,
    removeFromReview,
    startNewExam,
    submitExam,
    resetAllProgress,
  } = useQuizState();

  const [isGridOpen, setIsGridOpen] = useState(false);
  const [selectedPracticeIndex, setSelectedPracticeIndex] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenQuestionGrid={() => setIsGridOpen(true)}
        onResetProgress={resetAllProgress}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'practice' && (
          <PracticeView
            questions={questions}
            userAnswers={userAnswers}
            bookmarkedQuestions={bookmarkedQuestions}
            incorrectQuestions={incorrectQuestions}
            stats={stats}
            onAnswer={answerQuestion}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'review' && (
          <ReviewView
            questionsById={questionsById}
            incorrectQuestions={incorrectQuestions}
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={toggleBookmark}
            onRemoveFromReview={removeFromReview}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            questionsById={questionsById}
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'exam' && (
          <ExamView
            questionsById={questionsById}
            currentExam={currentExam}
            examHistory={examHistory}
            bookmarkedQuestions={bookmarkedQuestions}
            onStartExam={startNewExam}
            onSubmitExam={submitExam}
            onToggleBookmark={toggleBookmark}
            onGoToReview={() => setActiveTab('review')}
          />
        )}
      </main>

      {/* Question Map / Grid Drawer Modal */}
      <QuestionGrid
        isOpen={isGridOpen}
        onClose={() => setIsGridOpen(false)}
        questions={questions}
        userAnswers={userAnswers}
        incorrectQuestions={incorrectQuestions}
        bookmarkedQuestions={bookmarkedQuestions}
        currentIndex={selectedPracticeIndex}
        onSelectQuestion={(idx) => {
          setSelectedPracticeIndex(idx);
          setActiveTab('practice');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FER202 ReactJS Interactive Quiz Master &copy; {new Date().getFullYear()}</span>
          <span>Dữ liệu: {stats.totalQuestionsCount} câu hỏi chuẩn FER202</span>
        </div>
      </footer>

    </div>
  );
}
