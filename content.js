// Content script that runs on all pages
// This script checks if there are any CSS rules for the current page and applies them

(function() {
  'use strict';

  // Function to check if URL matches a pattern (supports regex)
  function urlMatches(pattern, url) {
    try {
      // If pattern looks like a regex (contains special regex characters)
      if (pattern.includes('*') || pattern.includes('^') || pattern.includes('$') || 
          (pattern.includes('.') && !pattern.startsWith('http'))) {
        const regex = new RegExp(pattern);
        return regex.test(url);
      }
      
      // Otherwise, do a simple string match
      return url.includes(pattern) || url === pattern;
    } catch (e) {
      console.error('CSS Overrider: Invalid pattern', pattern, e);
      return false;
    }
  }

  // Function to apply CSS rules
  function applyCSSRules() {
    const currentUrl = window.location.href;
    
    // Get rules from storage
    chrome.storage.local.get('cssRules', (result) => {
      const rules = result.cssRules || [];
      
      // Remove any previously injected styles
      const existingStyles = document.querySelectorAll('style[data-css-overrider]');
      existingStyles.forEach(style => style.remove());
      
      // Apply matching rules
      rules.forEach((rule, index) => {
        if (urlMatches(rule.url, currentUrl)) {
          const styleElement = document.createElement('style');
          styleElement.setAttribute('data-css-overrider', index);
          styleElement.textContent = rule.css;
          
          // Insert at the end of head or beginning of body
          if (document.head) {
            document.head.appendChild(styleElement);
          } else if (document.body) {
            document.body.insertBefore(styleElement, document.body.firstChild);
          } else {
            // If neither head nor body exists yet, wait for DOM
            document.addEventListener('DOMContentLoaded', () => {
              if (document.head) {
                document.head.appendChild(styleElement);
              } else if (document.body) {
                document.body.insertBefore(styleElement, document.body.firstChild);
              }
            });
          }
          
          console.log('CSS Overrider: Applied rule for', rule.url);
        }
      });
    });
  }

  // Apply CSS rules when the script loads
  applyCSSRules();

  // Listen for storage changes (when rules are updated)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.cssRules) {
      console.log('CSS Overrider: Rules updated, reapplying...');
      applyCSSRules();
    }
  });

  // Also reapply on dynamic navigation (for SPAs)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('CSS Overrider: URL changed, reapplying rules...');
      applyCSSRules();
    }
  }).observe(document, { subtree: true, childList: true });

})();
