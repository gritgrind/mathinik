# PRD - Mathinik

## Problem Statement

Parents of Grade 1 to Grade 3 learners need a math learning experience that feels enjoyable, interactive, and easy to stick with, while still being grounded in real curriculum progression. Many existing math sites feel too much like digital worksheets, are too text-heavy for younger learners, or fail to create a satisfying sense of progress and mastery.

Mathinik aims to solve this by creating a mobile-optimized, game-like math learning web app for young learners that combines short teaching moments, interactive practice, mastery-based progression, and lightweight parent support.

## Solution

Mathinik will be a responsive web app, optimized primarily for mobile phones and designed as an offline-capable PWA. It will target Grade 1 to Grade 3 learners, with parent-assisted use first and room for more independent child use over time.

The experience will be curriculum-first in substance, but playful in presentation. Children will move through a world-map progression system supported by a mascot guide, short lessons, lightweight rewards, and mastery-based unlocking.

For MVP:
- content will be authored as static JSON files
- learner progress will be stored locally in the browser
- multiple child profiles will be supported on one device
- there will be no full admin CMS yet
- the app will support a focused set of interaction types while leaving room for richer interactivity later

## User Stories

1. As a parent, I want to create a child profile locally, so that my child can have their own progress without needing a cloud account.
2. As a parent, I want to set a starting grade or use an optional placement check, so that my child begins at an appropriate level.
3. As a child learner, I want the app to feel like an adventure, so that math feels fun instead of intimidating.
4. As a child learner, I want a mascot to guide and encourage me, so that the experience feels friendly and motivating.
5. As a child learner, I want to resume where I left off, so that short play-and-learn sessions are easy.
6. As a child learner, I want lessons to be short, so that I can complete them in 5 to 10 minutes.
7. As a child learner, I want to learn one skill at a time in a short lesson sequence, so that I do not feel overwhelmed.
8. As a child learner, I want lessons to include interactive answer types, so that solving math feels playful and engaging.
9. As a child learner, I want to answer through multiple choice, number input, and drag-and-drop interactions, so that the app feels more interactive than a worksheet.
10. As a child learner, I want the app to use visuals more than long text, so that I can understand tasks even if I am still developing reading skills.
11. As a child learner, I want immediate feedback when I answer, so that I know whether I am on the right track.
12. As a child learner, I want hints before the answer is revealed, so that I get a chance to learn instead of just being marked wrong.
13. As a child learner, I want worked explanations or visual explanations when I struggle, so that I can understand the idea, not just memorize an answer.
14. As a child learner, I want to unlock the next lesson by showing enough mastery, so that progress feels earned.
15. As a child learner, I want stars, rewards, and badges, so that progress feels exciting.
16. As a child learner, I want to see a world map and my next recommended lesson, so that I know where I am going next.
17. As a child learner, I want to replay completed lessons, so that I can practice again without losing my best progress.
18. As a child learner, I want better replay performance to improve my stars or mastery, so that practice continues to matter.
19. As a child learner, I want simple sound effects when I succeed or make mistakes, so that the app feels lively.
20. As a parent, I want a simple summary of my child’s progress, so that I can quickly see whether the app is helping.
21. As a parent, I want to see completed lessons, rewards, and simple mastery indicators, so that I can support my child without reading a complex report.
22. As a parent, I want the app to work offline once installed or loaded, so that my child can use it even with unreliable internet.
23. As a parent, I want the app to update content when online again, so that the app can improve without losing its offline usefulness.
24. As a content author, I want lesson content stored in structured JSON, so that content can be versioned, reviewed, and updated without building a full CMS first.
25. As a product builder, I want the app architecture to support additional interaction types later, so that Mathinik can evolve into a richer interactive learning platform.
26. As a product builder, I want simple difficulty branching based on performance, so that learners can get more support or move faster without requiring a full adaptive engine.
27. As a struggling learner, I want the app to switch to more guided practice, so that I get help before being blocked.
28. As a parent, I want the app to suggest when my child may need more support, so that I know when to step in.
29. As a child learner, I want my profile name and light avatar or mascot personalization to appear in the app, so that the experience feels like mine.
30. As a family, I want multiple child profiles on one device, so that siblings can share the app without sharing progress.

## Implementation Decisions

- The product targets Grade 1 to Grade 3 learners first.
- The primary usage model for MVP is parent-assisted use, with room to improve toward independent child use later.
- The core learning loop is: short teaching moment, then interactive practice/play, then mastery check.
- The content scope for MVP covers number sense, addition and subtraction, simple word problems, and multiplication foundations.
- The curriculum structure is organized by grade first, then by skill/topic within grade.
- A lesson is defined as a short sequence of activities focused on one skill.
- Lesson completion is designed for 5 to 10 minute sessions.
- The child home screen should prioritize resume-first behavior, then show map-based progression.
- The game layer is centered on world-map progression with unlocks, supported by stars, badges, and lightweight rewards.
- Time-pressure mechanics are intentionally not core to MVP.
- The visual wrapper is a hybrid of adventure map progression plus a mascot guide.
- The educational stance is curriculum-first in substance, playful in presentation.
- The initial supported question interaction types are multiple choice, numeric input, and drag-and-drop matching/ordering.
- The system should be designed so that richer interaction types can be added later, including manipulatives, richer visual answering, and mini-game-style interactions.
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
- Content validation tests should verify that JSON lesson content is structurally valid and references supported question/interaction types.
- Progress and persistence tests should verify correct handling of local child profiles, replay behavior, resume behavior, and offline persistence.
- Learning-loop tests should verify hint → retry → explanation flows and branching behavior for struggling vs successful learners.
- Unlocking tests should verify that lessons/modules unlock only after completion plus minimum mastery.
- UI behavior tests should verify mobile-first interaction quality, especially for multiple choice, numeric input, drag-and-drop, and resume-first home flow.
- PWA/offline tests should verify installability, content caching, local availability, and safe update behavior when the app reconnects.
- Module boundaries worth testing in isolation include:
  - content loading and validation
  - interaction rendering by question type
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
- highly complex custom mini-game engines for every lesson type

## Further Notes

- The product should be designed so that future phases can add richer interactive answer types without rewriting core lesson flow.
- Because the app is mobile-optimized and aimed at younger learners, touch targets, visual clarity, and single-task screen design are especially important.
- Because the app is offline-first, content versioning and safe update behavior will matter early, even in MVP.
- The initial curriculum scope should be deep enough to feel meaningful, but the product should avoid pretending to cover the entire Grade 1 to Grade 3 curriculum in version 1.
- The MVP should prioritize delivering a strong learner loop and a coherent parent-assisted experience over building broad authoring or reporting systems.
