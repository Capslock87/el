/**
 * KYZ UZATUU - CLIENT SIDE INTERACTIVE ENGINE
 * Features: Background Audio Player, Dynamic Timer, Form Submission Hook & Modal, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. TEXT SPLITTING LOGIC FOR ASSEMBLE ANIMATIONS
  // ==========================================
  const assembleWords = document.querySelectorAll('.assemble-words');
  assembleWords.forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = '';
    const dirs = ['dir-left', 'dir-down', 'dir-zoom', 'dir-right', 'dir-up'];
    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.className = `assemble-word ${dirs[idx % dirs.length]}`;
      span.style.transitionDelay = `${idx * 0.1}s`;
      span.textContent = word;
      el.appendChild(span);
      if (idx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  });

  const assembleLetters = document.querySelectorAll('.assemble-letters');
  assembleLetters.forEach(el => {
    const text = el.textContent.trim();
    const letters = text.split('');
    el.innerHTML = '';
    const dirs = ['dir-left', 'dir-down', 'dir-zoom', 'dir-right', 'dir-up'];
    letters.forEach((letter, idx) => {
      if (letter === ' ') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.className = `assemble-letter ${dirs[idx % dirs.length]}`;
      span.style.transitionDelay = `${idx * 0.08}s`;
      span.textContent = letter;
      el.appendChild(span);
    });
  });

  // ==========================================
  // 1. FLOATING BACKGROUND MUSIC CONTROLLER & NOTES EMITTER
  // ==========================================
  const musicBtn = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');

  if (musicBtn && bgMusic) {
    let noteInterval = null;
    const noteEmojis = ['🎵', '🎶', '🎼', '♩', '♪', '♫', '♬'];

    function createFloatingNote() {
      const btnRect = musicBtn.getBoundingClientRect();
      const note = document.createElement('span');
      note.className = 'floating-note';
      note.textContent = noteEmojis[Math.floor(Math.random() * noteEmojis.length)];

      // Position at center of button
      const x = btnRect.left + btnRect.width / 2;
      const y = btnRect.top + btnRect.height / 2;

      note.style.left = `${x - 10}px`;
      note.style.top = `${y - 10}px`;

      // Fly leftwards and downwards (since button is fixed at top right)
      const xOffset = -20 - Math.random() * 50;
      const yOffset = 30 + Math.random() * 60;
      const rotOffset = (Math.random() - 0.5) * 90;

      note.style.setProperty('--x-offset', `${xOffset}px`);
      note.style.setProperty('--y-offset', `${yOffset}px`);
      note.style.setProperty('--rot-offset', `${rotOffset}deg`);

      document.body.appendChild(note);

      setTimeout(() => {
        note.remove();
      }, 2200);
    }

    function startFloatingNotes() {
      if (noteInterval) return;
      noteInterval = setInterval(createFloatingNote, 1200);
      createFloatingNote(); // Spawn one immediately
    }

    function stopFloatingNotes() {
      if (noteInterval) {
        clearInterval(noteInterval);
        noteInterval = null;
      }
    }

    // Attempt play/pause toggle
    musicBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });

    function playMusic() {
      bgMusic.play()
        .then(() => {
          musicBtn.classList.add('playing');
          startFloatingNotes();
        })
        .catch(err => {
          console.warn('Аудио файл табылган жок же ойнотууга уруксат берилген жок:', err);
          // Still toggle the spinning class visually to provide satisfying feedback
          musicBtn.classList.add('playing');
          startFloatingNotes();
        });
    }

    function pauseMusic() {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      stopFloatingNotes();
    }

    // Optional: Attempt autoplay after first user interaction (browser policy compliant)
    const autoPlayOnInteraction = () => {
      if (bgMusic.paused) {
        playMusic();
      }
      // Remove events after first trigger
      document.removeEventListener('click', autoPlayOnInteraction);
      document.removeEventListener('touchstart', autoPlayOnInteraction);
    };

    document.addEventListener('click', autoPlayOnInteraction);
    document.addEventListener('touchstart', autoPlayOnInteraction);
  }


  // ==========================================
  // 2. LIVE COUNTDOWN TIMER (November 20, 2026)
  // ==========================================
  const timerContainer = document.getElementById('countdown-timer');
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  if (timerContainer && daysEl && hoursEl && minutesEl && secondsEl) {
    const targetString = timerContainer.getAttribute('data-target') || '2026-11-20T18:00:00';
    const targetDate = new Date(targetString).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        clearInterval(timerInterval);
        return;
      }

      // Calculations
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Formatting to double digits
      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and then start interval
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }


  // ==========================================
  // 3. RSVP FORM & CUSTOM MODAL WINDOW
  // ==========================================
  const rsvpForm = document.getElementById('rsvpForm');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (rsvpForm && successModal && modalCloseBtn) {
    rsvpForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Stop page reload

      const guestNameInput = document.getElementById('guestName');
      const attendanceRadio = document.querySelector('input[name="attendance"]:checked');

      if (!guestNameInput || !attendanceRadio) return;

      const guestName = guestNameInput.value.trim();
      const attendance = attendanceRadio.value;

      console.log('Жөнөтүлгөн RSVP жообу:', { guestName, attendance });

      // Open Success Modal with smooth scale
      successModal.classList.add('active');

      // Reset the form fields cleanly
      rsvpForm.reset();
    });

    // Close Modal Event
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close Modal on clicking outside the card
    successModal.addEventListener('click', (event) => {
      if (event.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }


  // ==========================================
  // 4. SCROLL REVEAL VIA INTERSECTION OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.fade-in, .reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      threshold: 0.08, // Trigger when 8% is visible
      rootMargin: '0px 0px -30px 0px' // Slightly offset bottom threshold for natural feel
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once animation is executed to keep DOM performance fast
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      scrollObserver.observe(element);
    });
  } else {
    // Fallback for ancient browsers: immediately show all elements
    revealElements.forEach(element => {
      element.classList.add('visible');
    });
  }

});
