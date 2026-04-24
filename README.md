# README

## Install on Android from signed file

This extension is in pre-release and unlisted. Firefox for Android stable does not allow installing extensions directly from local files. To install from an `.xpi` file during development, use Firefox Nightly.

### Install Firefox Nightly
- Install **Firefox Nightly** on your Android device from Google Play.

### Enable Nightly debug/advanced mode
- Open Firefox Nightly → **Settings** → **About Firefox Nightly**
- Tap the Firefox logo multiple times (typically 5) to unlock advanced/debug options
- Return to Settings and open the newly available advanced/debug settings area
  
### Grab the pre-release build from the Releases
- Download the xpi file from the resources on your android device

### Install extension from file
- Open Add-ons in Nightly
- Use the install-from-file option and pick your signed `.xpi`

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
