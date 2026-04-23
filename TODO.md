# TODO

## Export

Steps to sign and sideload the extension so it can be used without a PC connection.

### 1 — Create a Firefox Add-on Developer account (one-time)
- [ ] Sign up at `addons.mozilla.org`
- [ ] Go to your account → **API Keys**
- [ ] Generate an **API key** and **API secret**

### 2 — Sign the extension
- [ ] Run from the project folder:
  ```
  npx web-ext sign --channel unlisted --api-key <your-key> --api-secret <your-secret>
  ```
- [ ] The signed `.xpi` will be saved to `web-ext-artifacts/`
- [ ] Repeat this step (with a bumped `version` in `manifest.json`) for every update

### 3 — Host the signed XPI
- [ ] Upload the `.xpi` to a location with a direct download URL, e.g.:
  - GitHub Releases (create a release and attach the file)
  - Any web server or cloud storage with a public direct link

### 4 — Install on Android without a PC
- [ ] Open Firefox for Android
- [ ] Navigate to the direct `.xpi` URL
- [ ] Tap **Add** when Firefox prompts to install the extension
