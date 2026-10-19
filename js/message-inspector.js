/**
 * MESSAGE INSPECTOR — INTERACTION & EVALUATION ENGINE
 * 
 * - Transparent JS rules evaluation (NO AI claims)
 * - Live analysis as user types
 * - Sample message insertion
 * - Clean neutral state & plain explanations
 */

import { inspectorRules, sampleInspectorMessages } from './rules.config.js';

export function initMessageInspector() {
  const textarea = document.getElementById('inspector-input');
  const samplesContainer = document.getElementById('inspector-samples');
  const resultsContainer = document.getElementById('inspector-results-list');
  const statusBadge = document.getElementById('inspector-status-badge');
  const charCounter = document.getElementById('inspector-char-count');
  const clearBtn = document.getElementById('inspector-clear-btn');

  if (!textarea || !resultsContainer || !statusBadge) return;

  // Render Sample Quick-Fill Chips
  if (samplesContainer) {
    samplesContainer.innerHTML = '';
    const label = document.createElement('span');
    label.className = 'samples-label';
    label.textContent = 'LOAD SAMPLE:';
    samplesContainer.appendChild(label);

    sampleInspectorMessages.forEach((sample, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sample-chip';
      chip.textContent = sample.label;
      chip.setAttribute('aria-label', `Load sample message: ${sample.label}`);
      chip.addEventListener('click', () => {
        textarea.value = sample.text;
        runInspection(sample.text);
        textarea.focus();
      });
      samplesContainer.appendChild(chip);
    });
  }

  // Clear Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textarea.value = '';
      runInspection('');
      textarea.focus();
    });
  }

  // Live Real-Time Evaluation
  textarea.addEventListener('input', (e) => {
    runInspection(e.target.value);
  });

  function runInspection(text) {
    const trimmed = text.trim();
    if (charCounter) {
      charCounter.textContent = `${text.length} CHARACTERS`;
    }

    if (!trimmed) {
      renderEmptyState();
      return;
    }

    // Evaluate against each deterministic heuristic rule
    const triggered = [];
    inspectorRules.forEach((rule) => {
      const matchResult = rule.match(text);
      if (matchResult) {
        triggered.push({
          rule,
          matchedText: matchResult.matchedText || 'Matched pattern',
          detail: matchResult.detail || null
        });
      }
    });

    if (triggered.length === 0) {
      renderCleanState();
    } else {
      renderTriggeredState(triggered);
    }
  }

  function renderEmptyState() {
    statusBadge.className = 'results-count-badge';
    statusBadge.textContent = 'READY FOR INPUT';

    resultsContainer.innerHTML = `
      <div class="inspector-clean-state">
        <div class="clean-icon" style="background-color: var(--color-paper-dim); color: var(--color-ink-muted);">⌨</div>
        <div class="clean-title">NO TEXT ENTERED</div>
        <p class="clean-desc">Paste an email, SMS, or direct message into the input field or click a sample message above to inspect heuristic indicators.</p>
      </div>
    `;
  }

  function renderCleanState() {
    statusBadge.className = 'results-count-badge is-clean';
    statusBadge.textContent = '0 HEURISTICS TRIGGERED';

    resultsContainer.innerHTML = `
      <div class="inspector-clean-state">
        <div class="clean-icon">✓</div>
        <div class="clean-title">NO HEURISTIC INDICATORS DETECTED</div>
        <p class="clean-desc">None of the transparent keyword or URL pattern rules matched this message.</p>
        <p class="clean-desc" style="margin-top: 8px; font-style: italic; color: var(--color-orange);">
          <strong>Critical Note:</strong> Clean inspection does NOT guarantee that the message is safe. Attackers frequently adapt wording to evade static keyword heuristics.
        </p>
      </div>
    `;
  }

  function renderTriggeredState(triggeredList) {
    const count = triggeredList.length;
    statusBadge.className = 'results-count-badge has-triggers';
    statusBadge.textContent = `${count} ${count === 1 ? 'INDICATOR' : 'INDICATORS'} TRIGGERED`;

    const html = triggeredList.map(({ rule, matchedText, detail }) => {
      let badgeClass = 'high';
      if (rule.severity === 'MEDIUM') badgeClass = 'medium';
      if (rule.severity === 'CAUTION') badgeClass = 'caution';

      return `
        <div class="rule-result-item severity-${badgeClass}">
          <div class="rule-item-top">
            <span class="rule-item-title">${escapeHtml(rule.name)}</span>
            <span class="rule-item-badge ${badgeClass}">${rule.severity}</span>
          </div>
          <div class="rule-matched-excerpt">
            MATCHED: "<strong>${escapeHtml(matchedText)}</strong>"
            ${detail ? ` — <em>${escapeHtml(detail)}</em>` : ''}
          </div>
          <p class="rule-item-explanation">${escapeHtml(rule.explanation)}</p>
        </div>
      `;
    }).join('');

    resultsContainer.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run initial state
  if (textarea.value) {
    runInspection(textarea.value);
  } else {
    // Load sample 1 initially so user sees the working demo immediately
    textarea.value = sampleInspectorMessages[0].text;
    runInspection(textarea.value);
  }
}
