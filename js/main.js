/**
 * SATHIYARAJ — Developer & Systems Engineer Portfolio
 * Interactive Systems Engine
 * Standardized with Unslop Design Principles:
 * Intentional, accessible, zero-loop overhead.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. NAVIGATION SCROLL SPY & MOBILE CURTAIN
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileCurtain = document.getElementById('mobile-curtain');
  const mobileClose = document.getElementById('mobile-close-btn');
  const curtainLinks = document.querySelectorAll('.mobile-curtain-link');

  // IntersectionObserver for active section link tracking
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

  // Mobile menu curtain toggle
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
  // 2. INTERACTIVE SKILL WALL & DETAIL INSPECTOR
  // ==========================================================================
  const skillData = {
    ai: {
      tag: 'Specialization · Core',
      title: 'Artificial Intelligence',
      desc: 'Utilizing language model APIs, structured function calling, asynchronous agent loops, and prompt chains to construct practical desktop augmentations and workflow utilities.',
      tags: ['LLM APIs', 'Prompt Chaining', 'Function Calling', 'Speech Recognition', 'Autonomous Agents']
    },
    python: {
      tag: 'Specialization · Automation',
      title: 'Python Automation',
      desc: 'Developing scripting engines, automated filesystem listeners, data ETL pipelines, background services, and OS-level task orchestrators.',
      tags: ['Python 3.12', 'System Daemons', 'Watchdog', 'Task Schedulers', 'Batch Processing']
    },
    web: {
      tag: 'Specialization · Architecture',
      title: 'Web Architecture',
      desc: 'Engineering ultra-fast web interfaces using semantic HTML5, modern CSS layout algorithms, zero-dependency vanilla JavaScript, and fluid responsive design.',
      tags: ['Semantic HTML5', 'Modern CSS Grid', 'Vanilla ES6+', 'Core Web Vitals', 'Accessibility']
    },
    sql: {
      tag: 'Specialization · Data',
      title: 'SQL & Relational Data',
      desc: 'Designing 3NF normalized schemas, multi-table relationships, index optimizations, ACID transactions, and robust queries across academic datasets.',
      tags: ['PostgreSQL', '3NF Normalization', 'Complex Joins', 'B-Tree Indexing', 'ACID Transactions']
    },
    context: {
      tag: 'Specialization · AI Systems',
      title: 'Context Engineering',
      desc: 'Structuring system prompts, context management windows, retrieval hierarchies, and deterministic steering for AI models and autonomous agent workflows.',
      tags: ['System Prompts', 'Context Windows', 'Deterministic Output', 'Few-Shot Patterns', 'Tool Contracts']
    },
    git: {
      tag: 'Specialization · Workflow',
      title: 'Version Control & Git',
      desc: 'Professional branch workflows, atomic commit hygiene, merge conflict resolution, code reviews, and reproducible software version management.',
      tags: ['Git CLI', 'Branch Strategies', 'GitHub Workflows', 'Atomic Commits', 'Code Reviews']
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
    }, 100);
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
  // 3. ASSISTANT CONSOLE SIMULATOR
  // ==========================================================================
  const waveformBars = document.querySelectorAll('#console-waveform span');
  const consoleFeed = document.getElementById('console-logs-feed');
  const assistantSimButtons = document.querySelectorAll('.assistant-sim-btn');

  const cannedSimulations = {
    status: {
      query: 'Check system status and active projects',
      response: 'Core status: optimal. Daemon running (PID 4092). Memory: 42MB. Audio buffer listening at 16kHz.'
    },
    skills: {
      query: 'List Sathiyaraj\'s core stack',
      response: 'Active capabilities: Python 3.12, PostgreSQL relational schemas, context engineering, and vanilla web systems.'
    },
    why: {
      query: 'What was the rationale for building this?',
      response: 'To transition AI from chat web wrappers into an offline-first execution bridge that controls local operating system tasks.'
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
      userEntry.innerHTML = `<span class="log-accent">${timeStr}</span> [input] "${sim.query}"`;
      consoleFeed.appendChild(userEntry);

      // Temporary Processing Entry
      const thinkingEntry = document.createElement('div');
      thinkingEntry.innerHTML = `<span class="log-time">${timeStr}</span> [agent] Routing intent through local pipeline...`;
      consoleFeed.appendChild(thinkingEntry);
      consoleFeed.scrollTop = consoleFeed.scrollHeight;

      // Pulse audio waveform during active query
      waveformBars.forEach((bar, idx) => {
        bar.style.height = `${12 + (idx % 4) * 6}px`;
        bar.classList.add('active');
      });

      setTimeout(() => {
        thinkingEntry.remove();
        const respEntry = document.createElement('div');
        respEntry.innerHTML = `<span class="log-success">${timeStr}</span> [response] "${sim.response}"`;
        consoleFeed.appendChild(respEntry);
        consoleFeed.scrollTop = consoleFeed.scrollHeight;

        // Reset audio waveform to calm state
        waveformBars.forEach((bar, idx) => {
          bar.style.height = (idx % 2 === 0) ? '14px' : '6px';
          if (idx % 2 !== 0) bar.classList.remove('active');
        });
      }, 420);
    });
  });

  // ==========================================================================
  // 4. TECHNICAL PROJECT INSPECTION MODAL SYSTEM
  // ==========================================================================
  const projectModalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjectId = document.getElementById('modal-project-id');
  const modalContentContainer = document.getElementById('modal-content');
  const projectActionButtons = document.querySelectorAll('.project-action-link-btn[data-project]');

  const projectModalData = {
    assistant: {
      id: 'Project 01',
      title: 'Autonomous Personal AI Assistant',
      desc: 'An offline-first voice-driven execution bridge running locally on Python 3. Combines speech recognition, local reasoning hooks, OS task dispatching, and asynchronous background worker daemons.',
      metrics: [
        { label: 'Runtime', value: 'Python 3.12 Core' },
        { label: 'Speech latency', value: '< 240ms' },
        { label: 'Memory footprint', value: '42 MB RAM' },
        { label: 'Architecture', value: 'Async Subprocess' }
      ],
      code: `class VoiceAgentDaemon:
    def __init__(self, sample_rate=16000):
        self.mic = AudioStream(rate=sample_rate, channels=1)
        self.engine = LLMDispatcher(mode="low-latency")
        self.os_bridge = OSTaskHook()

    async def event_loop(self):
        while True:
            audio_frame = await self.mic.capture_burst()
            if self.mic.detect_speech(audio_frame):
                query = await self.engine.transcribe(audio_frame)
                action = self.engine.route_intent(query)
                res = await self.os_bridge.execute(action)
                await self.mic.speak(res.feedback)`,
      takeaways: [
        'Direct local microphone streaming into low-latency voice-activity detection (VAD).',
        'Intent parsing decoupled from execution to ensure zero unintended OS operations.',
        'Deterministic shell and automation tool calls guarded by schema validation.'
      ]
    },
    automation: {
      id: 'Project 02',
      title: 'Python Workflow & Task Daemons',
      desc: 'Robust automation infrastructure developed to eliminate manual digital toil. Implements filesystem event listeners, multi-threaded batch processors, and automated health checks.',
      metrics: [
        { label: 'Daemon engine', value: 'Multi-threaded' },
        { label: 'Sync latency', value: 'Real-time (0s)' },
        { label: 'Error rate', value: '0.00% Managed' },
        { label: 'OS interface', value: 'Native Win32/POSIX' }
      ],
      code: `import os, time, schedule
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class PipelineWatcher(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(('.csv', '.json')):
            records = parse_and_validate(event.src_path)
            export_payload = transform_3nf_records(records)
            push_to_data_warehouse(export_payload)
            archive_source(event.src_path)`,
      takeaways: [
        'Watchdog-driven filesystem observers that trigger instant ingestion upon file drops.',
        'Fault-tolerant retry schedules and automatic backup snapshots with sha256 checksum verification.',
        'Lightweight background daemons operating with near-zero idle CPU usage.'
      ]
    },
    web: {
      id: 'Project 03',
      title: 'High-Performance Web Architecture',
      desc: 'A high-performance interface architecture prioritizing raw HTML5 semantics, zero-dependency vanilla JavaScript, fluid CSS math, and 100/100 Core Web Vitals.',
      metrics: [
        { label: 'Performance', value: '100 / 100 Vitals' },
        { label: 'Frame rate', value: '60 FPS Fixed' },
        { label: 'Dependencies', value: '0 Runtime Bloat' },
        { label: 'Accessibility', value: 'WCAG 2.1 AAA' }
      ],
      code: `// Lightweight DOM State Observer
const observeIntersection = (elements, callback, options = {}) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) callback(entry.target);
    });
  }, options);
  elements.forEach((el) => observer.observe(el));
  return observer;
};`,
      takeaways: [
        'Strict semantic HTML structuring ensuring universal screen-reader accessibility.',
        'Hardware-accelerated CSS transforms isolating rendering to the GPU compositor layer.',
        'Progressive enhancement with comprehensive media queries supporting all form factors.'
      ]
    },
    database: {
      id: 'Project 04',
      title: 'SQL Database Systems & Schemas',
      desc: 'Third Normal Form (3NF) relational architectures designed for high concurrency, zero data redundancy, composite index performance, and strict transactional ACID guarantees.',
      metrics: [
        { label: 'Normalization', value: '3NF Compliant' },
        { label: 'Query speed', value: '< 2.4ms Indexed' },
        { label: 'Concurrency', value: 'ACID Isolated' },
        { label: 'Dialects', value: 'PostgreSQL / MySQL' }
      ],
      code: `CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    roll_number VARCHAR(32) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    department VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic_records (
    record_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    semester INT CHECK (semester BETWEEN 1 AND 8),
    subject_code VARCHAR(16) NOT NULL,
    grade_points NUMERIC(3,2) NOT NULL,
    CONSTRAINT unique_student_subject UNIQUE (student_id, subject_code, semester)
);

CREATE INDEX idx_academic_lookup ON academic_records (student_id, semester);`,
      takeaways: [
        'Enforced referential integrity via cascade delete rules and check constraints.',
        'Composite B-Tree indexes tailored directly to analytical query patterns.',
        'Sub-millisecond query execution plans verified via EXPLAIN ANALYZE.'
      ]
    }
  };

  function openProjectModal(key) {
    const data = projectModalData[key];
    if (!data || !projectModalBackdrop || !modalContentContainer) return;

    if (modalProjectId) modalProjectId.textContent = data.id;

    let metricsHtml = '';
    data.metrics.forEach((m) => {
      metricsHtml += `
        <div class="modal-metric-box">
          <div class="modal-metric-lbl">${m.label}</div>
          <div class="modal-metric-val">${m.value}</div>
        </div>
      `;
    });

    let takeawaysHtml = '';
    data.takeaways.forEach((t) => {
      takeawaysHtml += `<li>${t}</li>`;
    });

    modalContentContainer.innerHTML = `
      <h3 class="modal-title-heading">${data.title}</h3>
      <p class="modal-desc-lead">${data.desc}</p>
      
      <div class="modal-section-title">ENGINEERING BENCHMARKS</div>
      <div class="modal-grid-metrics">${metricsHtml}</div>

      <div class="modal-section-title">ARCHITECTURE SPECIFICATION // SOURCE</div>
      <pre class="modal-code-block"><code>${escapeHtml(data.code)}</code></pre>

      <div class="modal-section-title">KEY SYSTEM TAKEAWAYS</div>
      <ul class="modal-takeaways-list">${takeawaysHtml}</ul>
    `;

    projectModalBackdrop.classList.add('active');
    projectModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModalBackdrop) return;
    projectModalBackdrop.classList.remove('active');
    projectModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  projectActionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      if (projKey) openProjectModal(projKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModalBackdrop && projectModalBackdrop.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // ==========================================================================
  // 5. BACK TO TOP SMOOTH SCROLL
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
