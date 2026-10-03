/**
 * Custom Interactive Cursor & Orange Glow Follower
 * Vicky — Portfolio
 */

(function () {
  'use strict';

  // Check if touch device
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }

  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  const cursorGlow = document.querySelector('.custom-cursor-glow');

  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;

  let glowX = mouseX;
  let glowY = mouseY;

  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      if (cursorGlow) cursorGlow.style.opacity = '1';
      isVisible = true;
    }

    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
    if (cursorGlow) cursorGlow.style.opacity = '0';
    isVisible = false;
  });

  // Smooth lerp loop for the ring and glowing aura
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    if (cursorGlow) {
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states on interactive elements
  const hoverSelectors = 'a, button, input, textarea, .project-card, .highlight-box, .skills-card, .filter-btn, .tech-tag';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();
