/**
 * KYZ UZATUU INVITATION - VANILLA JAVASCRIPT
 * Includes: Scroll-reveal, Countdown Timer, Calendar SVG animation, Parallax & Form handler
 */
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SCROLL REVEAL (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -40px 0px' // Triggers slightly before element enters fully
  });
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  // ==========================================
  // 2. CALENDAR HEART ANIMATION TRIGGER
  // ==========================================
  const highlightedDay = document.querySelector('.highlighted-day');
  const calendarHeart = document.querySelector('.calendar-heart');
  if (highlightedDay && calendarHeart) {
    const heartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Delayed slightly for a premium, deliberate entrance effect
          setTimeout(() => {
            calendarHeart.classList.add('active');
          }, 600);
        }
      });
    }, {
      threshold: 0.5
    });
    heartObserver.observe(highlightedDay);
  }
  // ==========================================
  // 3. PARALLAX EFFECT FOR BACKGROUND ORNAMENTS
  // ==========================================
  const parallaxLeft = document.getElementById('parallax-left');
  const parallaxRight = document.getElementById('parallax-right');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Slow, elegant shifting to create an illusion of depth
    if (parallaxLeft) {
      parallaxLeft.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
    if (parallaxRight) {
      parallaxRight.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
  });
  // ==========================================
  // 4. PRECISION COUNTDOWN TIMER TO JUNE 23
  // ==========================================
  const timerContainer = document.getElementById('countdown-timer');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  if (timerContainer) {
    // Target date: June 23, 2026 at 18:00:00 (Local Time)
    const targetDateStr = timerContainer.getAttribute('data-target-date') || '2026-06-23T18:00:00';
    const targetDate = new Date(targetDateStr).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        // Event has started or passed
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        clearInterval(timerInterval);
        return;
      }
      // Calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // DOM Updates with leading-zero padding
      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };
    // Run immediately to avoid showing '00' on initial load
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
  }
  // ==========================================
  // 5. RSVP FORM HANDLER
  // ==========================================
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestNameInput = document.getElementById('guestName');
      const attendanceInput = document.querySelector('input[name="attendance"]:checked');
      if (!guestNameInput || !attendanceInput) {
        alert('Сураныч, бардык талааларды толтуруңуз.');
        return;
      }
      const guestName = guestNameInput.value.trim();
      const attendance = attendanceInput.value === 'yes' ? 'Сөзсүз келем' : 'Бара албайм';
      // Log to console for demonstration
      console.log('RSVP Received:', { guestName, attendance });
      // Visual Click effect on submit button
      const submitBtn = rsvpForm.querySelector('.submit-button');
      if (submitBtn) {
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          submitBtn.style.transform = '';
        }, 150);
      }
      // Custom premium confirmation modal or alert (Kyrgyz translation of Thank You)
      setTimeout(() => {
        alert(`Рахмат! Сиздин жообуңуз кабыл алынды.\nКонок: ${guestName}\nСтатус: ${attendance}`);
        
        // Reset form
        rsvpForm.reset();
      }, 200);
    });
  }
});