/**
 * quizService.js
 * Modular service to handle quiz data operations.
 */

import quizData from '../data/questions.json';

// Fetches all questions from the local JSON file
export const getQuestions = () => {
  return quizData.questions;
};

// Fetches the quiz title and metadata
export const getQuizMetadata = () => {
  return {
    title: quizData.quizTitle
  };
};
