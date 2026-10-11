# Perritual: warm celebration, expressive motion

## Direction
Evolve the existing artisanal brand with a more expressive display face and a photographic catalog. Preserve the supplied logo, warm cream/cocoa/terracotta identity, copy voice and all buying behavior. Landing: Persuade + Experience. Purchase dialogs: Operate.

## Reference application
- Taste Skill: audit existing surface first, editorial hierarchy, purposeful layouts, consistent shapes, actual product imagery, mobile adaptations.
- Emil Kowalski: responsive press states; ease-out enters; exits shorter than enters; native Web Animations API; no animation on keyboard actions; fine-pointer hover only.
- Impeccable: one authored focal moment; native scrolling; visible default content; composition, contrast and performance; control over effects.
- Spotlight Card: contextual highlight on product cards, adapted to native CSS rather than importing React into a buildless storefront.

These are design guidance sources, not installed runtime dependencies or an automated audit certification. No repository scripts, hooks or external agents are executed.

## Before / after audit
| Before | After | Why |
|---|---|---|
| Serif split hero with many small labels | Bricolage Grotesque two-line display and shorter copy | Stronger festive voice and clear hierarchy |
| Illustrated product catalog | Six coherent conceptual photographic product assets | Make the product and tactile packaging concrete |
| Static kit promo | Sticky photographic kit narrative across three chapters | Explain how the complete kit combines a cake and complements |
| Abrupt native-dialog entry | 230ms modal / 290ms drawer entry, 160ms dismissal | Explain spatial state without slowing the task |
| Entire preview replaced on input | Update chosen name/age/color label in place | Preserve photo continuity and typing responsiveness |
| Fonts requested at runtime from Google | Local font files | Eliminate cross-origin font dependency |
| Uniform static sections | Selective reveal, hero depth and one scroll-driven text strip | Controlled pacing rather than repeated effects everywhere |

## Tokens
Background #faf5ec, foreground #482c20, primary #b6492d, secondary text #70584b. Pale peach backgrounds and sage product props derive from the brand. Light paper-artisan treatment is intentional and retains the approved design. Bricolage Grotesque 700 for display; DM Sans 400/700 for body. Logo wordmark untouched. Display tracking ≥ -0.04em, h1 maximum 96px. Cards and dialogs: 12–16px; small interactive controls: pills; fields: 8px. Photography arch only in the hero.

## Motion
DESIGN_VARIANCE 7 / MOTION_INTENSITY 7 / VISUAL_DENSITY 4 on marketing, lower intensity on task UI.
- Focal sequence: sticky image at left, three readable chapters at right on desktop. On mobile the product image occupies ~36svh at top while chapters progress below. IntersectionObserver changes the photograph; the browser retains natural scroll.
- Continuity: checkout directional transition, photo stays mounted while personalizing.
- Feedback: tactile press, cart badge update, dialog entry/exit, confirmation indicator.
- Budget: no animation framework, no requestAnimationFrame loop, no scroll event handler. CSS view timelines enhance capable browsers; others retain static layout. One rAF write for card highlight per pointer frame.
- Control: pause button and prefers-reduced-motion. No automatic endless motion. Page stays visible if enhancement fails.

## Journey layer (journey.css + journey.js)
Added on 2026-10-10 at the owner's request for a more immersive scroll, with https://21st.dev/@monolythdev/templates/mantality-mens-coaching-site as the motion reference. It supersedes the "no rAF loop, no scroll handler" budget above for this layer only.
- Loader: the logo blooms from the paw inside the P, five paw prints follow real progress (images + fonts, 1.9s floor, 5s ceiling), then the logo lands on the header while two curtains lift. Skipped when effects are paused or reduced motion is on; a 9s inline failsafe removes it if the script never runs.
- Scenes, in order: floating notes around the hero photo, two crossed ribbons that speed up with the scroll, a pinned cocoa manifesto whose words light up, paw prints walking across the steps, the catalog orbiting the seal, and a footer wordmark that rises letter by letter.
- Budget: still no library and no intercepted scrolling. One frame loop that runs only while the page moves; transform and opacity writes; geometry cached and re-measured on resize.
- Control: every motion state sits behind `html.mj` and yields to `html[data-motion=paused]`, so the pause button and reduced motion return a static, fully readable page.
- Honesty: no testimonials, counters or stock claims were added. Hero notes repeat facts already stated in the page (name personalization, 24-hour lead time, Valle de Aburrá).
- Checked in headless Chrome at 390, 820 and 1440 px: loader, each scene, paused mode, reload while paused, product dialog. Frame pacing on real phones still needs a hands-on check.

## Verification limits
Syntax and DOM-level flow checks are distinct from visual/browser validation. No approved browser-control skill is available in this environment, so device rendering and animation frame pacing need later browser verification. Do not claim measured Web Vitals or certified WCAG compliance.

## Source references
https://github.com/Leonxlnx/taste-skill
https://github.com/emilkowalski/skills
https://github.com/pbakaus/impeccable
https://21st.dev/@jahed/components/spotlight-card
