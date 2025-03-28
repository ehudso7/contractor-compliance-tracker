// Helper functions for accessibility

// Focus trap for modals
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Set focus to first element
  firstElement.focus();
  
  // Create event listener
  const handleTabKey = (e) => {
    // Check for Tab key
    if (e.key !== 'Tab') return;
    
    // Handle shift + tab
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } 
    // Handle tab
    else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  // Add event listener
  element.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Announce messages to screen readers
export const announceToScreenReader = (message) => {
  // Create or get existing announcer
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only'); // Screen reader only class
    document.body.appendChild(announcer);
  }
  
  // Set message
  announcer.textContent = message;
  
  // Clear after a delay to prevent multiple announcements stacking
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
};

// Add skip link for keyboard navigation
export const addSkipLink = () => {
  const mainContent = document.getElementById('main-content');
  
  if (!mainContent) {
    console.warn('No main content element found for skip link');
    return;
  }
  
  // Create skip link if it doesn't exist
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.classList.add('skip-link');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
};
