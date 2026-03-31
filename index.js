/* empty css                      */(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const m of o.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&r(m)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const R="https://your-energy.b.goit.study/api",d={QUOTE:"/quote",FILTERS:"/filters",EXERCISES:"/exercises",EXERCISE_DETAIL:"/exercises",RATING:"/exercises/:id/rating",SUBSCRIPTION:"/subscription"},h={MUSCLES:"Muscles",BODY_PARTS:"Body parts",EQUIPMENT:"Equipment"},S=10,l={FETCH_ERROR:"Failed to fetch data. Please try again.",VALIDATION_ERROR:"Please check your input and try again.",SUBSCRIPTION_ERROR:"Failed to subscribe. Please try again.",API_ERROR:"API Error: "},C={SUBSCRIPTION_SUCCESS:"Thank you for subscribing!",RATING_UPDATED:"Rating saved successfully!"};async function u(t,e={}){try{const a=`${R}${t}`,r=await fetch(a,{headers:{"Content-Type":"application/json",...e.headers},...e});if(!r.ok){const o=`API Error ${r.status}: ${r.statusText} - ${t}`;throw new Error(o)}return await r.json()}catch(a){throw console.error(`Failed to fetch ${t}:`,a.message),a}}async function A(){return u(d.QUOTE)}async function T(t,e=1,a=S){const r=new URLSearchParams({filter:t,page:e,limit:a});return u(`${d.FILTERS}?${r}`)}async function L(t={}){const e=new URLSearchParams;t.bodypart&&e.append("bodypart",t.bodypart),t.muscles&&e.append("muscles",t.muscles),t.equipment&&e.append("equipment",t.equipment),t.keyword&&e.append("keyword",t.keyword),t.page&&e.append("page",t.page),t.limit&&e.append("limit",t.limit);const a=e.toString(),r=a?`${d.EXERCISES}?${a}`:d.EXERCISES;return u(r)}async function I(t){return u(`${d.EXERCISE_DETAIL}/${t}`)}async function x(t,e){return u(`${d.EXERCISE_DETAIL}/${t}/rating`,{method:"PATCH",body:JSON.stringify({rating:e})})}async function q(t){return u(d.SUBSCRIPTION,{method:"POST",body:JSON.stringify({email:t})})}function $(t){const e=document.createElement("div");e.className="exercise-card",e.setAttribute("data-exercise-id",t._id);const a=F(t.rating||0);return e.innerHTML=`
    <div class="exercise-card__image">
      <img src="${t.gifUrl||t.image}" alt="${t.name}" loading="lazy" />
    </div>
    <div class="exercise-card__content">
      <h3 class="exercise-card__title">${t.name}</h3>
      <div class="exercise-card__rating">
        ${a}
      </div>
      <div class="exercise-card__meta">
        <span class="exercise-card__category">${t.bodyPart||"N/A"}</span>
        <span class="exercise-card__target">${t.target||"N/A"}</span>
      </div>
      <div class="exercise-card__info">
        <span class="exercise-card__calories">~${t.burnedCalories||0} | ${t.time||0} min</span>
      </div>
      <button class="exercise-card__btn" data-exercise-id="${t._id}">
        Start
      </button>
    </div>
  `,e}function F(t){let e="";const r=Math.floor(t);for(let n=0;n<5;n++)n<r?e+='<span class="star star--filled">★</span>':e+='<span class="star">☆</span>';return`<div class="rating">${e} <span class="rating__value">${t.toFixed(1)}</span></div>`}function P(t,e,a=!1){const r=document.createElement("button");return r.className=`filter-btn ${a?"filter-btn--active":""}`,r.setAttribute("data-filter-value",e),r.textContent=t,r}function w(t,e=300){let a;return function(...r){clearTimeout(a),a=setTimeout(()=>t.apply(this,r),e)}}function O(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}function c(t,e="info",a=3e3){document.querySelectorAll(`.notification--${e}`).forEach(o=>{o.classList.remove("notification--show"),setTimeout(()=>o.remove(),300)});const n=document.createElement("div");n.className=`notification notification--${e}`,n.textContent=t,n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),document.body.appendChild(n),setTimeout(()=>n.classList.add("notification--show"),10),setTimeout(()=>{n.classList.remove("notification--show"),setTimeout(()=>n.remove(),300)},a)}function N(t){t.style.display="flex",document.body.style.overflow="hidden",t.setAttribute("aria-hidden","false")}function b(t){t.style.display="none",document.body.style.overflow="auto",t.setAttribute("aria-hidden","true")}function M(t,e){const a=document.createElement("div");a.className="pagination";const r=document.createElement("button");r.className="pagination__btn pagination__btn--first",r.textContent="<<",r.setAttribute("data-page","1"),r.disabled=t===1,a.appendChild(r);const n=document.createElement("button");n.className="pagination__btn pagination__btn--prev",n.textContent="<",n.setAttribute("data-page",Math.max(1,t-1).toString()),n.disabled=t===1,a.appendChild(n);const o=Math.max(1,t-2),m=Math.min(e,o+4);for(let g=o;g<=m;g++){const y=document.createElement("button");y.className=`pagination__btn pagination__btn--page ${g===t?"pagination__btn--active":""}`,y.textContent=g,y.setAttribute("data-page",g.toString()),a.appendChild(y)}const p=document.createElement("button");p.className="pagination__btn pagination__btn--next",p.textContent=">",p.setAttribute("data-page",Math.min(e,t+1).toString()),p.disabled=t===e,a.appendChild(p);const f=document.createElement("button");return f.className="pagination__btn pagination__btn--last",f.textContent=">>",f.setAttribute("data-page",e.toString()),f.disabled=t===e,a.appendChild(f),a}const s={currentFilter:h.MUSCLES,currentPage:1,currentLimit:S,searchKeyword:"",selectedFilters:{bodypart:null,muscles:null,equipment:null},exercises:[],totalPages:1,currentExerciseId:null};let i={};async function _(){try{B(),U(),await D(),await v(h.MUSCLES)}catch(t){console.error("Failed to initialize app:",t),c(l.FETCH_ERROR,"error")}}function B(){i={quoteText:document.querySelector("[data-quote-text]"),quoteAuthor:document.querySelector("[data-quote-author]"),filtersContainer:document.querySelector("[data-filters]"),filterBtns:document.querySelectorAll("[data-filter-btn]"),exercisesContainer:document.querySelector("[data-exercises]"),paginationContainer:document.querySelector("[data-pagination]"),modal:document.querySelector("[data-modal]"),modalClose:document.querySelector("[data-modal-close]"),modalContent:document.querySelector("[data-modal-content]"),subscriptionForm:document.querySelector("[data-subscription-form]"),searchInput:document.querySelector("[data-search-input]"),modalRatingContainer:document.querySelector("[data-modal-rating]"),ratingForm:document.querySelector("[data-rating-form]")}}function U(){i.filterBtns&&i.filterBtns.forEach(t=>{t.addEventListener("click",H)}),i.modalClose&&i.modalClose.addEventListener("click",()=>{b(i.modal)}),i.modal&&i.modal.addEventListener("click",t=>{t.target===i.modal&&b(i.modal)}),i.subscriptionForm&&i.subscriptionForm.addEventListener("submit",J),i.searchInput&&i.searchInput.addEventListener("keyup",w(z,300)),i.exercisesContainer&&i.exercisesContainer.addEventListener("click",K),i.paginationContainer&&i.paginationContainer.addEventListener("click",V)}async function D(){try{const t=await A();i.quoteText&&(i.quoteText.textContent=t.quote),i.quoteAuthor&&(i.quoteAuthor.textContent=t.author)}catch(t){console.error("Failed to load quote:",t)}}async function v(t){try{s.currentFilter=t;const e=await T(t),a=document.querySelector("[data-category-filters]");if(a){a.innerHTML="";let r=[];Array.isArray(e)?r=e:e&&typeof e=="object"&&(e.results||e.data)&&(r=e.results||e.data||[]),r.length>0&&r.forEach(n=>{const o=P(n.name||n,n.name||n,!1);o.addEventListener("click",()=>k(n.name||n,t)),a.appendChild(o)})}s.currentPage=1,s.selectedFilters={bodypart:null,muscles:null,equipment:null},await E()}catch(e){console.error("Failed to load filters:",e),c(l.FETCH_ERROR,"error")}}async function H(t){const e=t.target.getAttribute("data-filter-value");document.querySelectorAll("[data-filter-btn]").forEach(r=>{r.classList.remove("filter-btn--active")}),t.target.classList.add("filter-btn--active"),await v(e)}async function k(t,e){try{const a=e===h.MUSCLES?"muscles":e===h.BODY_PARTS?"bodypart":"equipment";s.selectedFilters[a]=t,s.currentPage=1,await E()}catch(a){console.error("Category filter failed:",a),c(l.FETCH_ERROR,"error")}}async function E(){try{const t={...s.selectedFilters,keyword:s.searchKeyword,page:s.currentPage,limit:s.currentLimit};Object.keys(t).forEach(n=>{(t[n]===null||t[n]==="")&&delete t[n]});const e=await L(t);let a=[],r=1;Array.isArray(e)?(a=e,r=Math.ceil(e.length/s.currentLimit)||1):e&&e.results&&Array.isArray(e.results)?(a=e.results,r=e.totalPages||Math.ceil((e.total||e.results.length)/s.currentLimit)||1):e&&typeof e=="object"&&(a=Array.isArray(e)?e:[],r=1),s.exercises=a,s.totalPages=r,j(s.exercises),Y()}catch(t){console.error("Failed to load exercises:",t),s.searchKeyword.trim()&&c("No exercises found. Try a different search.","info")}}function j(t){if(i.exercisesContainer){if(!t||t.length===0){i.exercisesContainer.innerHTML='<p class="no-results">No exercises found. Try a different filter.</p>';return}i.exercisesContainer.innerHTML="",t.forEach(e=>{if(e&&e._id){const a=$(e);i.exercisesContainer.appendChild(a)}})}}async function K(t){if(t.target.classList.contains("exercise-card__btn")){const e=t.target.getAttribute("data-exercise-id");await X(e)}}async function X(t){try{s.currentExerciseId=t;const e=await I(t);G(e),N(i.modal)}catch(e){console.error("Failed to load exercise details:",e),c(l.FETCH_ERROR,"error")}}function G(t){if(!i.modalContent)return;i.modalContent.innerHTML=`
    <div class="modal__header">
      <h2>${t.name}</h2>
      <button class="modal__close" data-modal-close aria-label="Close modal">×</button>
    </div>
    
    <div class="modal__body">
      <div class="modal__image">
        <img src="${t.gifUrl||t.image}" alt="${t.name}" />
      </div>
      
      <div class="modal__info">
        <div class="modal__section">
          <h3>Rating</h3>
          <div class="modal__rating">
            <div class="rating"><span class="rating__value">${(t.rating||0).toFixed(1)}</span></div>
          </div>
        </div>
        
        <div class="modal__section">
          <h3>Details</h3>
          <ul class="modal__details">
            <li><strong>Body Part:</strong> ${t.bodyPart}</li>
            <li><strong>Target Muscle:</strong> ${t.target}</li>
            <li><strong>Equipment:</strong> ${t.equipment}</li>
            <li><strong>Burned Calories:</strong> ~${t.burnedCalories}</li>
            <li><strong>Time:</strong> ${t.time} min</li>
            <li><strong>Popularity:</strong> ${t.popularity}</li>
          </ul>
        </div>
        
        <div class="modal__section">
          <h3>Description</h3>
          <p>${t.description||"No description available."}</p>
        </div>
        
        <div class="modal__section">
          <h3>Rate this exercise</h3>
          <form class="rating-form" data-rating-form>
            <div class="rating-input">
              <input type="email" name="email" placeholder="Your email" required />
              <textarea name="comment" placeholder="Your comment" rows="3"></textarea>
              <div class="rating-stars">
                ${[1,2,3,4,5].map(r=>`<button type="button" class="rating-star" data-rating="${r}" title="${r} stars">★</button>`).join("")}
              </div>
              <button type="submit" class="btn btn--primary">Submit Rating</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;const e=i.modal.querySelector("[data-rating-form]");e&&e.addEventListener("submit",Q);const a=i.modal.querySelectorAll(".rating-star");a.forEach(r=>{r.addEventListener("click",n=>{n.preventDefault(),a.forEach(o=>o.classList.remove("active")),r.classList.add("active")})})}async function Q(t){t.preventDefault();try{const e=t.target.querySelector(".rating-star.active");if(!e){c("Please select a rating","error");return}const a=parseInt(e.getAttribute("data-rating"));await x(s.currentExerciseId,a),c(C.RATING_UPDATED,"success"),t.target.reset()}catch(e){console.error("Failed to submit rating:",e),c(l.FETCH_ERROR,"error")}}function Y(){if(!i.paginationContainer)return;if(s.totalPages<=1){i.paginationContainer.innerHTML="";return}const t=M(s.currentPage,s.totalPages);i.paginationContainer.innerHTML="",i.paginationContainer.appendChild(t)}async function V(t){var e;try{const a=t.target.closest("[data-page]");if(!a)return;const r=parseInt(a.getAttribute("data-page"));s.currentPage=r,await E(),(e=i.exercisesContainer)==null||e.scrollIntoView({behavior:"smooth"})}catch(a){console.error("Pagination failed:",a),c(l.FETCH_ERROR,"error")}}async function z(t){try{const e=t.target.value.trim();s.searchKeyword=e,s.currentPage=1,e&&(s.selectedFilters={bodypart:null,muscles:null,equipment:null}),await E()}catch(e){console.error("Search failed:",e)}}async function J(t){t.preventDefault();try{const e=t.target.querySelector('input[type="email"]').value.trim();if(!O(e)){c(l.VALIDATION_ERROR,"error");return}await q(e),c(C.SUBSCRIPTION_SUCCESS,"success"),t.target.reset()}catch(e){console.error("Subscription failed:",e),c(l.SUBSCRIPTION_ERROR,"error")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();
//# sourceMappingURL=index.js.map
