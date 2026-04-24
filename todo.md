
- [ ] Research making Desktop version
  - [ ] split to different adapter area for input, etc
  - [ ] look into keystrokes or other methods of activating the popup for minimal loss of flow
- [ ] Add License for source code
- [ ] Look into a way to take up whole viewport on android rather than the current frame: issues include rendering popup under elements when overscroll(?), Rendering downward when inputting at the bottom of the viewport where you can't scroll further
- [ ] Add ability for labels/sections for reference or organization
- [ ] Maybe even tabbed organization for large data sets (low priority)
- [ ] Cleanup and document code as needed
- [ ] Research if I can make the permissions less scary sounding/maybe the URL method can avoid this
- [ ] Look into saving into extension storage rather than localstorage in the browser
- [x] Investigate being able to use URLs for the JSON instead of having to download JSON first. Outcome: added URL import mode in settings (manual, paste import, file import, URL source). Initial target use-case is raw gist URLs.
- [x] Node script management
- [x] Consider QOL up/down grades from using Vue, TS
Outcome: Vue ran but became unwieldy to parse source in the repo. It was antithetical to the goal of this being a project that is not that hard to understand when inspected casually. NTS: if this extension was massive and view-heavy I would. TS seems to not have much ROI for similar readability reasons as well as mostly dealing with native JS APIs anyway. I favor TS for schema heavy, or third party integrations, and calls across APIs.
- [x] Evaluate whether import parsing can be simplified to direct JSON.parse only, instead of the current normalization/shape-handling flow. Outcome: Loss of string | string[] coercion when using multi-line to valuable to lose or obscure.
- [x] Remove support for object-shaped import payloads and accept only top-level array JSON for resource import.
- [x] Split README into two clear flows: install from signed release file vs run development build.