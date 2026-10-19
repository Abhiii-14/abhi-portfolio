/**
 * EXPERIMENT INDEX CONTROLLER (002, 003, 004)
 * 
 * - Desktop: side contextual preview pane
 * - Mobile: expandable inline accordion drawer
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - Honest labeling (Concept / In Progress / Interactive)
 */

export const experimentsData = [
  {
    id: "experiment-002",
    number: "002",
    title: "AI Phishing Detection & Vector Embeddings",
    category: "AI // HEURISTICS",
    status: "CONCEPT / PLANNED RESEARCH",
    statusClass: "concept",
    date: "2026 ROADMAP",
    summary: "Investigating why keyword heuristics fail against spear phishing and researching lightweight sentence-embedding models for local edge classification without cloud latency.",
    detailsHtml: `
      <p>While the Message Inspector demonstrated how simple regex patterns can catch low-effort mass spam, real-world social engineering relies on high-trust conversational context, vendor impersonation, and evasive glyphs.</p>
      <p>This planned project explores using lightweight open-source sentence transformers (e.g. MiniLM-L6-v2) to generate semantic embeddings of inbound messages. The goal is to compare semantic similarity against known deceptive intent vectors rather than brittle keyword matching.</p>
    `,
    tech: ["Python", "PyTorch", "HuggingFace Transformers", "Sentence-BERT", "FastAPI"],
    challenges: [
      "Running semantic inference within strict latency constraints (<100ms per message)",
      "Minimizing false positives on legitimate urgent communications (e.g. incident reports)",
      "Zero cloud exfiltration: keeping message telemetry strictly on-premises"
    ]
  },
  {
    id: "experiment-003",
    number: "003",
    title: "Web Security Analysis & Vulnerability Lab",
    category: "SECURITY // AUDIT",
    status: "LEARNING / IN PROGRESS",
    statusClass: "learning",
    date: "ACTIVE STUDY",
    summary: "Hands-on vulnerability reproduction lab examining OWASP Top 10 flaws, secure HTTP header configurations, and defense-in-depth sanitization on local testbeds.",
    detailsHtml: `
      <p>To write secure software, I am systematically analyzing how common web vulnerabilities occur at the protocol and application layer. Rather than treating security as an afterthought, I build isolated test cases for cross-site scripting (XSS), cross-site request forgery (CSRF), and SQL injection.</p>
      <p>Each experiment includes a reproducible proof-of-concept in an isolated sandbox, followed by implementing and testing the corresponding defense: Content Security Policy (CSP), SameSite cookies, prepared statements, and strict input validation.</p>
    `,
    tech: ["OWASP ZAP", "Burp Suite Community", "Node.js / Express", "SQLite", "HTTP Security Headers"],
    challenges: [
      "Understanding subtle differences between reflected, stored, and DOM-based XSS",
      "Configuring strict Content Security Policies without breaking legitimate inline assets",
      "Analyzing JWT implementation pitfalls (algorithm confusion, token leakage)"
    ]
  },
  {
    id: "experiment-004",
    number: "004",
    title: "Interface Experiments: Digital Field Journal",
    category: "UI // ACCESSIBILITY",
    status: "INTERACTIVE // COMPLETE",
    statusClass: "active-tag",
    date: "OCT 2026",
    summary: "An independent exploration of digital publication layouts, fluid clamp() typography, zero-dependency canvas filters, and strict WCAG AA keyboard accessibility.",
    detailsHtml: `
      <p>This portfolio itself serves as an ongoing engineering experiment. I rejected typical AI-generated template clichés (neon glowing cards, floating 3D spheres, fake skill percentage bars) in favor of high-contrast editorial typography, fine 1px ruling, and authentic technical schematics.</p>
      <p>Key technical accomplishments include zero external JS runtime dependencies, fluid type scaling with clamp(), custom duotone/halftone pixel math on HTML5 canvas, and 100% keyboard accessibility.</p>
    `,
    tech: ["Vanilla JavaScript (ES Modules)", "Semantic HTML5", "CSS Custom Properties", "HTML5 Canvas API", "ARIA 1.2"],
    challenges: [
      "Designing responsive editorial asymmetry that degrades gracefully on 360px viewports",
      "Performing per-pixel canvas luminance duotone mapping without tanking frame rates",
      "Eliminating all external framework dependencies while retaining modern modularity"
    ]
  }
];

export function initExperiments() {
  const listContainer = document.getElementById('experiments-list');
  const previewContainer = document.getElementById('experiments-preview');

  if (!listContainer || !previewContainer) return;

  let activeIndex = 0;

  function renderList() {
    listContainer.innerHTML = '';
    experimentsData.forEach((exp, idx) => {
      const isActive = idx === activeIndex;
      const itemEl = document.createElement('div');
      itemEl.className = `experiment-item ${isActive ? 'active' : ''}`;
      itemEl.id = `exp-item-${exp.number}`;

      itemEl.innerHTML = `
        <button type="button" class="experiment-btn" aria-expanded="${isActive}" aria-controls="exp-panel-${exp.number}">
          <div class="exp-header-left">
            <span class="exp-num">${exp.number}</span>
            <span class="exp-title">${exp.title}</span>
          </div>
          <div class="exp-meta-right">
            <span class="exp-status-tag ${exp.statusClass}">${exp.status}</span>
          </div>
        </button>
        <!-- Mobile Expandable Content -->
        <div class="exp-mobile-content" id="exp-panel-${exp.number}" role="region">
          <div class="preview-pane-meta" style="margin-top: 12px;">
            <span class="spec-label">${exp.category}</span>
            <span class="spec-label">${exp.date}</span>
          </div>
          <div class="preview-pane-body">${exp.detailsHtml}</div>
          <div class="preview-tech-stack">
            ${exp.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;

      const btn = itemEl.querySelector('.experiment-btn');
      btn.addEventListener('click', () => {
        setActiveIndex(idx);
      });

      // Keyboard navigation support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (idx + 1) % experimentsData.length;
          setActiveIndex(next);
          focusButton(next);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (idx - 1 + experimentsData.length) % experimentsData.length;
          setActiveIndex(prev);
          focusButton(prev);
        }
      });

      listContainer.appendChild(itemEl);
    });
  }

  function renderPreview() {
    const exp = experimentsData[activeIndex];
    previewContainer.innerHTML = `
      <div>
        <div class="preview-pane-meta">
          <span class="spec-label">${exp.category}</span>
          <span class="spec-label" style="color: var(--color-orange);">${exp.status}</span>
        </div>
        <h3 class="preview-pane-title">${exp.title}</h3>
        <div class="preview-pane-body">${exp.detailsHtml}</div>
        
        <div style="margin-bottom: var(--space-md);">
          <div class="spec-label" style="margin-bottom: 8px;">CORE INVESTIGATION CHALLENGES:</div>
          <ul style="padding-left: 20px; margin: 0; font-size: 0.88rem; color: var(--color-ink-muted);">
            ${exp.challenges.map(c => `<li style="margin-bottom: 6px;">${c}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div>
        <div class="spec-label" style="margin-bottom: 8px;">TECHNOLOGIES / TOOLING:</div>
        <div class="preview-tech-stack" style="margin-bottom: 0;">
          ${exp.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function setActiveIndex(idx) {
    activeIndex = idx;
    renderList();
    renderPreview();
  }

  function focusButton(idx) {
    const buttons = listContainer.querySelectorAll('.experiment-btn');
    if (buttons[idx]) {
      buttons[idx].focus();
    }
  }

  // Initial render
  setActiveIndex(0);
}
