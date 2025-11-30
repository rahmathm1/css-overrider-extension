// DOM elements
const siteUrlInput = document.getElementById('siteUrl');
const cssCodeTextarea = document.getElementById('cssCode');
const applyBtn = document.getElementById('applyBtn');
const clearBtn = document.getElementById('clearBtn');
const messageDiv = document.getElementById('message');
const rulesListDiv = document.getElementById('rulesList');

// Load saved rules on popup open
document.addEventListener('DOMContentLoaded', () => {
  loadRules();
});

// Apply button click handler
applyBtn.addEventListener('click', async () => {
  const siteUrl = siteUrlInput.value.trim();
  const cssCode = cssCodeTextarea.value.trim();

  if (!siteUrl) {
    showMessage('Please enter a site URL', 'error');
    return;
  }

  if (!cssCode) {
    showMessage('Please enter CSS code', 'error');
    return;
  }

  // Validate regex if it looks like a regex pattern
  if (siteUrl.includes('*') || siteUrl.includes('.') || siteUrl.includes('^') || siteUrl.includes('$')) {
    try {
      new RegExp(siteUrl);
    } catch (e) {
      showMessage('Invalid regex pattern', 'error');
      return;
    }
  }

  // Save to local storage
  try {
    const rules = await getRules();
    
    // Check if rule already exists for this URL
    const existingIndex = rules.findIndex(rule => rule.url === siteUrl);
    
    if (existingIndex !== -1) {
      // Update existing rule
      rules[existingIndex] = { url: siteUrl, css: cssCode };
    } else {
      // Add new rule
      rules.push({ url: siteUrl, css: cssCode });
    }

    await chrome.storage.local.set({ cssRules: rules });
    
    showMessage('CSS rule saved successfully!', 'success');
    
    // Reload the current tab to apply changes
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.reload(tab.id);
    }
    
    // Reload rules list
    loadRules();
    
    // Clear form
    siteUrlInput.value = '';
    cssCodeTextarea.value = '';
    
  } catch (error) {
    showMessage('Error saving rule: ' + error.message, 'error');
  }
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
  siteUrlInput.value = '';
  cssCodeTextarea.value = '';
  hideMessage();
});

// Load and display saved rules
async function loadRules() {
  const rules = await getRules();
  
  if (rules.length === 0) {
    rulesListDiv.innerHTML = '<div class="no-rules">No saved rules yet</div>';
    return;
  }

  rulesListDiv.innerHTML = rules.map((rule, index) => `
    <div class="rule-item">
      <div class="rule-url">${escapeHtml(rule.url)}</div>
      <div class="rule-css">${escapeHtml(rule.css)}</div>
      <div class="rule-actions">
        <button class="rule-btn edit" data-index="${index}">Edit</button>
        <button class="rule-btn delete" data-index="${index}">Delete</button>
      </div>
    </div>
  `).join('');

  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.rule-btn.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      editRule(rules[index]);
    });
  });

  document.querySelectorAll('.rule-btn.delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await deleteRule(index);
    });
  });
}

// Get rules from storage
async function getRules() {
  const result = await chrome.storage.local.get('cssRules');
  return result.cssRules || [];
}

// Edit a rule
function editRule(rule) {
  siteUrlInput.value = rule.url;
  cssCodeTextarea.value = rule.css;
  siteUrlInput.focus();
  showMessage('Edit the rule and click Apply to save', 'success');
}

// Delete a rule
async function deleteRule(index) {
  if (!confirm('Are you sure you want to delete this rule?')) {
    return;
  }

  try {
    const rules = await getRules();
    rules.splice(index, 1);
    await chrome.storage.local.set({ cssRules: rules });
    
    showMessage('Rule deleted successfully', 'success');
    loadRules();
    
    // Reload the current tab to remove applied CSS
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.reload(tab.id);
    }
  } catch (error) {
    showMessage('Error deleting rule: ' + error.message, 'error');
  }
}

// Show message
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(hideMessage, 3000);
  }
}

// Hide message
function hideMessage() {
  messageDiv.style.display = 'none';
  messageDiv.className = 'message';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}