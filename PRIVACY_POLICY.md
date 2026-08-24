# Privacy Policy for Open In New Tab

Last updated: January 2025

## Data Collection
Open In New Tab does not collect, store, or transmit any personal data to external servers.

## Local Storage
The extension uses Chrome sync storage (`chrome.storage.sync`) to save:
- Your whitelist of domain names
- Your "open in background" preference

This data stays on your device. When you are signed in to Chrome, Chrome may synchronize it across your signed-in browsers; this is handled by Chrome, not by any external service the extension controls. We do not have access to this data.

## Permissions
- **storage**: Used to save your whitelist and preferences via `chrome.storage.sync`
- **activeTab**: Used to read the current tab's domain for the quick-add feature in the popup
- **host_permissions** (`*://*/*`): Allows static content scripts to load on HTTP and HTTPS pages that match the manifest. Link changes and click interception occur only on domains in your whitelist; on other sites the script loads but does not modify links or intercept clicks

## Third-Party Services
This extension does not use any third-party services, analytics, or tracking tools.

## Changes to This Policy
We may update this privacy policy from time to time. Changes will be posted on this page.

## Contact
For questions about this privacy policy, please visit: https://github.com/xiaowulang-turbo/OpenInNewTab/issues
