# README


## Development

### 1 — Start and Run extension on Phone via USB
Run from the project folder:
```
npx web-ext run -t firefox-android --firefox-apk org.mozilla.firefox --android-device=9A181FFAZ003KA --adb-remove-old-artifacts
```
To remotely debug on PC: In Firefox desktop, over USB, navigate to:
```
about:debugging#/runtime/this-firefox
```

Click connect.

## How to use

Use the extension settings page to manage snippet resources. Resources are persisted in extension storage and are used to hydrate the popup UI at runtime.

### JSON format accepted by import

You can import either:
- A top-level array of snippets
- An object containing a `resources` array

Each snippet supports:
- `label`: string
- `text`: string or string array

Example A - top-level array:
```json
[
  {
    "label": "Greeting",
    "text": ["Hello World"]
  },
  {
    "label": "Multi-line",
    "text": ["Line 1", "Line 2", "Line 3"]
  }
]
```

Example B - object with `resources`:
```json
{
  "resources": [
    {
      "label": "Single string also works",
      "text": "This becomes one text line"
    }
  ]
}
```

### Import flow (hydrate UI from JSON)

1. Open extension settings.
2. In `Resource Source`, choose one of:
   - `Import JSON resource file`
   - `Or paste JSON directly`
3. Click `Import File` or `Import Pasted JSON`.
4. Confirm snippets appear in the list.
5. Click `Save`.

After saving, the popup/snippet UI uses the imported resources.

### Manual editing flow (hydrate UI by editing labels/text)

1. Open extension settings.
2. Edit snippet labels and text lines directly.
3. Add/remove snippets or lines as needed.
4. Click `Save`.

The next long-press popup reflects the saved values.

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

## Install on Android from signed file

Firefox for Android stable does not allow installing extensions directly from local files. To install from an `.xpi` file during development, use Firefox Nightly.

### 1 — Install Firefox Nightly
- [ ] Install **Firefox Nightly** on your Android device from Google Play.

### 2 — Enable Nightly debug/advanced mode
- [ ] Open Firefox Nightly → **Settings** → **About Firefox Nightly**
- [ ] Tap the Firefox logo multiple times (typically 5) to unlock advanced/debug options
- [ ] Return to Settings and open the newly available advanced/debug settings area

### 3 — Install extension from file
- [ ] Open Add-ons in Nightly
- [ ] Use the install-from-file option and pick your signed `.xpi`

Without Firefox Nightly + debug/advanced mode, current Firefox Android builds will block install-from-file workflows.