# CSS Overrider - Chrome Extension

A powerful Chrome extension that allows you to override CSS properties on any website with custom styles. Perfect for web developers, designers, and anyone who wants to customize their browsing experience.

## Features

- 🎨 **Custom CSS Injection**: Apply custom CSS to any website
- 🔍 **Regex Support**: Use regex patterns to match multiple URLs
- 💾 **Local Storage**: All rules are saved locally in your browser
- 📝 **Multiple Rules**: Create and manage multiple CSS override rules
- ✏️ **Easy Management**: Edit or delete existing rules with a simple interface
- 🔄 **Auto-Apply**: CSS rules are automatically applied when you visit matching sites

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download or Clone** this repository to your local machine

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by toggling the switch in the top-right corner

4. **Click "Load unpacked"** and select the extension directory

5. The extension icon should now appear in your Chrome toolbar

### Method 2: Pack and Install (Production)

1. Follow steps 1-3 from Method 1
2. In `chrome://extensions/`, click **"Pack extension"**
3. Select the extension directory
4. Chrome will create a `.crx` file
5. Drag and drop the `.crx` file into Chrome to install

### Method 3: Install from Chrome Web Store

Coming soon! The extension will be available on the Chrome Web Store.
For publishing instructions, see [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md)

## Usage

### Creating a CSS Override Rule

1. **Click the extension icon** in your Chrome toolbar

2. **Enter the Site URL**:
   - Simple URL: `https://example.com`
   - Regex pattern: `.*example.*` (matches any URL containing "example")
   - Domain match: `example.com`

3. **Enter your CSS code** in the textarea:
   ```css
   body {
     background-color: #f0f0f0;
     color: #333;
   }
   
   .header {
     display: none;
   }
   ```

4. **Click "Apply"** to save the rule

5. The page will automatically reload and apply your CSS

### Managing Rules

- **View Saved Rules**: All your saved rules are displayed at the bottom of the popup
- **Edit a Rule**: Click the "Edit" button on any rule to load it into the form
- **Delete a Rule**: Click the "Delete" button to remove a rule
- **Clear Form**: Click the "Clear" button to reset the input fields

### URL Pattern Examples

| Pattern | Matches |
|---------|---------|
| `https://example.com` | Exact URL match |
| `example.com` | Any URL containing "example.com" |
| `.*example.*` | Any URL with "example" anywhere |
| `^https://.*\.example\.com` | All subdomains of example.com |
| `.*github.*/.*` | All GitHub pages |

## File Structure

```
css-overrider/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Content script (injected into pages)
├── background.js         # Background service worker
├── icon16.png            # 16x16 icon
├── icon48.png            # 48x48 icon
├── icon128.png           # 128x128 icon
├── create-icons.html     # Helper to generate icons
└── README.md             # This file
```

## How It Works

1. **Storage**: CSS rules are stored in Chrome's local storage
2. **Content Script**: Runs on all pages and checks for matching rules
3. **Injection**: Matching CSS is injected into the page's `<head>` element
4. **Dynamic Updates**: Rules are reapplied when storage changes or URL changes (for SPAs)

## Permissions

The extension requires the following permissions:

- `storage`: To save CSS rules locally
- `activeTab`: To access the current tab
- `scripting`: To inject CSS into pages
- `<all_urls>`: To work on any website

## Tips & Tricks

### Dark Mode for Any Site
```css
body {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

a {
  color: #4a9eff !important;
}
```

### Hide Ads
```css
.ad, .advertisement, [class*="ad-"] {
  display: none !important;
}
```

### Custom Font
```css
* {
  font-family: 'Arial', sans-serif !important;
}
```

### Increase Readability
```css
body {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 18px;
}
```

## Troubleshooting

### CSS Not Applying?

1. Check if the URL pattern matches the current page
2. Try using `!important` in your CSS rules
3. Check the browser console for errors
4. Reload the page after saving the rule

### Extension Not Working?

1. Make sure Developer Mode is enabled
2. Check if the extension is enabled in `chrome://extensions/`
3. Try reloading the extension
4. Check the browser console for errors

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

If you encounter any issues or have questions, please open an issue on the project repository.

---

**Enjoy customizing your web experience! 🎨**