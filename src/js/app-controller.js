import * as apiService from './api-service.js';
import * as uiHelpers from './ui-helpers.js';
import { FILTER_TYPES, DEFAULT_LIMIT, SELECTORS, SUCCESS_MESSAGES, ERROR_MESSAGES } from './constants.js';

// Application state
const appState = {
  currentFilter: FILTER_TYPES.MUSCLES,
  currentPage: 1,
  currentLimit: DEFAULT_LIMIT,
  searchKeyword: '',
  selectedFilters: {
    bodypart: null,
    muscles: null,
    equipment: null
  },
  exercises: [],
  totalPages: 1,
  currentExerciseId: null
};

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
export async function initApp() {
  try {
    cacheElements();
    attachEventListeners();
    
    // Load initial data
    await loadQuote();
    await loadFilters(FILTER_TYPES.MUSCLES);
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
  elements = {
    quoteText: document.querySelector('[data-quote-text]'),
    quoteAuthor: document.querySelector('[data-quote-author]'),
    filtersContainer: document.querySelector('[data-filters]'),
    filterBtns: document.querySelectorAll('[data-filter-btn]'),
    exercisesContainer: document.querySelector('[data-exercises]'),
    paginationContainer: document.querySelector('[data-pagination]'),
    modal: document.querySelector('[data-modal]'),
    modalClose: document.querySelector('[data-modal-close]'),
    modalContent: document.querySelector('[data-modal-content]'),
    subscriptionForm: document.querySelector('[data-subscription-form]'),
    searchInput: document.querySelector('[data-search-input]'),
    modalRatingContainer: document.querySelector('[data-modal-rating]'),
    ratingForm: document.querySelector('[data-rating-form]')
  };
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Filter buttons
  if (elements.filterBtns) {
    elements.filterBtns.forEach(btn => {
      btn.addEventListener('click', handleFilterChange);
    });
  }
  
  // Modal close button
  if (elements.modalClose) {
    elements.modalClose.addEventListener('click', () => {
      uiHelpers.closeModal(elements.modal);
    });
  }
  
  // Modal backdrop click
  if (elements.modal) {
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        uiHelpers.closeModal(elements.modal);
      }
    });
  }
  
  // Subscription form
  if (elements.subscriptionForm) {
    elements.subscriptionForm.addEventListener('submit', handleSubscription);
  }
  
  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('keyup', uiHelpers.debounce(handleSearch, 300));
  }
  
  // Exercises container (event delegation for exercise cards)
  if (elements.exercisesContainer) {
    elements.exercisesContainer.addEventListener('click', handleExerciseCardClick);
  }
  
  // Pagination container (event delegation)
  if (elements.paginationContainer) {
    elements.paginationContainer.addEventListener('click', handlePaginationClick);
  }
}

/**
 * Load and display quote of the day
 */
async function loadQuote() {
  try {
    const data = await apiService.getQuote();
    if (elements.quoteText) {
      elements.quoteText.textContent = data.quote;
    }
    if (elements.quoteAuthor) {
      elements.quoteAuthor.textContent = data.author;
    }
  } catch (error) {
    console.error('Failed to load quote:', error);
  }
}

/**
 * Load filters for the given type
 */
async function loadFilters(filterType) {
  try {
    appState.currentFilter = filterType;
    const data = await apiService.getFilters(filterType);
    
    // Clear previous filters
    const categoryContainer = document.querySelector('[data-category-filters]');
    if (categoryContainer) {
      categoryContainer.innerHTML = '';
      
      // Handle both array and object responses
      let filterItems = [];
      if (Array.isArray(data)) {
        filterItems = data;
      } else if (data && typeof data === 'object' && (data.results || data.data)) {
        filterItems = data.results || data.data || [];
      }
      
      // Add filter buttons for each category
      if (filterItems.length > 0) {
        filterItems.forEach(item => {
          const btn = uiHelpers.createFilterButton(item.name || item, item.name || item, false);
          btn.addEventListener('click', () => handleCategoryFilter(item.name || item, filterType));
          categoryContainer.appendChild(btn);
        });
      }
    }
    
    // Reset pagination and exercises
    appState.currentPage = 1;
    appState.selectedFilters = { bodypart: null, muscles: null, equipment: null };
    
    // Load initial exercises
    await loadExercises();
    
  } catch (error) {
    console.error('Failed to load filters:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Handle filter type change (Muscles, Body parts, Equipment)
 */
async function handleFilterChange(event) {
  const filterType = event.target.getAttribute('data-filter-value');
  
  // Update active state
  const allFilterBtns = document.querySelectorAll('[data-filter-btn]');
  allFilterBtns.forEach(btn => {
    btn.classList.remove('filter-btn--active');
  });
  event.target.classList.add('filter-btn--active');
  
  // Load new filters
  await loadFilters(filterType);
}

/**
 * Handle category filter selection
 */
async function handleCategoryFilter(categoryName, filterType) {
  try {
    // Update selected filter
    const filterKey = filterType === FILTER_TYPES.MUSCLES ? 'muscles' :
                     filterType === FILTER_TYPES.BODY_PARTS ? 'bodypart' : 'equipment';
    
    appState.selectedFilters[filterKey] = categoryName;
    appState.currentPage = 1;
    
    // Reload exercises with new filter
    await loadExercises();
  } catch (error) {
    console.error('Category filter failed:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Load and display exercises
 */
async function loadExercises() {
  try {
    const filters = {
      ...appState.selectedFilters,
      keyword: appState.searchKeyword,
      page: appState.currentPage,
      limit: appState.currentLimit
    };
    
    // Remove null and empty string filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });
    
    const data = await apiService.getExercises(filters);
    
    // Handle different API response formats
    let exercises = [];
    let totalPages = 1;
    
    if (Array.isArray(data)) {
      exercises = data;
      totalPages = Math.ceil(data.length / appState.currentLimit) || 1;
    } else if (data && data.results && Array.isArray(data.results)) {
      exercises = data.results;
      totalPages = data.totalPages || Math.ceil((data.total || data.results.length) / appState.currentLimit) || 1;
    } else if (data && typeof data === 'object') {
      exercises = Array.isArray(data) ? data : [];
      totalPages = 1;
    }
    
    appState.exercises = exercises;
    appState.totalPages = totalPages;
    
    renderExercises(appState.exercises);
    renderPagination();
    
  } catch (error) {
    console.error('Failed to load exercises:', error);
    // Don't show error for initial load, only for active searches
    if (appState.searchKeyword.trim()) {
      uiHelpers.showNotification('No exercises found. Try a different search.', 'info');
    }
  }
}

/**
 * Render exercises in the container
 */
function renderExercises(exercises) {
  if (!elements.exercisesContainer) return;
  
  if (!exercises || exercises.length === 0) {
    elements.exercisesContainer.innerHTML = '<p class="no-results">No exercises found. Try a different filter.</p>';
    return;
  }
  
  elements.exercisesContainer.innerHTML = '';
  exercises.forEach(exercise => {
    if (exercise && exercise._id) {
      const card = uiHelpers.createExerciseCard(exercise);
      elements.exercisesContainer.appendChild(card);
    }
  });
}

/**
 * Handle exercise card click (Start button)
 */
async function handleExerciseCardClick(event) {
  if (event.target.classList.contains('exercise-card__btn')) {
    const exerciseId = event.target.getAttribute('data-exercise-id');
    await showExerciseModal(exerciseId);
  }
}

/**
 * Show exercise detail modal
 */
async function showExerciseModal(exerciseId) {
  try {
    appState.currentExerciseId = exerciseId;
    const data = await apiService.getExerciseDetails(exerciseId);
    
    // Render modal content
    renderModalContent(data);
    uiHelpers.openModal(elements.modal);
    
  } catch (error) {
    console.error('Failed to load exercise details:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Render exercise detail in modal
 */
function renderModalContent(exercise) {
  if (!elements.modalContent) return;
  
  elements.modalContent.innerHTML = `
    <div class="modal__header">
      <h2>${exercise.name}</h2>
      <button class="modal__close" data-modal-close aria-label="Close modal">×</button>
    </div>
    
    <div class="modal__body">
      <div class="modal__image">
        <img src="${exercise.gifUrl || exercise.image}" alt="${exercise.name}" />
      </div>
      
      <div class="modal__info">
        <div class="modal__section">
          <h3>Rating</h3>
          <div class="modal__rating">
            <div class="rating"><span class="rating__value">${(exercise.rating || 0).toFixed(1)}</span></div>
          </div>
        </div>
        
        <div class="modal__section">
          <h3>Details</h3>
          <ul class="modal__details">
            <li><strong>Body Part:</strong> ${exercise.bodyPart}</li>
            <li><strong>Target Muscle:</strong> ${exercise.target}</li>
            <li><strong>Equipment:</strong> ${exercise.equipment}</li>
            <li><strong>Burned Calories:</strong> ~${exercise.burnedCalories}</li>
            <li><strong>Time:</strong> ${exercise.time} min</li>
            <li><strong>Popularity:</strong> ${exercise.popularity}</li>
          </ul>
        </div>
        
        <div class="modal__section">
          <h3>Description</h3>
          <p>${exercise.description || 'No description available.'}</p>
        </div>
        
        <div class="modal__section">
          <h3>Rate this exercise</h3>
          <form class="rating-form" data-rating-form>
            <div class="rating-input">
              <input type="email" name="email" placeholder="Your email" required />
              <textarea name="comment" placeholder="Your comment" rows="3"></textarea>
              <div class="rating-stars">
                ${[1, 2, 3, 4, 5].map((num) => 
                  `<button type="button" class="rating-star" data-rating="${num}" title="${num} stars">★</button>`
                ).join('')}
              </div>
              <button type="submit" class="btn btn--primary">Submit Rating</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Attach rating form handler
  const ratingForm = elements.modal.querySelector('[data-rating-form]');
  if (ratingForm) {
    ratingForm.addEventListener('submit', handleRatingSubmit);
  }
  
  // Attach star rating click handlers
  const ratingStars = elements.modal.querySelectorAll('.rating-star');
  ratingStars.forEach(star => {
    star.addEventListener('click', (e) => {
      e.preventDefault();
      ratingStars.forEach(s => s.classList.remove('active'));
      star.classList.add('active');
    });
  });
}

/**
 * Handle rating submission
 */
async function handleRatingSubmit(event) {
  event.preventDefault();
  
  try {
    const ratingValue = event.target.querySelector('.rating-star.active');
    if (!ratingValue) {
      uiHelpers.showNotification('Please select a rating', 'error');
      return;
    }
    
    const rating = parseInt(ratingValue.getAttribute('data-rating'));
    await apiService.postExerciseRating(appState.currentExerciseId, rating);
    
    uiHelpers.showNotification(SUCCESS_MESSAGES.RATING_UPDATED, 'success');
    event.target.reset();
    
  } catch (error) {
    console.error('Failed to submit rating:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Render pagination buttons
 */
function renderPagination() {
  if (!elements.paginationContainer) return;
  
  if (appState.totalPages <= 1) {
    elements.paginationContainer.innerHTML = '';
    return;
  }
  
  const pagination = uiHelpers.createPaginationButtons(appState.currentPage, appState.totalPages);
  elements.paginationContainer.innerHTML = '';
  elements.paginationContainer.appendChild(pagination);
}

/**
 * Handle pagination click
 */
async function handlePaginationClick(event) {
  try {
    const pageBtn = event.target.closest('[data-page]');
    if (!pageBtn) return;
    
    const page = parseInt(pageBtn.getAttribute('data-page'));
    appState.currentPage = page;
    await loadExercises();
    
    // Scroll to exercises
    elements.exercisesContainer?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Pagination failed:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.FETCH_ERROR, 'error');
  }
}

/**
 * Handle search input
 */
async function handleSearch(event) {
  try {
    const keyword = event.target.value.trim();
    appState.searchKeyword = keyword;
    appState.currentPage = 1;
    
    // Clear category filters when searching
    if (keyword) {
      appState.selectedFilters = { bodypart: null, muscles: null, equipment: null };
    }
    
    await loadExercises();
  } catch (error) {
    console.error('Search failed:', error);
  }
}

/**
 * Handle subscription form submission
 */
async function handleSubscription(event) {
  event.preventDefault();
  
  try {
    const email = event.target.querySelector('input[type="email"]').value.trim();
    
    if (!uiHelpers.validateEmail(email)) {
      uiHelpers.showNotification(ERROR_MESSAGES.VALIDATION_ERROR, 'error');
      return;
    }
    
    await apiService.postSubscription(email);
    uiHelpers.showNotification(SUCCESS_MESSAGES.SUBSCRIPTION_SUCCESS, 'success');
    event.target.reset();
    
  } catch (error) {
    console.error('Subscription failed:', error);
    uiHelpers.showNotification(ERROR_MESSAGES.SUBSCRIPTION_ERROR, 'error');
  }
}

// Export for testing/external use
export {
  appState,
  loadQuote,
  loadFilters,
  loadExercises,
  showExerciseModal
};
