// Background service worker for the CSS Overrider extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CSS Overrider extension installed');
  
  // Initialize storage if needed
  chrome.storage.local.get('cssRules', (result) => {
    if (!result.cssRules) {
      chrome.storage.local.set({ cssRules: [] });
    }
  });
  
  // Add context menu for quick access (only if contextMenus API is available)
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'cssOverrider',
      title: 'Override CSS for this site',
      contexts: ['page']
    });
  }
});

// Listen for tab updates to reapply CSS rules
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only inject when the page has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    // The content script will automatically apply rules
    // This listener is here for future enhancements if needed
    console.log('CSS Overrider: Tab updated', tab.url);
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRules') {
    chrome.storage.local.get('cssRules', (result) => {
      sendResponse({ rules: result.cssRules || [] });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'reloadTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});

// Context menu click handler (only if contextMenus API is available)
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cssOverrider') {
      // Open the popup (this will open the extension popup)
      chrome.action.openPopup();
    }
  });
}
