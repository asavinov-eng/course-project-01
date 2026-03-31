// API Configuration
export const API_BASE_URL = 'https://your-energy.b.goit.study/api';

export const API_ENDPOINTS = {
  QUOTE: '/quote',
  FILTERS: '/filters',
  EXERCISES: '/exercises',
  EXERCISE_DETAIL: '/exercises',
  RATING: '/exercises/:id/rating',
  SUBSCRIPTION: '/subscription'
};

// Filters for exercises
export const FILTER_TYPES = {
  MUSCLES: 'Muscles',
  BODY_PARTS: 'Body parts',
  EQUIPMENT: 'Equipment'
};

// Default pagination settings
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

// DOM selectors
export const SELECTORS = {
  QUOTE_TEXT: '[data-quote-text]',
  QUOTE_AUTHOR: '[data-quote-author]',
  FILTERS_CONTAINER: '[data-filters]',
  FILTER_BTN: '[data-filter-btn]',
  EXERCISES_CONTAINER: '[data-exercises]',
  PAGINATION_CONTAINER: '[data-pagination]',
  MODAL: '[data-modal]',
  MODAL_CLOSE: '[data-modal-close]',
  SUBSCRIPTION_FORM: '[data-subscription-form]',
  SEARCH_INPUT: '[data-search-input]'
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_ERROR: 'Failed to fetch data. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SUBSCRIPTION_ERROR: 'Failed to subscribe. Please try again.',
  API_ERROR: 'API Error: '
};

// Success messages
export const SUCCESS_MESSAGES = {
  SUBSCRIPTION_SUCCESS: 'Thank you for subscribing!',
  RATING_UPDATED: 'Rating saved successfully!'
};
