# PRD - Mathinik

## Problem Statement

Parents of Grade 1 to Grade 3 learners need a math learning experience that feels enjoyable, intuitive, and genuinely educational, without feeling like a digital worksheet. Many existing math sites and apps lean too heavily on static quiz flows, text-heavy exercises, or generic gamification that wraps traditional question-answer patterns without changing how children actually learn.

Mathinik aims to solve this by helping children build math understanding through simple, touch-friendly interactive mechanics instead of mostly static quiz flows, while also working offline-first for real-world family use.

## Solution

Mathinik will be a responsive web app, optimized primarily for mobile phones and designed as an offline-capable PWA. It will target Grade 1 to Grade 3 learners, with parent-assisted use first and room for more independent child use over time.

The experience will be curriculum-first in substance, but playful in presentation. Children will move through a world-map progression system supported by a mascot guide, short lessons, lightweight rewards, and mastery-based unlocking.

The defining MVP idea is that children **build math**, not just answer math. Mathinik should teach through interaction and manipulation, using simple, touch-friendly mechanics that are novel but aggressively simplified for young learners on mobile devices.

For MVP:
- the product promise is interactive math-building with offline-first access
- content will be authored as static JSON files
- learner progress will be stored locally in the browser
- multiple child profiles will be supported on one device
- there will be no full admin CMS yet
- the launch interaction model will be intentionally narrow and focused

## User Stories

1. As a parent, I want to create a child profile locally, so that my child can have their own progress without needing a cloud account.
2. As a parent, I want to set a starting grade or use an optional placement check, so that my child begins at an appropriate level.
3. As a child learner, I want the app to feel like an adventure, so that math feels fun instead of intimidating.
4. As a child learner, I want a mascot to guide and encourage me, so that the experience feels friendly and motivating.
5. As a child learner, I want to resume where I left off, so that short play-and-learn sessions are easy.
6. As a child learner, I want lessons to be short, so that I can complete them in 5 to 10 minutes.
7. As a child learner, I want to build math by moving, placing, and arranging things on screen, so that solving feels active and understandable.
8. As a child learner, I want to build equations by dragging numbers, operators, and visual groups, so that I can connect symbols to meaning.
9. As a child learner, I want to manipulate visual groups or objects, so that I can understand quantities and relationships more concretely.
10. As a child learner, I want the app to use visuals more than long text, so that I can understand tasks even if I am still developing reading skills.
11. As a child learner, I want immediate feedback when I interact with a problem, so that I know whether I am on the right track.
12. As a child learner, I want forgiving touch interactions, so that accidental drags or drops do not punish me unfairly.
13. As a child learner, I want hints before the answer is revealed, so that I get a chance to learn instead of just being marked wrong.
14. As a child learner, I want worked explanations or visual explanations when I struggle, so that I can understand the idea, not just memorize an answer.
15. As a child learner, I want to unlock the next lesson by showing enough mastery, so that progress feels earned.
16. As a child learner, I want stars, rewards, and badges, so that progress feels exciting.
17. As a child learner, I want to see a world map and my next recommended lesson, so that I know where I am going next.
18. As a child learner, I want to replay completed lessons, so that I can practice again without losing my best progress.
19. As a child learner, I want better replay performance to improve my stars or mastery, so that practice continues to matter.
20. As a child learner, I want simple sound effects when I succeed or make mistakes, so that the app feels lively.
21. As a parent, I want a simple summary of my child’s progress, so that I can quickly see whether the app is helping.
22. As a parent, I want to see completed lessons, rewards, and simple mastery indicators, so that I can support my child without reading a complex report.
23. As a parent, I want the app to work offline once installed or loaded, so that my child can use it even with unreliable internet.
24. As a parent, I want the app to update content when online again, so that the app can improve without losing its offline usefulness.
25. As a content author, I want lesson content stored in structured JSON, so that content can be versioned, reviewed, and updated without building a full CMS first.
26. As a product builder, I want the app architecture to support future interaction types without rewriting the lesson system, so that Mathinik can evolve over time.
27. As a product builder, I want simple difficulty branching based on performance, so that learners can get more support or move faster without requiring a full adaptive engine.
28. As a struggling learner, I want the app to switch to more guided practice, so that I get help before being blocked.
29. As a parent, I want the app to suggest when my child may need more support, so that I know when to step in.
30. As a child learner, I want my profile name and light avatar or mascot personalization to appear in the app, so that the experience feels like mine.
31. As a family, I want multiple child profiles on one device, so that siblings can share the app without sharing progress.

## Implementation Decisions

- The product targets Grade 1 to Grade 3 learners first.
- The primary usage model for MVP is parent-assisted use, with room to improve toward independent child use later.
- The core learning loop is: short teaching moment, then interactive practice/play, then mastery check.
- The core product promise is: Mathinik helps Grade 1–3 children build math understanding through simple, touch-friendly interactive mechanics instead of mostly static quiz flows, with offline-first access for real-world use.
- The content scope for MVP covers number sense, addition and subtraction, and multiplication foundations.
- Simple word problems remain in MVP only in a limited, visually supported way.
- The curriculum structure is organized by grade first, then by skill/topic within grade.
- A lesson is defined as a short sequence of activities focused on one skill.
- Lesson completion is designed for 5 to 10 minute sessions.
- The child home screen should prioritize resume-first behavior, then show map-based progression.
- The game layer is centered on world-map progression with unlocks, supported by stars, badges, and lightweight rewards.
- Time-pressure mechanics are intentionally not core to MVP.
- The visual wrapper is a hybrid of adventure map progression plus a mascot guide.
- The educational stance is curriculum-first in substance, playful in presentation.
- The single strongest conceptual anchor is: children build math.
- MVP interaction design should be novel, but aggressively simplified for touch and for young learners.
- Interactions must be forgiving: easy correction, clear visual feedback, low penalty for touch mistakes, and obvious snap/drop behavior.
- The launch interaction model is intentionally capped at two core interaction types.
- Core interaction type #1 is drag-and-drop equation building.
- Core interaction type #2 is visual object/group manipulation.
- Drag-and-drop equation building should use numbers, operators, and visual groups/objects rather than symbols alone.
- The interaction system should support connecting concrete and symbolic math representations.
- Multiple choice is allowed only as an occasional support format, not as a defining mechanic.
- Numeric input is allowed only as an occasional support/check format, not as a defining mechanic.
- If guessing or brute-force interaction patterns are detected, the app should require a second representation or confirming follow-up interaction instead of treating the first success as sufficient evidence of understanding.
- Wrong-answer handling should follow a scaffolded flow: hint first when appropriate, allow retry, then show a worked or visual explanation if needed.
- Difficulty adjustment should use simple easier/harder branching based on performance, not a fully adaptive engine.
- If a child struggles repeatedly, the app should switch into more guided practice using hints, visuals, and manipulatives, and only later suggest parent help.
- Unlocking should require both completion and a minimum mastery threshold.
- Mastery should be visible to the child through simple visual progress and skill badges.
- Replay of completed lessons should be allowed and should preserve best historical progress while allowing improvement.
- The app should use short text with strong visual support, with lower reading burden for younger learners.
- MVP audio should be limited to simple sound effects only.
- The app should be responsive across devices but optimized primarily for mobile phone use.
- The app should support multiple local child profiles on a single device.
- Parent onboarding should be lightweight: create child profile, choose starting grade/path, optionally take a placement check, then start.
- Starting point selection should allow both manual grade/path selection and an optional placement or check-in activity.
- Parent-facing progress should be a simple summary view, not a detailed analytics dashboard.
- The app should be built as an offline-capable PWA.
- Core app behavior and previously loaded content should work offline.
- Content updates should be checked and refreshed when the app comes back online.
- Curriculum and lesson content should be stored in static JSON files for MVP.
- A full browser-based admin/content management interface is deferred beyond MVP.
- Progress persistence for MVP should be local to the device/browser rather than cloud-backed.
- The architecture should separate content definition, lesson progression logic, mastery/progress tracking, and interaction rendering so those parts can evolve independently.

## Testing Decisions

- A good test should validate external behavior, not implementation details.
- Tests should focus on user-visible outcomes such as lesson progression, unlock rules, progress persistence, resume behavior, mastery calculations, and interaction correctness.
- The highest-risk area to validate early is whether young children can use the touch interactions smoothly and intuitively on mobile devices.
- Tests should specifically validate forgiving touch behavior, such as accidental mis-drags, wrong drops, correction flows, snap behavior, and recovery without unfair penalties.
- Content validation tests should verify that JSON lesson content is structurally valid and references only supported interaction types.
- Progress and persistence tests should verify correct handling of local child profiles, replay behavior, resume behavior, and offline persistence.
- Learning-loop tests should verify hint → retry → explanation flows and branching behavior for struggling vs successful learners.
- Unlocking tests should verify that lessons/modules unlock only after completion plus minimum mastery.
- Interaction tests should focus first on the two core launch mechanics:
  - drag-and-drop equation building
  - visual object/group manipulation
- Support-format tests should verify occasional multiple choice and numeric input behavior without letting them dominate the learning loop.
- Guessing-resistance tests should verify that brute-force success patterns trigger a second representation or follow-up confirmation step.
- UI behavior tests should verify mobile-first interaction quality, especially for touch target size, drag/drop forgiveness, readability, and resume-first home flow.
- PWA/offline tests should verify installability, content caching, local availability, and safe update behavior when the app reconnects.
- Module boundaries worth testing in isolation include:
  - content loading and validation
  - interaction rendering by mechanic type
  - mastery and reward calculation
  - lesson/session progression
  - local profile and progress persistence
  - offline content/version update behavior
- When implementation begins, prior art should be identified from the codebase or framework test patterns already in use, but since the repo is currently minimal, test strategy should initially follow framework-standard patterns for unit, component, and end-to-end behavior.

## Out of Scope

The following are explicitly out of scope for MVP:

- teacher portal
- school administration features
- cloud accounts and cloud sync
- backend-driven progress storage
- full browser-based admin/content management CMS
- AI-generated curriculum or AI-authored question generation
- advanced adaptive learning engine
- multiplayer or social features
- deep avatar economy or complex pet/companion systems
- full voice narration or voice-led lessons
- full curriculum coverage beyond the defined MVP math scope
- highly complex custom mini-game engines for many lesson types
- broad launch support for many equal-weight interaction families beyond the defined MVP core and support formats

## Further Notes

- The revised PRD should be understood as interaction-first: Mathinik differentiates itself through how children build and manipulate math, not merely through gamification wrapped around standard quiz flows.
- Offline-first is important and parent-friendly, but it is a supporting advantage rather than the main emotional product identity.
- Because the app is mobile-optimized and aimed at younger learners, touch targets, visual clarity, forgiving interactions, and single-task screen design are especially important.
- Because the app is offline-first, content versioning and safe update behavior will matter early, even in MVP.
- The MVP should prioritize a coherent learner loop and a small number of high-quality interaction patterns over a broad toy box of mechanics.
- Future phases can add richer interaction types, but MVP should remain disciplined around its core interaction identity.
