import { API_BASE_URL, API_ENDPOINTS, DEFAULT_LIMIT, ERROR_MESSAGES } from './constants.js';

/**
 * Generic fetch function with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<object>} - Response data
 */
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorMsg = `API Error ${response.status}: ${response.statusText} - ${endpoint}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Get quote of the day
 * @returns {Promise<object>} - Quote data
 */
export async function getQuote() {
  return apiCall(API_ENDPOINTS.QUOTE);
}

/**
 * Get filters by type
 * @param {string} filterType - Filter type (Muscles, Body parts, Equipment)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} - Filters data
 */
export async function getFilters(filterType, page = 1, limit = DEFAULT_LIMIT) {
  const params = new URLSearchParams({
    filter: filterType,
    page,
    limit
  });
  return apiCall(`${API_ENDPOINTS.FILTERS}?${params}`);
}

/**
 * Get exercises with optional filters
 * @param {object} filters - Filter object with optional properties: bodypart, muscles, equipment, keyword, page, limit
 * @returns {Promise<object>} - Exercises data
 */
export async function getExercises(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.bodypart) params.append('bodypart', filters.bodypart);
  if (filters.muscles) params.append('muscles', filters.muscles);
  if (filters.equipment) params.append('equipment', filters.equipment);
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = queryString ? `${API_ENDPOINTS.EXERCISES}?${queryString}` : API_ENDPOINTS.EXERCISES;
  
  return apiCall(endpoint);
}

/**
 * Get exercise details by ID
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise<object>} - Exercise details
 */
export async function getExerciseDetails(exerciseId) {
  return apiCall(`${API_ENDPOINTS.EXERCISE_DETAIL}/${exerciseId}`);
}

/**
 * Send exercise rating
 * @param {string} exerciseId - Exercise ID
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise<object>} - Response data
 */
export async function postExerciseRating(exerciseId, rating) {
  return apiCall(`${API_ENDPOINTS.EXERCISE_DETAIL}/${exerciseId}/rating`, {
    method: 'PATCH',
    body: JSON.stringify({ rating })
  });
}

/**
 * Subscribe user to newsletter
 * @param {string} email - Email address
 * @returns {Promise<object>} - Response data
 */
export async function postSubscription(email) {
  return apiCall(API_ENDPOINTS.SUBSCRIPTION, {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export default {
  getQuote,
  getFilters,
  getExercises,
  getExerciseDetails,
  postExerciseRating,
  postSubscription
};
