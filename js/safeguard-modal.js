/**
 * SAFEGUARD SPECIFICATION & DEV LOG MODAL
 * 
 * - Deep-dive project specification view
 * - Accessible modal with trapped focus & keyboard dismiss (Escape)
 * - Complete BOM, verified architecture, engineering challenges & test logs
 */

export function initSafeguardModal() {
  const openBtn = document.getElementById('open-safeguard-modal');
  const openTeamBtn = document.getElementById('open-safeguard-team');
  const modalBackdrop = document.getElementById('safeguard-modal-backdrop');
  const closeBtn = document.getElementById('close-safeguard-modal');
  const projectTabs = Array.from(document.querySelectorAll('[data-project-tab]'));
  const projectPanels = projectTabs
    .map(tab => document.getElementById(tab.getAttribute('data-project-tab')))
    .filter(Boolean);

  if (!modalBackdrop || !closeBtn) return;

  let previousActiveElement = null;

  function activateProjectTab(tab, moveFocus = false) {
    if (!tab) return;
    const activePanelId = tab.getAttribute('data-project-tab');

    projectTabs.forEach((projectTab) => {
      const isActive = projectTab === tab;
      projectTab.classList.toggle('is-active', isActive);
      projectTab.setAttribute('aria-selected', String(isActive));
      projectTab.tabIndex = isActive ? 0 : -1;
    });

    projectPanels.forEach(panel => {
      panel.hidden = panel.id !== activePanelId;
    });

    if (moveFocus) tab.focus();
  }

  function openModal(initialTabId) {
    previousActiveElement = document.activeElement;
    if (initialTabId) {
      activateProjectTab(projectTabs.find(tab => tab.id === initialTabId));
    }
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    // Trap focus inside modal
    if (e.key === 'Tab') {
      const focusableEls = modalBackdrop.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => openModal());
  }
  if (openTeamBtn) {
    openTeamBtn.addEventListener('click', () => openModal('safeguard-team-tab'));
  }
  closeBtn.addEventListener('click', closeModal);

  // Click on backdrop outside modal container closes it
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // Diagram tab switcher inside the feature card
  const tabBtns = document.querySelectorAll('.diagram-tab-btn');
  const diagramImg = document.getElementById('safeguard-diagram-img');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetSrc = btn.getAttribute('data-src');
      if (diagramImg && targetSrc) {
        diagramImg.src = targetSrc;
      }
    });
  });

  projectTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateProjectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % projectTabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = projectTabs.length - 1;
      else return;

      event.preventDefault();
      activateProjectTab(projectTabs[nextIndex], true);
    });
  });
}
