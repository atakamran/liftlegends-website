# Lift Legends PWA Launcher

This implementation provides multiple ways to detect if your PWA is installed and launch it directly, or redirect to the web version if not installed.

## 🚀 Features

- **Smart Detection**: Detects PWA installation across different platforms (iOS, Android, Desktop)
- **Automatic Launch**: Launches installed PWA directly or redirects to web version
- **Multiple Implementation Options**: React components, standalone HTML, and vanilla JavaScript
- **Responsive Design**: Works on all device types
- **Persian/Farsi Support**: RTL layout and Persian text

## 📁 Files Created

### React Components (for use within your React app)

- `src/components/LaunchPWAButton.tsx` - Main launch button component
- `src/components/PWALaunchExample.tsx` - Example usage component
- `src/utils/pwaUtils.ts` - Updated with new launch functions

### Standalone Files (for use on any website)

- `public/pwa-launcher.html` - Complete HTML page with launcher
- `public/pwa-launcher.js` - JavaScript utility for any website
- `public/manifest.json` - Updated with protocol handlers

## 🔧 Usage Options

### Option 1: React Component (Within Your App)

```tsx
import LaunchPWAButton from "./components/LaunchPWAButton";

function MyComponent() {
  return (
    <div>
      {/* Basic usage */}
      <LaunchPWAButton />

      {/* Custom styling and URL */}
      <LaunchPWAButton
        className="my-custom-class"
        webUrl="https://pwa.liftlegends.ir/?utm_source=my_page"
      >
        باز کردن لیفت لجندز
      </LaunchPWAButton>
    </div>
  );
}
```

### Option 2: Standalone HTML Page

Use `public/pwa-launcher.html` as a complete landing page. You can:

1. Host it on your website
2. Customize the styling and content
3. Use it as a redirect page

### Option 3: JavaScript Utility (Any Website)

```html
<!-- Include the script -->
<script src="https://your-domain.com/pwa-launcher.js"></script>

<!-- Auto-create button -->
<script
  src="pwa-launcher.js"
  data-auto-init
  data-container="#my-container"
></script>

<!-- Or create manually -->
<script>
  // Create a button in specific container
  LiftLegendsPWA.createLaunchButton({
    container: "#my-button-container",
    webUrl: "https://pwa.liftlegends.ir/?utm_source=my_site",
  });

  // Or launch programmatically
  LiftLegendsPWA.launch();
</script>
```

### Option 4: Custom Implementation

```javascript
// Use the utility functions directly
import { isPWAInstalled, launchPWAOrRedirect } from "./utils/pwaUtils";

async function handleLaunch() {
  const isInstalled = await isPWAInstalled();

  if (isInstalled) {
    // Launch PWA
    window.location.href = "/";
  } else {
    // Redirect to web
    window.open("https://pwa.liftlegends.ir/", "_blank");
  }
}
```

## 🎯 How It Works

### Detection Methods

The system uses multiple detection methods for maximum compatibility:

1. **Display Mode Check**: `window.matchMedia('(display-mode: standalone)')`
2. **iOS Standalone**: `window.navigator.standalone`
3. **Android TWA**: Checks document referrer
4. **Related Apps API**: Uses `navigator.getInstalledRelatedApps()` when available

### Launch Behavior

- **PWA Installed**: Launches the PWA directly using the root path (`/`)
- **PWA Not Installed**: Opens the web version in a new tab
- **Error Handling**: Falls back to web version if detection fails

## 🔗 URL Configuration

The default web URL is:

```
https://pwa.liftlegends.ir/?utm_source=download_page&utm_medium=web&utm_campaign=pwa_launch
```

You can customize this URL in any implementation:

```javascript
// React Component
<LaunchPWAButton webUrl="your-custom-url" />;

// JavaScript Utility
LiftLegendsPWA.launch({ webUrl: "your-custom-url" });
```

## 🎨 Customization

### Styling the React Component

```tsx
<LaunchPWAButton
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg"
  webUrl="your-url"
>
  Custom Button Text
</LaunchPWAButton>
```

### Styling the JavaScript Button

```css
.lift-legends-launch-btn {
  /* Your custom styles */
  background: your-gradient;
  border-radius: your-radius;
  /* etc. */
}
```

## 📱 Platform Support

- ✅ **iOS Safari**: Detects home screen installation
- ✅ **Android Chrome**: Detects PWA installation
- ✅ **Desktop Chrome/Edge**: Detects installed PWAs
- ✅ **Samsung Internet**: Basic support
- ✅ **Firefox**: Basic support (limited PWA features)

## 🔧 Advanced Configuration

### Custom Protocol (Optional)

The manifest includes a custom protocol handler:

```json
"protocol_handlers": [
  {
    "protocol": "web+liftlegends",
    "url": "/?protocol=%s"
  }
]
```

You can use this for more reliable launching:

```javascript
// Try custom protocol first
window.location.href = "web+liftlegends://launch";
```

### Shortcuts

The manifest includes app shortcuts for quick access:

```json
"shortcuts": [
  {
    "name": "باز کردن لیفت لجندز",
    "url": "/",
    "icons": [...]
  }
]
```

## 🐛 Troubleshooting

### PWA Not Detected

- Ensure the PWA is properly installed
- Check browser compatibility
- Verify manifest.json is accessible

### Launch Not Working

- Check console for errors
- Verify URLs are correct
- Test on different browsers/devices

### Styling Issues

- Check CSS conflicts
- Verify class names
- Test responsive design

## 📈 Analytics

Track usage with UTM parameters:

```
?utm_source=download_page&utm_medium=web&utm_campaign=pwa_launch
```

You can customize these for different sources:

- `utm_source`: Where the click came from
- `utm_medium`: Type of link (web, email, social)
- `utm_campaign`: Specific campaign name

## 🔄 Updates

To update the launcher:

1. Modify the utility functions in `pwaUtils.ts`
2. Update the standalone files as needed
3. Test across different platforms
4. Update this documentation

## 📞 Support

For issues or questions:

1. Check browser console for errors
2. Test on multiple devices/browsers
3. Verify PWA installation status
4. Check network connectivity
