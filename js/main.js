/**
 * SATHIYARAJ — Awwwards-Grade Developer Portfolio
 * Interactive Systems Engine
 * Includes: Premium Custom Cursor with Physics & Magnetic Buttons,
 * Floating Nav Spy, Interactive Skill Wall, and Simulated Assistant Console.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. FUTURISTIC TECH HUD CURSOR SYSTEM
  // ==========================================================================
  const hudDot = document.getElementById('hud-dot');
  const hudReticle = document.getElementById('hud-reticle');
  const hudGlow = document.getElementById('hud-glow');
  const hudLabel = document.getElementById('hud-label');
  const trailCanvas = document.getElementById('hud-trail-canvas');
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasFinePointer && !prefersReducedMotion && hudDot && hudReticle) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;
    let reticleX = mouseX;
    let reticleY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    let isVisible = false;

    // Telemetry particle trails
    let particles = [];
    let lastTrailX = mouseX;
    let lastTrailY = mouseY;
    let ctx = null;

    if (trailCanvas) {
      ctx = trailCanvas.getContext('2d');
      const resizeCanvas = () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        hudDot.style.opacity = '1';
        hudReticle.style.opacity = '1';
        if (hudGlow) hudGlow.style.opacity = '1';
        isVisible = true;
      }

      // Add lightweight telemetry trailing particle if mouse moved enough
      const dist = Math.hypot(mouseX - lastTrailX, mouseY - lastTrailY);
      if (dist > 18 && particles.length < 8) {
        particles.push({
          x: mouseX,
          y: mouseY,
          alpha: 0.45,
          size: 2.2
        });
        lastTrailX = mouseX;
        lastTrailY = mouseY;
      }
    });

    document.addEventListener('mouseleave', () => {
      hudDot.style.opacity = '0';
      hudReticle.style.opacity = '0';
      if (hudGlow) hudGlow.style.opacity = '0';
      isVisible = false;
      particles = [];
      if (ctx) ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    });

    // 60FPS HUD Physics Render Loop
    function renderHudCursor() {
      // Center target point follows near-immediately
      dotX += (mouseX - dotX) * 0.78;
      dotY += (mouseY - dotY) * 0.78;
      hudDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate3d(-50%, -50%, 0)`;

      // Outer HUD Reticle follows with a refined trailing delay
      reticleX += (mouseX - reticleX) * 0.16;
      reticleY += (mouseY - reticleY) * 0.16;
      hudReticle.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0) translate3d(-50%, -50%, 0)`;

      // Subtle ambient orange halo
      if (hudGlow) {
        glowX += (mouseX - glowX) * 0.06;
        glowY += (mouseY - glowY) * 0.06;
        hudGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate3d(-50%, -50%, 0)`;
      }

      // Draw subtle telemetry trail
      if (ctx && trailCanvas) {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          ctx.fillStyle = `rgba(255, 85, 0, ${p.alpha})`;
          ctx.fillRect(p.x - 1, p.y - 1, p.size, p.size);
          p.alpha -= 0.04;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
          }
        }
      }

      // Render independent floating label with smooth lerp physics and boundary detection
      if (hudLabel && isStateActive) {
        const targetPos = computeLabelTarget(mouseX, mouseY, currentHoverEl);
        labelX += (targetPos.x - labelX) * 0.24;
        labelY += (targetPos.y - labelY) * 0.24;
        hudLabel.style.transform = `translate3d(${labelX.toFixed(1)}px, ${labelY.toFixed(1)}px, 0)`;
      }

      requestAnimationFrame(renderHudCursor);
    }

    // Floating HUD Tag Coordinates
    let labelX = mouseX + 18;
    let labelY = mouseY - 14;
    let currentHoverEl = null;
    let isStateActive = false;

    // Viewport-aware, non-blocking target calculator for the floating HUD label
    function computeLabelTarget(mX, mY, el) {
      let targetX = mX + 18;
      let targetY = mY - 14;
      const labelW = (hudLabel && hudLabel.offsetWidth) ? hudLabel.offsetWidth : 76;
      const labelH = (hudLabel && hudLabel.offsetHeight) ? hudLabel.offsetHeight : 24;

      if (el && document.body.classList.contains('hud-state-btn')) {
        const rect = el.getBoundingClientRect();
        const spacing = 12;

        // Ensure the label stays completely OUTSIDE the button's content area
        // If there is enough room above the button, place it cleanly above with generous spacing
        if (rect.top - labelH - spacing >= 10) {
          targetY = rect.top - labelH - spacing;
        } else {
          // If close to the top edge of viewport, place cleanly below the button
          targetY = rect.bottom + spacing;
        }

        // Horizontally follow mouseX with offset beside the cursor
        targetX = mX + 18;

        // Viewport edge detection horizontally
        if (targetX + labelW + 16 > window.innerWidth) {
          targetX = mX - labelW - 18;
        }
        if (targetX < 12) {
          targetX = 12;
        }
      } else if (el && document.body.classList.contains('hud-state-nav')) {
        const rect = el.getBoundingClientRect();
        const spacing = 12;

        // Navigation links in the top floating pill: place cleanly below the pill
        targetY = rect.bottom + spacing;
        targetX = mX + 14;

        if (targetX + labelW + 16 > window.innerWidth) {
          targetX = mX - labelW - 14;
        }
        if (targetX < 12) {
          targetX = 12;
        }
      } else {
        // General elements (cards, project scanner, AI triggers):
        targetX = mX + 22;
        targetY = mY - 14;

        // Viewport edge detection
        if (targetX + labelW + 16 > window.innerWidth) {
          targetX = mX - labelW - 20;
        }
        if (targetX < 12) {
          targetX = 12;
        }
        if (targetY < 12) {
          targetY = mY + 24;
        } else if (targetY + labelH + 16 > window.innerHeight) {
          targetY = mY - labelH - 16;
        }
      }

      return { x: targetX, y: targetY };
    }

    requestAnimationFrame(renderHudCursor);

    // State manager
    function setHudState(stateClass, labelText, element = null) {
      document.body.classList.remove('hud-state-nav', 'hud-state-btn', 'hud-state-project', 'hud-state-ai-scan');
      currentHoverEl = element;
      if (stateClass) {
        document.body.classList.add(stateClass);
        if (hudLabel) {
          hudLabel.textContent = labelText;
          // Snap initial target position immediately on entry to prevent sliding across buttons
          const initialTarget = computeLabelTarget(mouseX, mouseY, currentHoverEl);
          labelX = initialTarget.x;
          labelY = initialTarget.y;
          hudLabel.style.transform = `translate3d(${labelX.toFixed(1)}px, ${labelY.toFixed(1)}px, 0)`;
        }
        isStateActive = true;
      } else {
        isStateActive = false;
        currentHoverEl = null;
        if (hudLabel) hudLabel.textContent = '';
      }
    }

    // --- 1. Hover: Navigation (NAV + Targeting Brackets) ---
    const navTriggers = document.querySelectorAll('.hover-nav-trigger, .nav-link-item, .pill-logo, .pill-mobile-toggle');
    navTriggers.forEach((el) => {
      el.addEventListener('mouseenter', () => setHudState('hud-state-nav', 'NAV', el));
      el.addEventListener('mouseleave', () => setHudState(null, '', null));
    });

    // --- 2. Hover: CTA Buttons (Targeting Reticle + OPEN ↗ + Magnetic Pull) ---
    const buttonTriggers = document.querySelectorAll(
      '.btn-hero-primary, .btn-hero-secondary, .contact-btn-huge, .assistant-sim-btn, .contact-link-card, .project-action-link-btn, .hover-btn-trigger, button'
    );
    buttonTriggers.forEach((btn) => {
      let label = 'OPEN ↗';
      if (btn.classList.contains('btn-hero-primary')) label = 'EXPLORE ↓';
      else if (btn.classList.contains('btn-hero-secondary')) label = 'TERMINAL ⚡';
      else if (btn.classList.contains('project-action-link-btn')) label = 'READ ↗';
      else if (btn.classList.contains('assistant-sim-btn')) label = 'RUN ▶';

      btn.addEventListener('mouseenter', () => setHudState('hud-state-btn', label, btn));
      btn.addEventListener('mouseleave', () => setHudState(null, '', null));
    });

    // Magnetic Attraction on Action Buttons
    const magneticElements = document.querySelectorAll('.btn-magnetic');
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        el.style.transform = `translate(${deltaX * 0.22}px, ${deltaY * 0.22}px)`;

        const arrow = el.querySelector('.btn-arrow, .action-arrow');
        if (arrow) {
          arrow.style.transform = `translate(${deltaX * 0.38}px, ${deltaY * 0.38}px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        const arrow = el.querySelector('.btn-arrow, .action-arrow');
        if (arrow) {
          arrow.style.transform = 'translate(0px, 0px)';
        }
      });
    });

    // --- 3. Hover: Standard Project Cards (Digital Scanner + VIEW ↗) ---
    const projectCards = document.querySelectorAll('.hover-project-trigger');
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('hover-ai-trigger')) {
          setHudState('hud-state-project', 'VIEW ↗', card);
        }
      });
      card.addEventListener('mouseleave', () => setHudState(null, '', null));
    });

    // --- 4. Special AI Interaction: Personal AI Assistant (AI Scanner + AI SCAN) ---
    const aiTriggers = document.querySelectorAll('.hover-ai-trigger, [data-project="assistant"], .assistant-console-frame');
    aiTriggers.forEach((aiEl) => {
      aiEl.addEventListener('mouseenter', () => {
        setHudState('hud-state-ai-scan', 'AI SCAN', aiEl);
      });
      aiEl.addEventListener('mouseleave', () => setHudState(null, '', null));
    });

    // --- 5. Personal Portrait: Subtle 3D Parallax Tilt & HUD Target ---
    const heroPortraitStage = document.getElementById('hero-portrait');
    if (heroPortraitStage) {
      const portraitCard = heroPortraitStage.querySelector('.portrait-card-frame');
      heroPortraitStage.addEventListener('mouseenter', () => {
        setHudState('hud-state-project', 'SATHIYARAJ', heroPortraitStage);
      });
      heroPortraitStage.addEventListener('mousemove', (e) => {
        if (!portraitCard) return;
        const rect = heroPortraitStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = -y * 8;
        const tiltY = x * 8;
        portraitCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px) scale(1.015)`;
      });
      heroPortraitStage.addEventListener('mouseleave', () => {
        setHudState(null, '', null);
        if (portraitCard) {
          portraitCard.style.transform = '';
        }
      });
    }
  }

  // ==========================================================================
  // 2. FLOATING PILL NAVIGATION (PROGRESSIVE SCROLL EXPANSION & SPY)
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navWrapper = navbar ? navbar.querySelector('.nav-pill-wrapper') : null;
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');
  const pillLogo = navbar ? navbar.querySelector('.pill-logo') : null;
  const pillLinksList = navbar ? navbar.querySelector('.pill-links-list') : null;

  let targetNavProgress = 0;
  let currentNavProgress = 0;

  function calculateNavProgress() {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    // Expands smoothly and progressively through the hero section
    const expansionRange = Math.max(heroHeight * 0.72, 450);
    const raw = Math.min(Math.max(scrollY / expansionRange, 0), 1);
    // Smoothstep cubic easing: 3p^2 - 2p^3
    targetNavProgress = raw * raw * (3 - 2 * raw);
  }

  window.addEventListener('scroll', calculateNavProgress, { passive: true });
  window.addEventListener('resize', calculateNavProgress, { passive: true });
  calculateNavProgress();

  function renderNavbar() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Keep mobile navbar clean, compact, and sticky without extreme expansion
      if (navbar && navWrapper) {
        navbar.style.top = 'max(0.75rem, env(safe-area-inset-top))';
        navWrapper.style.padding = '0.45rem 1rem';
        navWrapper.style.gap = '0.75rem';
        navWrapper.style.backgroundColor = 'rgba(9, 9, 11, 0.92)';
        navWrapper.style.backdropFilter = 'blur(16px)';
        navWrapper.style.webkitBackdropFilter = 'blur(16px)';
        navWrapper.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        navWrapper.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
      }
    } else {
      // 60FPS fluid physics lerp for desktop
      currentNavProgress += (targetNavProgress - currentNavProgress) * 0.14;
      if (Math.abs(targetNavProgress - currentNavProgress) < 0.0005) {
        currentNavProgress = targetNavProgress;
      }

      const p = currentNavProgress;

      if (navbar && navWrapper) {
        // Top position: 1.75rem (28px) down to 1.15rem (18.4px)
        const topPx = (28 - p * 9.6).toFixed(2);
        navbar.style.top = `${topPx}px`;

        // Padding: 0.35rem 1rem -> 0.62rem 1.65rem
        const padV = (0.35 + p * 0.27).toFixed(3);
        const padH = (1.0 + p * 0.65).toFixed(3);
        navWrapper.style.padding = `${padV}rem ${padH}rem`;

        // Gap: 1rem -> 2.2rem
        const gapRem = (1.0 + p * 1.2).toFixed(3);
        navWrapper.style.gap = `${gapRem}rem`;

        // Background: rgba(9, 9, 11, 0.45) -> rgba(9, 9, 11, 0.94)
        const bgAlpha = (0.45 + p * 0.49).toFixed(3);
        navWrapper.style.backgroundColor = `rgba(9, 9, 11, ${bgAlpha})`;

        // Backdrop Filter blur: 8px -> 20px
        const blurPx = (8 + p * 12).toFixed(1);
        navWrapper.style.backdropFilter = `blur(${blurPx}px)`;
        navWrapper.style.webkitBackdropFilter = `blur(${blurPx}px)`;

        // Border: rgba(255, 255, 255, 0.08) -> rgba(255, 255, 255, 0.15)
        const borderAlpha = (0.08 + p * 0.07).toFixed(3);
        navWrapper.style.borderColor = `rgba(255, 255, 255, ${borderAlpha})`;

        // Box shadow: 0 4px 16px rgba(0,0,0,0.2) -> 0 12px 45px rgba(0,0,0,0.55)
        const shadowY = (4 + p * 8).toFixed(1);
        const shadowBlur = (16 + p * 29).toFixed(1);
        const shadowAlpha = (0.2 + p * 0.35).toFixed(3);
        navWrapper.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`;

        // Logo: font-size 0.86rem -> 1.02rem, opacity 0.85 -> 1.0
        if (pillLogo) {
          pillLogo.style.fontSize = `${(0.86 + p * 0.16).toFixed(3)}rem`;
          pillLogo.style.opacity = (0.85 + p * 0.15).toFixed(3);
        }

        // Links List gap: 0.2rem -> 0.45rem
        if (pillLinksList) {
          pillLinksList.style.gap = `${(0.2 + p * 0.25).toFixed(3)}rem`;
        }

        // Nav Link Items: font-size 0.72rem -> 0.78rem, padding: 0.28rem 0.55rem -> 0.42rem 0.85rem
        navLinks.forEach((link) => {
          link.style.fontSize = `${(0.72 + p * 0.06).toFixed(3)}rem`;
          link.style.padding = `${(0.28 + p * 0.14).toFixed(3)}rem ${(0.55 + p * 0.3).toFixed(3)}rem`;
        });
      }
    }

    requestAnimationFrame(renderNavbar);
  }
  requestAnimationFrame(renderNavbar);

  // IntersectionObserver for active section highlight
  const observerOptions = {
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${activeId}`) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // Mobile Menu Curtain with Accessibility & Body Scroll Lock
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileCurtain = document.getElementById('mobile-curtain');
  const mobileClose = document.getElementById('mobile-close-btn');
  const curtainLinks = document.querySelectorAll('.mobile-curtain-link');

  if (mobileToggle && mobileCurtain) {
    const openCurtain = () => {
      mobileCurtain.classList.add('open');
      mobileCurtain.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeCurtain = () => {
      mobileCurtain.classList.remove('open');
      mobileCurtain.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openCurtain);
    if (mobileClose) mobileClose.addEventListener('click', closeCurtain);
    curtainLinks.forEach((l) => l.addEventListener('click', closeCurtain));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileCurtain.classList.contains('open')) {
        closeCurtain();
      }
    });
  }

  // ==========================================================================
  // 3. INTERACTIVE SKILL WALL & STICKY DETAIL INSPECTOR
  // ==========================================================================
  const skillData = {
    ai: {
      tag: 'SPECIALIZATION 01 // CORE FOCUS',
      title: 'ARTIFICIAL INTELLIGENCE',
      desc: 'Harnessing modern Large Language Models, generative tool-calling, autonomous reasoning loops, and prompt chains to construct practical software agents and intelligent workflow augmentations.',
      tags: ['LLM APIs', 'Prompt Chaining', 'Function Calling', 'Speech Recognition', 'Autonomous Agents']
    },
    python: {
      tag: 'SPECIALIZATION 02 // AUTOMATION',
      title: 'PYTHON AUTOMATION',
      desc: 'Developing bulletproof scripting engines, automated filesystem listeners, data ETL pipelines, desktop background daemons, and OS-level task orchestrators.',
      tags: ['Python 3', 'System Daemons', 'OS Interfaces', 'Task Schedulers', 'Automation Scripts']
    },
    web: {
      tag: 'SPECIALIZATION 03 // FRONTEND',
      title: 'AI-ASSISTED WEB CREATION',
      desc: 'Engineering ultra-fast, responsive web interfaces using semantic HTML5, modern CSS3 layout algorithms, vanilla JavaScript, and rapid prototyping workflows.',
      tags: ['Semantic HTML5', 'Modern CSS / Grid', 'Vanilla JS', 'Rapid UI Prototyping', 'Responsive UX']
    },
    sql: {
      tag: 'SPECIALIZATION 04 // DATA SYSTEMS',
      title: 'SQL & RELATIONAL DATA',
      desc: 'Designing 3NF normalized schemas, multi-table relationships, index optimizations, ACID transactions, and robust queries across academic and business datasets.',
      tags: ['PostgreSQL / MySQL', '3NF Normalization', 'Complex Joins', 'Indexing Strategy', 'Query Tuning']
    },
    context: {
      tag: 'SPECIALIZATION 05 // AI ARCHITECTURE',
      title: 'CONTEXT ENGINEERING',
      desc: 'Structuring system prompts, context management windows, retrieval hierarchies, and deterministic steerability for AI models and autonomous agent workflows.',
      tags: ['System Prompts', 'Context Windows', 'Deterministic Output', 'Few-Shot Patterns', 'Instruction Tuning']
    },
    git: {
      tag: 'SPECIALIZATION 06 // WORKFLOW',
      title: 'VERSION CONTROL & GIT',
      desc: 'Professional branch workflows, atomic commit hygiene, merge conflict resolution, code reviews, and reproducible software version management.',
      tags: ['Git CLI', 'Branch Strategies', 'GitHub Workflows', 'Atomic Commits', 'CI/CD Foundations']
    }
  };

  const skillItems = document.querySelectorAll('.skill-wall-item');
  const inspectorTag = document.getElementById('inspector-tag');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');
  const inspectorTagsList = document.getElementById('inspector-tags-list');

  function updateSkillInspector(skillKey) {
    const data = skillData[skillKey];
    if (!data || !inspectorTitle) return;

    // Visual transition
    inspectorTitle.style.opacity = '0';
    inspectorDesc.style.opacity = '0';
    inspectorTagsList.style.opacity = '0';

    setTimeout(() => {
      inspectorTag.textContent = data.tag;
      inspectorTitle.textContent = data.title;
      inspectorDesc.textContent = data.desc;

      inspectorTagsList.innerHTML = '';
      data.tags.forEach((t) => {
        const chip = document.createElement('span');
        chip.className = 'tech-tag-chip';
        chip.textContent = t;
        inspectorTagsList.appendChild(chip);
      });

      inspectorTitle.style.opacity = '1';
      inspectorDesc.style.opacity = '1';
      inspectorTagsList.style.opacity = '1';
    }, 120);
  }

  skillItems.forEach((item) => {
    const skillKey = item.getAttribute('data-skill');

    item.addEventListener('mouseenter', () => {
      skillItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      updateSkillInspector(skillKey);
    });

    item.addEventListener('click', () => {
      skillItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      updateSkillInspector(skillKey);
    });
  });

  // ==========================================================================
  // 4. ASSISTANT CONSOLE SIMULATOR & AUDIO WAVEFORM
  // ==========================================================================
  const waveformBars = document.querySelectorAll('#console-waveform span');
  const consoleFeed = document.getElementById('console-logs-feed');
  const assistantSimButtons = document.querySelectorAll('.assistant-sim-btn');

  // Dynamic Audio Waveform Pulsing
  if (!prefersReducedMotion) {
    let waveInterval = setInterval(() => {
      waveformBars.forEach((bar) => {
        const randomHeight = Math.floor(Math.random() * 32) + 8;
        bar.style.height = `${randomHeight}px`;
        if (randomHeight > 24) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    }, 180);
  }

  const cannedSimulations = {
    status: {
      query: 'Check System Status',
      response: 'Core status: OPTIMAL. Python daemon running (PID 4092). Memory footprint: 42MB. Voice recognition thread listening.'
    },
    skills: {
      query: 'List Sathiyaraj\'s Stack',
      response: 'Active capabilities: Python 3, Local LLM Tooling, Relational SQL schemas, Context Engineering, and Responsive UI synthesis.'
    },
    why: {
      query: 'Why Did You Build This?',
      response: 'Sathiyaraj wanted a direct voice-controlled automation bridge for his desktop rather than relying on generic browser chatbots.'
    }
  };

  assistantSimButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmdKey = btn.getAttribute('data-cmd');
      const sim = cannedSimulations[cmdKey];
      if (!sim || !consoleFeed) return;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      // Append User Query
      const userEntry = document.createElement('div');
      userEntry.innerHTML = `<span style="color: var(--accent-orange);">${timeStr}</span> [VOICE INPUT] "${sim.query}"`;
      consoleFeed.appendChild(userEntry);

      // Temporary Thinking State
      const thinkingEntry = document.createElement('div');
      thinkingEntry.innerHTML = `<span style="color: #71717A;">${timeStr}</span> [AGENT] Processing query via local pipeline...`;
      consoleFeed.appendChild(thinkingEntry);
      consoleFeed.scrollTop = consoleFeed.scrollHeight;

      // Accelerated wave burst
      waveformBars.forEach((b) => (b.style.height = '42px'));

      setTimeout(() => {
        thinkingEntry.remove();
        const respEntry = document.createElement('div');
        respEntry.innerHTML = `<span style="color: #4ADE80;">${timeStr}</span> [AI RESPONSE] "${sim.response}"`;
        consoleFeed.appendChild(respEntry);
        consoleFeed.scrollTop = consoleFeed.scrollHeight;
      }, 550);
    });
  });
});
