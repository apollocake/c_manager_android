- [ ] Investigate being able to use URLs for the JSON instead of having to download JSON first. Ideally we will have 4 modes, but might be too cluttered ATM: manually adding each label/text individually, paste import, file import, URL source
- [ ] Add License for source code
- [ ] Research making Desktop version
- [x] Node script management
- [x] Consider QOL up/down grades from using Vue, TS
Outcome: Vue ran but became unwieldy to parse source in the repo. It was antithetical to the goal of this being a project that is not that hard to understand when inspected casually. NTS: if this extension was massive and view-heavy I would. TS seems to not have much ROI for similar readability reasons as well as mostly dealing with native JS APIs anyway. I favor TS for schema heavy, or third party integrations, and calls across APIs.
- [x] Evaluate whether import parsing can be simplified to direct JSON.parse only, instead of the current normalization/shape-handling flow. Outcome: Loss of string | string[] coercion when using multi-line to valuable to lose or obscure.
- [x] Remove support for object-shaped import payloads and accept only top-level array JSON for resource import.
- [x] Split README into two clear flows: install from signed release file vs run development build.