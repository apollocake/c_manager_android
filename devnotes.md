## Development and running locally

### Start and Run extension on Phone via USB
Run from the project folder:
```
npx web-ext run -t firefox-android --firefox-apk org.mozilla.firefox --android-device=9A181FFAZ003KA --adb-remove-old-artifacts
```
To remotely debug on PC: In Firefox desktop, over USB, navigate to:
```
about:debugging#/runtime/this-firefox
```

Click connect.

## Export

Steps to sign and sideload the extension so it can be used without a PC connection.

### Create a Firefox Add-on Developer account (one-time)
- Sign up at `addons.mozilla.org`
- Go to your account → **API Keys**
- Generate an **API key** and **API secret**

### Sign the extension
- Run from the project folder:
  ```
  npx web-ext sign --channel unlisted --api-key <your-key> --api-secret <your-secret>
  ```
- The signed `.xpi` will be saved to `web-ext-artifacts/`
- Repeat this step (with a bumped `version` in `manifest.json`) for every update

### Host the signed XPI
- Upload the `.xpi` to a location with a direct download URL, e.g.:
  - GitHub Releases (create a release and attach the file)
  - Any web server or cloud storage with a public direct link

## Install on Android from signed file

Firefox for Android stable does not allow installing extensions directly from local files. To install from an `.xpi` file during development, use Firefox Nightly.

### Install Firefox Nightly
- Install **Firefox Nightly** on your Android device from Google Play.

### Enable Nightly debug/advanced mode
- Open Firefox Nightly → **Settings** → **About Firefox Nightly**
- Tap the Firefox logo multiple times (typically 5) to unlock advanced/debug options
- Return to Settings and open the newly available advanced/debug settings area

### Install extension from file
- Open Add-ons in Nightly
- Use the install-from-file option and pick your signed `.xpi`

Without Firefox Nightly + debug/advanced mode, current Firefox Android builds will block install-from-file workflows.