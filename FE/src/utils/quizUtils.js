/**
 * Helper utilities for FER202 Quiz App
 */

// Extract list of correct answer letters for a question (e.g. ['A', 'B'])
export function getCorrectAnswers(question) {
  if (!question) return [];

  // Check 'answers' array field
  if (Array.isArray(question.answers) && question.answers.length > 0) {
    return question.answers.map((a) => String(a).trim().toUpperCase());
  }

  // Check 'answer' array field
  if (Array.isArray(question.answer) && question.answer.length > 0) {
    return question.answer.map((a) => String(a).trim().toUpperCase());
  }

  // Check 'answer' string field
  if (typeof question.answer === 'string') {
    if (question.answer.includes(',')) {
      return question.answer.split(',').map((a) => a.trim().toUpperCase());
    }
    return [question.answer.trim().toUpperCase()];
  }

  return [];
}

// Check if a question requires selecting multiple answers
export function isMultiAnswer(question) {
  return getCorrectAnswers(question).length > 1;
}

// Compare user choices with correct answers
export function checkIsCorrect(userChoice, question) {
  if (!userChoice || !question) return false;

  const correctAnswers = getCorrectAnswers(question);
  
  // Normalize user choices to array of uppercase letters
  let userArr = [];
  if (Array.isArray(userChoice)) {
    userArr = userChoice.map((c) => String(c).trim().toUpperCase());
  } else if (typeof userChoice === 'string') {
    if (userChoice.includes(',')) {
      userArr = userChoice.split(',').map((c) => c.trim().toUpperCase());
    } else {
      userArr = [userChoice.trim().toUpperCase()];
    }
  }

  if (userArr.length !== correctAnswers.length) return false;

  const userSet = new Set(userArr);
  return correctAnswers.every((ans) => userSet.has(ans));
}
