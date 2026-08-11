import { useState, useEffect, useMemo, useCallback } from 'react';
import rawDbData from '../data/db.json';
import { checkIsCorrect } from '../utils/quizUtils';

const STORAGE_KEYS = {
  ANSWERS: 'wdu203c_user_answers',
  INCORRECT: 'wdu203c_incorrect_questions',
  BOOKMARKS: 'wdu203c_bookmarked_questions',
  EXAM_HISTORY: 'wdu203c_exam_history',
  DARK_MODE: 'wdu203c_dark_mode',
  ACTIVE_TAB: 'wdu203c_active_tab',
};

// Helper to safely load JSON from localStorage (checking wdu first, falling back to legacy fer202)
const loadStorage = (key, fallback) => {
  try {
    let item = localStorage.getItem(key);
    if (!item && key.startsWith('wdu203c_')) {
      const legacyKey = key.replace('wdu203c_', 'fer202_');
      item = localStorage.getItem(legacyKey);
    }
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading localStorage key "${key}":`, e);
    return fallback;
  }
};

// Safe save to localStorage
const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key "${key}":`, e);
  }
};

export function useQuizState() {
  const questions = useMemo(() => rawDbData.questions || [], []);
  const totalQuestionsCount = rawDbData.total_questions || questions.length;
  const dbTitle = rawDbData.title || 'WDU203c Practice Questions and Answers';

  // Persistent States
  const [userAnswers, setUserAnswers] = useState(() => loadStorage(STORAGE_KEYS.ANSWERS, {}));
  const [incorrectQuestions, setIncorrectQuestions] = useState(() => loadStorage(STORAGE_KEYS.INCORRECT, []));
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(() => loadStorage(STORAGE_KEYS.BOOKMARKS, []));
  const [examHistory, setExamHistory] = useState(() => loadStorage(STORAGE_KEYS.EXAM_HISTORY, []));
  const [activeTab, setActiveTab] = useState(() => loadStorage(STORAGE_KEYS.ACTIVE_TAB, 'practice'));
  const [darkMode, setDarkMode] = useState(() => loadStorage(STORAGE_KEYS.DARK_MODE, true));

  // Current Active Exam State
  const [currentExam, setCurrentExam] = useState(null);

  // Sync dark mode class with HTML element
  useEffect(() => {
    saveStorage(STORAGE_KEYS.DARK_MODE, darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync persistent states to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.ANSWERS, userAnswers), [userAnswers]);
  useEffect(() => saveStorage(STORAGE_KEYS.INCORRECT, incorrectQuestions), [incorrectQuestions]);
  useEffect(() => saveStorage(STORAGE_KEYS.BOOKMARKS, bookmarkedQuestions), [bookmarkedQuestions]);
  useEffect(() => saveStorage(STORAGE_KEYS.EXAM_HISTORY, examHistory), [examHistory]);
  useEffect(() => saveStorage(STORAGE_KEYS.ACTIVE_TAB, activeTab), [activeTab]);

  // Quick lookup map for questions by ID
  const questionsById = useMemo(() => {
    const map = new Map();
    questions.forEach((q) => map.set(q.id, q));
    return map;
  }, [questions]);

  // Answer a question in Practice Mode
  const answerQuestion = useCallback((questionId, answerValue) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerValue }));

    const targetQuestion = questionsById.get(questionId);
    if (targetQuestion) {
      const isCorrect = checkIsCorrect(answerValue, targetQuestion);
      if (!isCorrect) {
        setIncorrectQuestions((prev) => {
          if (!prev.includes(questionId)) {
            return [...prev, questionId];
          }
          return prev;
        });
      }
    }
  }, [questionsById]);

  // Toggle bookmark for a question
  const toggleBookmark = useCallback((questionId) => {
    setBookmarkedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  }, []);

  // Remove a question from the Review (Cần ôn lại) list
  const removeFromReview = useCallback((questionId) => {
    setIncorrectQuestions((prev) => prev.filter((id) => id !== questionId));
  }, []);

  // Generate 50 random questions for Exam Mode
  const startNewExam = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(50, questions.length));
    const newExam = {
      id: Date.now(),
      createdTime: new Date().toISOString(),
      questionIds: selectedQuestions.map((q) => q.id),
      userAnswers: {},
      isSubmitted: false,
      score: 0,
      total: selectedQuestions.length,
      percentage: 0,
    };
    setCurrentExam(newExam);
    return newExam;
  }, [questions]);

  // Submit current exam
  const submitExam = useCallback((examAnswers) => {
    if (!currentExam) return null;

    let score = 0;
    const newIncorrectFromExam = [];

    currentExam.questionIds.forEach((qId) => {
      const q = questionsById.get(qId);
      const userChoice = examAnswers[qId];
      const isCorrect = checkIsCorrect(userChoice, q);
      if (q && isCorrect) {
        score += 1;
      } else if (q && userChoice) {
        newIncorrectFromExam.push(qId);
      }
    });

    const percentage = Math.round((score / currentExam.total) * 100);
    const finishedExam = {
      ...currentExam,
      userAnswers: examAnswers,
      isSubmitted: true,
      score,
      percentage,
      submittedAt: new Date().toISOString(),
    };

    setCurrentExam(finishedExam);

    // Automatically add wrong exam questions to review list
    if (newIncorrectFromExam.length > 0) {
      setIncorrectQuestions((prev) => {
        const set = new Set([...prev, ...newIncorrectFromExam]);
        return Array.from(set);
      });
    }

    // Save to exam history
    setExamHistory((prev) => [finishedExam, ...prev]);

    return finishedExam;
  }, [currentExam, questionsById]);

  // Reset all progress with confirmation
  const resetAllProgress = useCallback(() => {
    setUserAnswers({});
    setIncorrectQuestions([]);
    setBookmarkedQuestions([]);
    setExamHistory([]);
    setCurrentExam(null);
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.INCORRECT);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const answeredCount = Object.keys(userAnswers).length;
    let correctCount = 0;
    let incorrectCount = 0;

    Object.entries(userAnswers).forEach(([qIdStr, choice]) => {
      const q = questionsById.get(Number(qIdStr));
      if (q) {
        if (checkIsCorrect(choice, q)) correctCount += 1;
        else incorrectCount += 1;
      }
    });

    const progressPercentage = Math.round((answeredCount / totalQuestionsCount) * 100) || 0;
    const accuracyPercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    return {
      answeredCount,
      correctCount,
      incorrectCount,
      totalQuestionsCount,
      progressPercentage,
      accuracyPercentage,
      reviewCount: incorrectQuestions.length,
      bookmarkCount: bookmarkedQuestions.length,
    };
  }, [userAnswers, questionsById, totalQuestionsCount, incorrectQuestions.length, bookmarkedQuestions.length]);

  return {
    title: dbTitle,
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
    setCurrentExam,
    resetAllProgress,
  };
}
