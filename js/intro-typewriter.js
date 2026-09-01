/**
 * =========================================================================
 * Dynamic Moving-Cursor Typewriter Intro Animation
 * - Interactive mouse spotlight radial gradient
 * - Orange glowing cursor is attached immediately after newly typed letters
 * - Cursor advances smoothly letter-by-letter as words are typed
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

  // 2. Typewriter Words Configuration ("Welcome to my portfolio")
  const wordsConfig = [
    { text: "Welcome", class: "word-light" },
    { text: "to", class: "word-light" },
    { text: "my", class: "word-orange" },
    { text: "portfolio", class: "word-gradient" }
  ];

  container.innerHTML = '';

  // 3. Create the glowing orange cursor line
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  container.appendChild(cursor);

  let wordIdx = 0;
  let charIdx = 0;
  let currentWordSpan = null;

  const charSpeed = 65;   // ms per character
  const spaceSpeed = 110; // ms pause at word boundary

  function typeNextCharacter() {
    if (wordIdx >= wordsConfig.length) {
      // Completed all words: keep cursor blinking for 1.2s then smoothly dissolve
      setTimeout(revealHero, 1200);
      return;
    }

    const currentWordObj = wordsConfig[wordIdx];

    // If starting a new word, create its word wrapper span
    if (charIdx === 0) {
      currentWordSpan = document.createElement('span');
      currentWordSpan.className = 'typewriter-word ' + currentWordObj.class;
      container.insertBefore(currentWordSpan, cursor);
    }

    // Append new character to the current word
    const charSpan = document.createElement('span');
    charSpan.className = 'typewriter-char';
    charSpan.textContent = currentWordObj.text[charIdx];
    currentWordSpan.appendChild(charSpan);

    // Keep cursor directly following the current word / character
    container.insertBefore(cursor, currentWordSpan.nextSibling);

    charIdx++;

    // Word completed?
    if (charIdx >= currentWordObj.text.length) {
      wordIdx++;
      charIdx = 0;

      // If not the last word, insert a space and advance cursor
      if (wordIdx < wordsConfig.length) {
        const space = document.createElement('span');
        space.className = 'typewriter-space';
        space.innerHTML = '&nbsp;';
        container.insertBefore(space, cursor);
        setTimeout(typeNextCharacter, spaceSpeed);
      } else {
        setTimeout(typeNextCharacter, charSpeed);
      }
    } else {
      setTimeout(typeNextCharacter, charSpeed);
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

  // Start typing after initial smooth delay
  setTimeout(typeNextCharacter, 350);
})();
