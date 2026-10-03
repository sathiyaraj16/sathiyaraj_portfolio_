/**
 * Interactive Animations, Scroll Observers, Filtering, and Project Simulation Modals
 * Vicky — Portfolio
 */

(function () {
  'use strict';

  // 1. Scroll Progress Bar
  const progressBar = document.querySelector('.scroll-progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Header shadow on scroll
    const header = document.querySelector('.site-header');
    if (header) {
      if (winScroll > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 2. Scroll-Triggered Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, keep it visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Navigation Active Pill Indicator & Section Spy
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-item');
  const activePill = document.querySelector('.nav-pill-active');

  function updateNavPill(targetItem) {
    if (!activePill || !targetItem) return;
    const rect = targetItem.getBoundingClientRect();
    const parentRect = targetItem.parentElement.getBoundingClientRect();

    activePill.style.width = `${rect.width}px`;
    activePill.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    activePill.style.opacity = '1';
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updateNavPill(item);
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // Initialize nav pill position
  window.addEventListener('load', () => {
    const firstActive = document.querySelector('.nav-item.active');
    if (firstActive) updateNavPill(firstActive);
  });

  // 4. CGPA 8.6 Radial Ring Animation
  const cgpaRing = document.querySelector('.cgpa-circle-progress');
  const cgpaSection = document.querySelector('.education-section');

  if (cgpaRing && cgpaSection) {
    const totalCircumference = 377; // 2 * PI * 60 approx
    const targetCgpa = 8.6;
    const maxCgpa = 10.0;
    const targetOffset = totalCircumference - (totalCircumference * (targetCgpa / maxCgpa));

    const cgpaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cgpaRing.style.strokeDashoffset = targetOffset;
          animateCgpaCounter(targetCgpa);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    cgpaObserver.observe(cgpaSection);
  }

  function animateCgpaCounter(target) {
    const valElem = document.querySelector('.cgpa-value');
    if (!valElem) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = (easeProgress * target).toFixed(1);
      valElem.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        valElem.textContent = target.toFixed(1);
      }
    }
    requestAnimationFrame(updateCounter);
  }

  // 5. Project Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Interactive Project Modal Data & Handler
  const projectSimulations = {
    nexa: {
      title: 'NEXA — AI Voice Assistant',
      badge: 'Gemini 1.5 Pro · Voice Engine',
      description: 'A Gemini-powered personal AI assistant built for intelligent voice dialogue, real-time context memory, and fast productivity workflows.',
      content: `
        <div class="simulation-nexa-container">
          <div style="background: #FFF9F6; border: 1px solid var(--border-orange); border-radius: 16px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-orange); margin-bottom: 0.5rem;">
              ● REAL-TIME VOICE RECOGNITION ACTIVE
            </div>
            <div class="nexa-waveform" style="height: 50px;">
              <span class="wave-bar" style="height: 18px;"></span>
              <span class="wave-bar" style="height: 38px;"></span>
              <span class="wave-bar" style="height: 48px;"></span>
              <span class="wave-bar" style="height: 30px;"></span>
              <span class="wave-bar" style="height: 55px;"></span>
              <span class="wave-bar" style="height: 34px;"></span>
              <span class="wave-bar" style="height: 22px;"></span>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.75rem;">
              <em>"Listening for your command... Try typing or tapping sample queries below."</em>
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <button class="nexa-sample-chip vp-btn" onclick="simulateNexaQuery('Summarize today\\'s CS agenda')">"Summarize today's CS agenda"</button>
            <button class="nexa-sample-chip vp-btn" onclick="simulateNexaQuery('Explain Dijkstra\\'s Algorithm')">"Explain Dijkstra's Algorithm"</button>
            <button class="nexa-sample-chip vp-btn" onclick="simulateNexaQuery('What is your active LLM memory context?')">"What is your memory context?"</button>
          </div>

          <div id="nexa-sim-output" style="background: #F8FAFC; border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.25rem; font-size: 0.92rem; line-height: 1.6; min-height: 100px;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; color: var(--accent-orange); font-weight: 700;">
              <span>🤖 NEXA (Gemini 1.5 Pro):</span>
            </div>
            <p id="nexa-reply-text">Ready to assist Vicky. I maintain conversation state across session memory and execute voice-commanded automation.</p>
          </div>
        </div>
      `
    },
    tracker: {
      title: 'Student Performance Tracker',
      badge: 'Academic Analytics · React + Chart.js',
      description: 'Interactive analytics dashboard designed to visualize student GPA progression, test score distributions, and semester trends.',
      content: `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <h4 style="font-weight: 700; color: var(--text-primary);">Semester Performance Breakdown</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Roever Engineering College — Computer Science & Engineering</p>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; background: var(--accent-orange-light); color: var(--accent-orange); padding: 0.4rem 0.8rem; border-radius: 8px;">
              Current CGPA: 8.6 / 10.0
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; text-align: center;">
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sem 1 GPA</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">8.4</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sem 2 GPA</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">8.5</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sem 3 GPA</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-orange);">8.8</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sem 4 GPA</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">8.7</div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem;">Subject Mastery Index:</div>
            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size: 0.82rem; margin-bottom: 2px;">
                  <span>Data Structures & Algorithms</span>
                  <span style="font-weight:700; color:var(--accent-orange);">94%</span>
                </div>
                <div class="progress-track"><div class="progress-fill-orange" style="width: 94%;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size: 0.82rem; margin-bottom: 2px;">
                  <span>Object-Oriented Programming & Systems</span>
                  <span style="font-weight:700; color:var(--accent-orange);">91%</span>
                </div>
                <div class="progress-track"><div class="progress-fill-orange" style="width: 91%;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size: 0.82rem; margin-bottom: 2px;">
                  <span>Database Management Systems (DBMS)</span>
                  <span style="font-weight:700; color:var(--accent-orange);">88%</span>
                </div>
                <div class="progress-track"><div class="progress-fill-orange" style="width: 88%;"></div></div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    attendance: {
      title: 'Student Attendance System',
      badge: 'Full-Stack Management · Express + PostgreSQL',
      description: 'Digital tracking system designed to eliminate manual attendance registers with barcode/smart check-in and automated absentee alerts.',
      content: `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h4 style="font-weight: 700; color: var(--text-primary);">CSE Class Roster Attendance</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Batch 2023–2027 · Total Enrolled: 64 Students</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 1.25rem; font-weight: 800; color: #10B981;">94.2%</span>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">TODAY'S RATE</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-subtle); text-align: left; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">
                <th style="padding: 0.5rem;">ROLL NO</th>
                <th style="padding: 0.5rem;">STUDENT NAME</th>
                <th style="padding: 0.5rem;">TIME</th>
                <th style="padding: 0.5rem; text-align: right;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px dashed var(--border-subtle);">
                <td style="padding: 0.6rem 0.5rem; font-family: var(--font-mono);">CSE-2301</td>
                <td style="padding: 0.6rem 0.5rem; font-weight: 600;">Vicky (Lead Dev)</td>
                <td style="padding: 0.6rem 0.5rem; color: var(--text-muted);">08:45 AM</td>
                <td style="padding: 0.6rem 0.5rem; text-align: right;"><span style="background: #DCFCE7; color: #166534; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">Present</span></td>
              </tr>
              <tr style="border-bottom: 1px dashed var(--border-subtle);">
                <td style="padding: 0.6rem 0.5rem; font-family: var(--font-mono);">CSE-2302</td>
                <td style="padding: 0.6rem 0.5rem; font-weight: 600;">Arun Kumar</td>
                <td style="padding: 0.6rem 0.5rem; color: var(--text-muted);">08:52 AM</td>
                <td style="padding: 0.6rem 0.5rem; text-align: right;"><span style="background: #DCFCE7; color: #166534; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">Present</span></td>
              </tr>
              <tr style="border-bottom: 1px dashed var(--border-subtle);">
                <td style="padding: 0.6rem 0.5rem; font-family: var(--font-mono);">CSE-2303</td>
                <td style="padding: 0.6rem 0.5rem; font-weight: 600;">Priya Dharshini</td>
                <td style="padding: 0.6rem 0.5rem; color: var(--text-muted);">09:02 AM</td>
                <td style="padding: 0.6rem 0.5rem; text-align: right;"><span style="background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">Late (Excused)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    grocery: {
      title: 'Grocery Store Management System',
      badge: 'POS Terminal & Inventory Engine',
      description: 'High-speed retail billing system with automated SKU barcode lookup, inventory restock alerts, and daily sales receipts.',
      content: `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem; font-family: var(--font-mono);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">VICKY'S SMART GROCERY POS</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">TAX INVOICE #INV-2026-094</div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: var(--accent-orange); font-weight: 600;">
              STATUS: PAID
            </div>
          </div>

          <div style="font-size: 0.82rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>1x Organic Oats (1kg)</span>
              <span>$4.50</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>2x Fresh Almond Milk</span>
              <span>$6.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>1x Honey Crisps (500g)</span>
              <span>$3.25</span>
            </div>
          </div>

          <div style="border-top: 1px dashed var(--border-subtle); padding-top: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
              <span>Subtotal</span>
              <span>$13.75</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
              <span>Tax (GST 5%)</span>
              <span>$0.69</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--accent-orange); margin-top: 0.5rem;">
              <span>TOTAL</span>
              <span>$14.44</span>
            </div>
          </div>
        </div>
      `
    },
    portfolio: {
      title: 'Personal Portfolio (This Site)',
      badge: 'Editorial Architecture · Three.js + Glassmorphism',
      description: 'A bespoke developer portfolio crafted with an editorial orange-and-white theme, 3D interactive math meshes, custom cursor dynamics, and modular CSS architecture.',
      content: `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Design System & Architectural Specs</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
            Combines high-contrast Syne display typography with Plus Jakarta Sans body and JetBrains Mono for technical instrumentation.
          </p>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">PALETTE</div>
              <div style="font-weight: 700; color: var(--accent-orange); margin-top: 2px;">#FF5A1F</div>
            </div>
            <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">3D ENGINE</div>
              <div style="font-weight: 700; color: var(--text-primary); margin-top: 2px;">Three.js r128</div>
            </div>
            <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">PERFORMANCE</div>
              <div style="font-weight: 700; color: #10B981; margin-top: 2px;">60 FPS Fixed</div>
            </div>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.8rem; background: #0F172A; color: #F8FAFC; padding: 1rem; border-radius: 10px; overflow-x: auto;">
            <span style="color: #64748B;">// Vicky's Core Philosophy</span><br>
            <span style="color: #FF5A1F;">const</span> engineer = {<br>
            &nbsp;&nbsp;student: <span style="color: #38BDF8;">"B.E. Computer Science"</span>,<br>
            &nbsp;&nbsp;institution: <span style="color: #38BDF8;">"Roever Engineering College"</span>,<br>
            &nbsp;&nbsp;craft: <span style="color: #FBBF24;">["Full-Stack Web", "Applied AI", "System Solutions"]</span><br>
            };
          </div>
        </div>
      `
    }
  };

  const modalOverlay = document.querySelector('.modal-overlay');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalClose = document.querySelector('.modal-close-btn');

  window.openProjectModal = function (projKey) {
    const data = projectSimulations[projKey];
    if (!data || !modalOverlay) return;

    modalTitle.innerHTML = `${data.title} <span style="font-size:0.75rem; font-family:var(--font-mono); background:var(--accent-orange-light); color:var(--accent-orange); padding:2px 8px; border-radius:99px; margin-left:0.5rem;">${data.badge}</span>`;
    modalBody.innerHTML = `
      <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
        ${data.description}
      </p>
      ${data.content}
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Simulated query responder for NEXA demo
  window.simulateNexaQuery = function (queryText) {
    const outBox = document.getElementById('nexa-reply-text');
    if (!outBox) return;

    outBox.innerHTML = `<em>Processing query: "${queryText}" via Gemini 1.5 Pro...</em>`;
    setTimeout(() => {
      if (queryText.includes('Dijkstra')) {
        outBox.innerHTML = `<strong>Dijkstra's Algorithm:</strong> A greedy graph algorithm to find the shortest path from a single source node to all other vertices in a weighted graph with non-negative edge weights. Time complexity using a min-priority queue is <code>O((V + E) log V)</code>.`;
      } else if (queryText.includes('agenda')) {
        outBox.innerHTML = `<strong>Today's Agenda for Vicky:</strong> 1) Revise System Design principles; 2) Polish Full-Stack Student Attendance dashboard; 3) Deep-dive into Gemini streaming API integration.`;
      } else {
        outBox.innerHTML = `<strong>NEXA Memory Context:</strong> Active user: Vicky. Academic Profile: B.E. CSE @ Roever Engineering College (CGPA 8.6). 5 Project architectures mounted.`;
      }
    }, 450);
  };

  // 7. Contact Form Interactive Handler
  const contactForm = document.getElementById('portfolio-contact-form');
  const formToast = document.querySelector('.form-status-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sendBtn = contactForm.querySelector('.btn-send-message');
      const originalText = sendBtn.innerHTML;

      // Button loading state
      sendBtn.innerHTML = `
        <span style="display:inline-block; animation: spin 0.8s linear infinite;">⏳</span>
        Sending message...
      `;
      sendBtn.disabled = true;

      setTimeout(() => {
        sendBtn.innerHTML = `✓ Message Sent Successfully!`;
        sendBtn.style.background = '#10B981';

        if (formToast) {
          formToast.classList.add('success');
          formToast.innerHTML = `<strong>Thank you!</strong> Your message has been dispatched to Vicky. We'll connect shortly.`;
        }

        contactForm.reset();

        setTimeout(() => {
          sendBtn.innerHTML = originalText;
          sendBtn.style.background = '';
          sendBtn.disabled = false;
        }, 4000);
      }, 1000);
    });
  }

  // 8. One-Click Copy Contact Badge
  window.copyToClipboard = function (text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
      const original = btnElement.textContent;
      btnElement.textContent = 'Copied!';
      btnElement.style.background = 'var(--accent-orange)';
      btnElement.style.color = '#FFFFFF';

      setTimeout(() => {
        btnElement.textContent = original;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    });
  };
})();
