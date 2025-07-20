/**
 * Lift Legends PWA Launcher
 * A standalone JavaScript utility to detect and launch PWA or redirect to web version
 *
 * Usage:
 * 1. Include this script in your HTML: <script src="pwa-launcher.js"></script>
 * 2. Call LiftLegendsPWA.createLaunchButton() to create a button
 * 3. Or use LiftLegendsPWA.launch() programmatically
 */

(function (window) {
  "use strict";

  const LiftLegendsPWA = {
    // Configuration
    config: {
      webUrl:
        "https://app.liftlegends.ir/?utm_source=download_page&utm_medium=web&utm_campaign=pwa_launch",
      appName: "لیفت لجندز",
      customProtocol: "web+liftlegends://launch",
    },

    // Check if PWA is installed
    isPWAInstalled: function () {
      return new Promise((resolve) => {
        // Method 1: Check display mode
        const isStandalone = window.matchMedia(
          "(display-mode: standalone)"
        ).matches;

        // Method 2: Check for iOS standalone
        const isIOSStandalone = window.navigator.standalone === true;

        // Method 3: Check for Android TWA or installed PWA
        const isAndroidInstalled = document.referrer.includes("android-app://");

        if (isStandalone || isIOSStandalone || isAndroidInstalled) {
          resolve(true);
          return;
        }

        // Method 4: Try to use the newer getInstalledRelatedApps API if available
        if ("getInstalledRelatedApps" in navigator) {
          navigator
            .getInstalledRelatedApps()
            .then((relatedApps) => {
              resolve(relatedApps.length > 0);
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          resolve(false);
        }
      });
    },

    // Launch PWA or redirect to web
    launch: async function (options = {}) {
      const config = { ...this.config, ...options };

      try {
        const isInstalled = await this.isPWAInstalled();

        if (isInstalled) {
          // Try custom protocol first
          if (config.customProtocol) {
            try {
              window.location.href = config.customProtocol;
              return;
            } catch (e) {
              console.log("Custom protocol failed, using fallback");
            }
          }

          // Fallback to root path
          window.location.href = "/";
        } else {
          // Open web version
          window.open(config.webUrl, "_blank");
        }
      } catch (error) {
        console.error("Error launching PWA:", error);
        // Fallback to web version
        window.open(config.webUrl, "_blank");
      }
    },

    // Create a launch button
    createLaunchButton: function (options = {}) {
      const config = {
        container: document.body,
        className: "lift-legends-launch-btn",
        style: "default",
        ...options,
      };

      // Create button element
      const button = document.createElement("button");
      button.className = config.className;
      button.innerHTML = `
                <span class="ll-icon">📱</span>
                <span class="ll-text">بررسی وضعیت...</span>
            `;

      // Add default styles if needed
      if (config.style === "default") {
        this.addDefaultStyles();
      }

      // Update button based on installation status
      this.isPWAInstalled().then((isInstalled) => {
        const icon = button.querySelector(".ll-icon");
        const text = button.querySelector(".ll-text");

        if (isInstalled) {
          icon.textContent = "📱";
          text.textContent = "باز کردن اپلیکیشن";
          button.setAttribute("data-installed", "true");
        } else {
          icon.textContent = "🌐";
          text.textContent = "مشاهده در وب";
          button.setAttribute("data-installed", "false");
        }
      });

      // Add click handler
      button.addEventListener("click", () => {
        this.launch(config);
      });

      // Add to container
      if (typeof config.container === "string") {
        const container = document.querySelector(config.container);
        if (container) {
          container.appendChild(button);
        }
      } else {
        config.container.appendChild(button);
      }

      return button;
    },

    // Add default CSS styles
    addDefaultStyles: function () {
      if (document.getElementById("lift-legends-pwa-styles")) {
        return; // Styles already added
      }

      const style = document.createElement("style");
      style.id = "lift-legends-pwa-styles";
      style.textContent = `
                .lift-legends-launch-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    text-decoration: none;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .lift-legends-launch-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
                }
                
                .lift-legends-launch-btn:active {
                    transform: translateY(0);
                }
                
                .lift-legends-launch-btn[data-installed="true"] {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }
                
                .lift-legends-launch-btn[data-installed="false"] {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                }
                
                .ll-icon {
                    font-size: 18px;
                }
                
                .ll-text {
                    white-space: nowrap;
                }
            `;

      document.head.appendChild(style);
    },

    // Initialize with auto-detection
    init: function (options = {}) {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.createLaunchButton(options);
        });
      } else {
        this.createLaunchButton(options);
      }
    },
  };

  // Expose to global scope
  window.LiftLegendsPWA = LiftLegendsPWA;

  // Auto-initialize if data-auto-init attribute is present
  if (
    document.currentScript &&
    document.currentScript.hasAttribute("data-auto-init")
  ) {
    const container =
      document.currentScript.getAttribute("data-container") || "body";
    LiftLegendsPWA.init({ container });
  }
})(window);
