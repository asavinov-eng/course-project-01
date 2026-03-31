/**
 * Utility functions for DOM manipulation and UI helpers
 */

/**
 * Create exercise card element
 * @param {object} exercise - Exercise data
 * @returns {HTMLElement} - Exercise card element
 */
export function createExerciseCard(exercise) {
  const card = document.createElement('div');
  card.className = 'exercise-card';
  card.setAttribute('data-exercise-id', exercise._id);
  
  const rating = createStarRating(exercise.rating || 0);
  
  card.innerHTML = `
    <div class="exercise-card__image">
      <img src="${exercise.gifUrl || exercise.image}" alt="${exercise.name}" loading="lazy" />
    </div>
    <div class="exercise-card__content">
      <h3 class="exercise-card__title">${exercise.name}</h3>
      <div class="exercise-card__rating">
        ${rating}
      </div>
      <div class="exercise-card__meta">
        <span class="exercise-card__category">${exercise.bodyPart || 'N/A'}</span>
        <span class="exercise-card__target">${exercise.target || 'N/A'}</span>
      </div>
      <div class="exercise-card__info">
        <span class="exercise-card__calories">~${exercise.burnedCalories || 0} | ${exercise.time || 0} min</span>
      </div>
      <button class="exercise-card__btn" data-exercise-id="${exercise._id}">
        Start
      </button>
    </div>
  `;
  
  return card;
}

/**
 * Create star rating element
 * @param {number} rating - Rating value (0-5 or more)
 * @returns {string} - HTML string for stars
 */
export function createStarRating(rating) {
  let stars = '';
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  
  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars += '<span class="star star--filled">★</span>';
    } else {
      stars += '<span class="star">☆</span>';
    }
  }
  
  return `<div class="rating">${stars} <span class="rating__value">${rating.toFixed(1)}</span></div>`;
}

/**
 * Create filter button
 * @param {string} label - Filter label
 * @param {string} value - Filter value
 * @param {boolean} isActive - Is button active
 * @returns {HTMLElement} - Filter button element
 */
export function createFilterButton(label, value, isActive = false) {
  const btn = document.createElement('button');
  btn.className = `filter-btn ${isActive ? 'filter-btn--active' : ''}`;
  btn.setAttribute('data-filter-value', value);
  btn.textContent = label;
  return btn;
}

/**
 * Debounce function for search input
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} - Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show notification message
 * @param {string} message - Message to show
 * @param {string} type - Message type (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // Remove any existing notifications of the same type to prevent stacking
  const existingNotifications = document.querySelectorAll(`.notification--${type}`);
  existingNotifications.forEach(notif => {
    notif.classList.remove('notification--show');
    setTimeout(() => notif.remove(), 300);
  });

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => notification.classList.add('notification--show'), 10);
  
  // Remove after duration
  setTimeout(() => {
    notification.classList.remove('notification--show');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Open modal dialog
 * @param {HTMLElement} modal - Modal element
 */
export function openModal(modal) {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Close modal dialog
 * @param {HTMLElement} modal - Modal element
 */
export function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  modal.setAttribute('aria-hidden', 'true');
}

/**
 * Format numbers with thousand separator
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Create pagination buttons
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {HTMLElement} - Pagination element
 */
export function createPaginationButtons(currentPage, totalPages) {
  const pagination = document.createElement('div');
  pagination.className = 'pagination';
  
  // First page button
  const firstBtn = document.createElement('button');
  firstBtn.className = 'pagination__btn pagination__btn--first';
  firstBtn.textContent = '<<';
  firstBtn.setAttribute('data-page', '1');
  firstBtn.disabled = currentPage === 1;
  pagination.appendChild(firstBtn);
  
  // Previous page button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination__btn pagination__btn--prev';
  prevBtn.textContent = '<';
  prevBtn.setAttribute('data-page', Math.max(1, currentPage - 1).toString());
  prevBtn.disabled = currentPage === 1;
  pagination.appendChild(prevBtn);
  
  // Page numbers (show 5 pages max)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination__btn pagination__btn--page ${i === currentPage ? 'pagination__btn--active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.setAttribute('data-page', i.toString());
    pagination.appendChild(pageBtn);
  }
  
  // Next page button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination__btn pagination__btn--next';
  nextBtn.textContent = '>';
  nextBtn.setAttribute('data-page', Math.min(totalPages, currentPage + 1).toString());
  nextBtn.disabled = currentPage === totalPages;
  pagination.appendChild(nextBtn);
  
  // Last page button
  const lastBtn = document.createElement('button');
  lastBtn.className = 'pagination__btn pagination__btn--last';
  lastBtn.textContent = '>>';
  lastBtn.setAttribute('data-page', totalPages.toString());
  lastBtn.disabled = currentPage === totalPages;
  pagination.appendChild(lastBtn);
  
  return pagination;
}

export default {
  createExerciseCard,
  createStarRating,
  createFilterButton,
  debounce,
  validateEmail,
  showNotification,
  openModal,
  closeModal,
  formatNumber,
  capitalizeFirstLetter,
  createPaginationButtons
};
