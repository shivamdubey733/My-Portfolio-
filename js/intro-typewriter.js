/**
 * =========================================================================
 * Clean IEEE GEC Style Typewriter Intro Animation
 * - Interactive mouse spotlight radial gradient
 * - Smooth character typewriter reveal with blinking cursor
 * - Clean automatic dissolve transition into the hero portfolio page
 * =========================================================================
 */

(function () {
  'use strict';

  const wrapper = document.getElementById('intro-wrapper');
  const container = document.getElementById('typewriter-container');

  if (!wrapper || !container) return;

  // 1. Mouse Spotlight Tracker (Matches IEEE GEC)
  function onMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    wrapper.style.setProperty('--mouse-x', x + '%');
    wrapper.style.setProperty('--mouse-y', y + '%');
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // 2. Typewriter Words Configuration ("welcome to my portfolio")
  const wordsConfig = [
    { text: "Welcome", class: "word-light" },
    { text: "to", class: "word-light" },
    { text: "my", class: "word-orange" },
    { text: "portfolio", class: "word-gradient" }
  ];

  container.innerHTML = '';
  const allChars = [];

  wordsConfig.forEach((wordObj, wIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'typewriter-word ' + wordObj.class;

    for (let i = 0; i < wordObj.text.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.className = 'typewriter-char';
      charSpan.textContent = wordObj.text[i];
      wordSpan.appendChild(charSpan);
      allChars.push(charSpan);
    }

    container.appendChild(wordSpan);

    // Add space between words if not last
    if (wIdx < wordsConfig.length - 1) {
      const space = document.createElement('span');
      space.innerHTML = '&nbsp;';
      container.appendChild(space);
    }
  });

  // Blinking Cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  container.appendChild(cursor);

  // Animate Typing
  let currentIdx = 0;
  const charDelay = 70; // ms per character

  function typeNext() {
    if (currentIdx < allChars.length) {
      allChars[currentIdx].classList.add('revealed');
      currentIdx++;
      setTimeout(typeNext, charDelay);
    } else {
      // Completed: Pause 1.2s then smoothly dissolve into main page
      setTimeout(revealHero, 1200);
    }
  }

  function revealHero() {
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'scale(1.04)';
    setTimeout(() => {
      wrapper.style.display = 'none';
      window.removeEventListener('mousemove', onMouseMove);
    }, 800);
  }

  // Start typing after initial pause
  setTimeout(typeNext, 300);
})();
