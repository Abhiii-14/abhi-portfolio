/**
 * APPLICATION ENTRY POINT
 * 
 * - Ingests site.config.js
 * - Dynamically renders honest data & hides unconfigured placeholders
 * - Initializes portrait filter, message inspector, experiment tabs, and spec modal
 * - Manages active navigation states and responsive mobile menu
 */

import { siteConfig, isPlaceholder } from '../site.config.js';
import { initPortraitFilter } from './portrait-filter.js';
import { initMessageInspector } from './message-inspector.js';
import { initExperiments } from './experiments.js';
import { initSafeguardModal } from './safeguard-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Apply Site Configuration
  applySiteConfig();

  // 2. Initialize Core Modules
  initPortraitFilter();
  initMessageInspector();
  initExperiments();
  initSafeguardModal();

  // 3. Navigation & Header Observers
  setupNavigation();
  setupScrollSpy();
  setupFieldNotes();
  setupMotionExperience();
});

function applySiteConfig() {
  // Wordmark
  const wordmarkEl = document.getElementById('site-wordmark-text');
  if (wordmarkEl && siteConfig.site.wordmark) {
    wordmarkEl.textContent = siteConfig.site.wordmark;
  }

  // Author identity
  const authorNameEl = document.getElementById('author-name-display');
  if (authorNameEl) {
    const isNamePlaceholder = isPlaceholder(siteConfig.author.name);
    authorNameEl.textContent = isNamePlaceholder ? siteConfig.author.displayFallback : siteConfig.author.name;
  }

  // Render Skills (3 honest columns, zero percentage bars)
  renderSkills();

  // Render Contact Links (Hide placeholders!)
  renderContactLinks();
}

function renderSkills() {
  const usingList = document.getElementById('skills-using-list');
  const learningList = document.getElementById('skills-learning-list');
  const exploreList = document.getElementById('skills-explore-list');

  if (usingList && siteConfig.skills.using) {
    usingList.innerHTML = siteConfig.skills.using.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  }
  if (learningList && siteConfig.skills.learning) {
    learningList.innerHTML = siteConfig.skills.learning.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  }
  if (exploreList && siteConfig.skills.nextToExplore) {
    exploreList.innerHTML = siteConfig.skills.nextToExplore.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  }
}

function renderContactLinks() {
  const container = document.getElementById('contact-links-container');
  if (!container) return;

  container.innerHTML = '';
  const { github, linkedin, email } = siteConfig.contact;

  let validLinkCount = 0;

  // GitHub Link
  if (!isPlaceholder(github)) {
    validLinkCount++;
    container.appendChild(createContactLink('GITHUB', github, 'SOURCE CODE & REPOSITORIES'));
  }

  // LinkedIn Link
  if (!isPlaceholder(linkedin)) {
    validLinkCount++;
    container.appendChild(createContactLink('LINKEDIN', linkedin, 'PROFESSIONAL NETWORK'));
  }

  // Email Link
  if (!isPlaceholder(email)) {
    validLinkCount++;
    container.appendChild(createContactLink('EMAIL', `mailto:${email}`, 'DIRECT CONTACT'));
  }

  // If all links are still placeholders, render an honest editorial note
  if (validLinkCount === 0) {
    const notice = document.createElement('div');
    notice.className = 'contact-placeholder-notice';
    notice.innerHTML = `
      <strong>[CONFIG NOTICE]</strong> Contact links are currently set to placeholders in <code>site.config.js</code>.
      Once you replace <code>[YOUR_GITHUB_HANDLE]</code>, <code>[YOUR_LINKEDIN_URL]</code>, or <code>[YOUR_EMAIL]</code> with real URLs, verified links will appear here automatically.
    `;
    container.appendChild(notice);
  }
}

function createContactLink(platform, url, desc) {
  const a = document.createElement('a');
  a.className = 'contact-link-row';
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.innerHTML = `
    <div>
      <div class="link-platform">${escapeHtml(platform)}</div>
      <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--color-ink-muted);">${escapeHtml(desc)}</div>
    </div>
    <span class="link-arrow">→</span>
  `;
  return a;
}

function setupNavigation() {
  const header = document.getElementById('site-header');
  const heroSection = document.getElementById('hero');
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile Menu Toggle
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open');
    });

    // Close mobile menu on clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });
  }

  // Header light/dark transition based on scroll position
  if (header && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If hero is NOT intersecting, we are past the inverted hero -> switch header to light
        if (!entry.isIntersecting) {
          header.classList.add('header-light');
        } else {
          header.classList.remove('header-light');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroSection);
  }
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (current === 'hero' && href === '#work')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function setupFieldNotes() {
  const noteLinks = document.querySelectorAll('.note-read-link');
  const noteModal = document.getElementById('note-modal-backdrop');
  const noteModalTitle = document.getElementById('note-modal-title');
  const noteModalCategory = document.getElementById('note-modal-category');
  const noteModalDate = document.getElementById('note-modal-date');
  const noteModalBody = document.getElementById('note-modal-body');
  const noteModalClose = document.getElementById('close-note-modal');

  if (!noteModal || !noteModalClose) return;

  noteLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const noteId = link.getAttribute('data-note-id');
      const note = siteConfig.fieldNotes.find(n => n.id === noteId);
      if (!note) return;

      if (noteModalTitle) noteModalTitle.textContent = note.title;
      if (noteModalCategory) noteModalCategory.textContent = `${note.category} // ${note.readTime}`;
      if (noteModalDate) noteModalDate.textContent = note.date;
      if (noteModalBody) noteModalBody.innerHTML = note.bodyHtml;

      noteModal.classList.add('is-open');
      noteModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      noteModalClose.focus();
    });
  });

  function closeNoteModal() {
    noteModal.classList.remove('is-open');
    noteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  noteModalClose.addEventListener('click', closeNoteModal);
  noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) closeNoteModal();
  });
}

function setupMotionExperience() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll([
    '.hero-meta-tag',
    '.hero-headline',
    '.hero-lead',
    '.hero-actions',
    '.hero-specs-grid',
    '.hero-portrait-column',
    '.index-strip-item',
    '.site-section .section-header-band',
    '.safeguard-lead-block',
    '.safeguard-grid',
    '.feature-status-item',
    '.diagram-tab-btn',
    '.experiment-item',
    '.safeguard-actions',
    '.experiment-layout',
    '.inspector-card',
    '.note-card',
    '.about-grid',
    '.skill-column',
    '.contact-grid'
  ].join(','));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    const staggerGroups = new Map();
    revealTargets.forEach((element) => {
      element.setAttribute('data-reveal', '');
      if (element.matches('.note-card, .skill-column, .index-strip-item, .feature-status-item, .diagram-tab-btn, .experiment-item')) {
        const group = element.parentElement;
        const groupIndex = staggerGroups.get(group) || 0;
        staggerGroups.set(group, groupIndex + 1);
        element.style.setProperty('--reveal-delay', `${Math.min(groupIndex, 5) * 75}ms`);
        if (element.matches('.index-strip-item, .experiment-item')) {
          element.style.setProperty('--reveal-x', groupIndex % 2 === 0 ? '-16px' : '16px');
        } else if (element.matches('.feature-status-item')) {
          element.style.setProperty('--reveal-x', '-10px');
        }
      }
      revealObserver.observe(element);
    });

    document.documentElement.classList.add('has-motion');
  }

  const hero = document.getElementById('hero');
  const portrait = document.querySelector('.portrait-artifact-wrapper');

  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = hero.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      hero.style.setProperty('--pointer-x', `${pointerX}%`);
      hero.style.setProperty('--pointer-y', `${pointerY}%`);

      if (portrait) {
        if (portrait.contains(event.target)) {
          const portraitBounds = portrait.getBoundingClientRect();
          const offsetX = (event.clientX - portraitBounds.left) / portraitBounds.width - 0.5;
          const offsetY = (event.clientY - portraitBounds.top) / portraitBounds.height - 0.5;
          portrait.style.setProperty('--tilt-x', `${offsetX * 5}deg`);
          portrait.style.setProperty('--tilt-y', `${offsetY * -5}deg`);
        } else {
          portrait.style.setProperty('--tilt-x', '0deg');
          portrait.style.setProperty('--tilt-y', '0deg');
        }
      }
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.removeProperty('--pointer-x');
      hero.style.removeProperty('--pointer-y');
      if (portrait) {
        portrait.style.setProperty('--tilt-x', '0deg');
        portrait.style.setProperty('--tilt-y', '0deg');
      }
    });
  }

  const glassSurfaces = document.querySelectorAll([
    '.note-card',
    '.skill-column',
    '.experiment-preview-pane',
    '.safeguard-problem-card',
    '.safeguard-diagram-card',
    '.safeguard-status-card',
    '.inspector-card',
    '.contact-card'
  ].join(','));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer && !reduceMotion) {
    glassSurfaces.forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const bounds = surface.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        surface.style.setProperty('--glass-x', `${x}%`);
        surface.style.setProperty('--glass-y', `${y}%`);
      });

      surface.addEventListener('pointerleave', () => {
        surface.style.removeProperty('--glass-x');
        surface.style.removeProperty('--glass-y');
      });
    });
  }

  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));
      progressFrame = 0;
    });
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
