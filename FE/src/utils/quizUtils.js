/**
 * Helper utilities for WDU Quiz App
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
    const trimmed = question.answer.trim().toUpperCase();
    if (trimmed.includes(',')) {
      return trimmed.split(',').map((a) => a.trim().toUpperCase());
    }
    // Handle concatenated letter combos like 'AC', 'ABD', 'BCDE'
    if (/^[A-Z]{2,5}$/.test(trimmed) && !['TRUE', 'FALSE'].includes(trimmed)) {
      return trimmed.split('');
    }
    return [trimmed];
  }

  return [];
}

// Check if a question requires selecting multiple answers
export function isMultiAnswer(question) {
  if (question && question.multiple_answers) return true;
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
    const trimmed = userChoice.trim().toUpperCase();
    if (trimmed.includes(',')) {
      userArr = trimmed.split(',').map((c) => c.trim().toUpperCase());
    } else if (/^[A-Z]{2,5}$/.test(trimmed) && !['TRUE', 'FALSE'].includes(trimmed)) {
      userArr = trimmed.split('');
    } else {
      userArr = [trimmed];
    }
  }

  if (userArr.length !== correctAnswers.length) return false;

  const userSet = new Set(userArr);
  return correctAnswers.every((ans) => userSet.has(ans));
}
