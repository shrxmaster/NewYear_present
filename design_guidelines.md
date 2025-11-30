# Design Guidelines for "Ainazik and the Star's Glow"

## Design Approach

**Reference-Based: Interactive Story Games & Visual Novels**

Drawing inspiration from:
- **Alto's Adventure / Monument Valley**: Minimalist, atmospheric game UI with clean typography and breathing room
- **Gris / Firewatch**: Emotional, story-driven games with strong visual identity
- **Interactive storybook apps**: Warm, inviting interfaces that prioritize narrative

**Core Design Principles:**
- Warmth over polish: Cozy, handcrafted feel rather than corporate precision
- Magic through restraint: Let the story breathe with generous whitespace
- Progressive revelation: Each chapter unveils new visual elements matching the story beat

## Typography

**Font Families:**
- Primary (Headings/Titles): Google Fonts "Quicksand" - soft, rounded, friendly
- Secondary (Body/Dialogue): Google Fonts "Lato" or "Inter" - clean, readable
- Accent (Chapter titles): "Fredoka One" - playful, magical

**Hierarchy:**
- Game title: 4xl to 6xl, bold weight
- Chapter titles: 3xl to 4xl, medium weight
- Dialogue text: base to lg, regular weight
- UI labels/buttons: sm to base, medium weight
- Story narration: lg, light to regular weight with increased line-height (1.8)

## Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 24 (p-4, m-8, gap-12, py-16, etc.)

**Chapter Screen Structure:**
- Full viewport height scenes (min-h-screen) with centered content
- Maximum content width: max-w-4xl for story text, max-w-6xl for game containers
- Vertical rhythm: py-12 to py-16 between major sections
- Consistent padding: px-6 to px-8 on mobile, px-12 on desktop

**Grid Patterns:**
- Crystal collection display: 2x2 grid (grid-cols-2) on mobile, 4-column (grid-cols-4) on desktop
- Mini-game containers: Centered, max-w-2xl to max-w-3xl
- Dialogue boxes: Single column, max-w-prose for optimal reading

## Component Library

### Navigation Elements
- **Chapter Progress Indicator**: Horizontal stepper showing 7 dots/crystals at top of screen (fixed position)
- **Back/Continue Buttons**: Large, rounded (rounded-2xl), positioned bottom-right with generous padding (px-8 py-4)

### Story Components
- **Dialogue Boxes**: Rounded cards (rounded-3xl) with soft shadows, semi-transparent backgrounds, positioned bottom-third of screen
- **Scene Descriptions**: Full-width text overlays with subtle gradients for readability
- **Character Name Tags**: Small pills above dialogue (rounded-full, px-6 py-2)

### Game Elements
- **Crystal Cards**: Square aspect ratio with rounded corners (rounded-2xl), glow effects when collected
- **Mini-Game Containers**: Bordered frames (border-4) with rounded corners, centered on screen
- **Memory Cards (Chapter 2)**: Flip animation, 4x3 grid on desktop, 3x2 on mobile
- **Sliding Puzzle (Chapter 4)**: 3x3 grid with numbered tiles, touch/click to move
- **Rhythm Game (Chapter 5)**: Horizontal timing bar with moving indicator

### Interactive Elements
- **Primary Buttons**: Large, rounded-full, with subtle shadows and scale transform on hover
- **Secondary Buttons**: Outlined style, rounded-full
- **Theme Selector**: Color swatches in horizontal row (start screen only)

### Collection Display
- **Crystal Showcase**: Glass-morphism cards displaying each collected crystal with name and acquisition story snippet
- **Final Star Animation**: Centered, large scale (transform scale), pulsing glow effect

## Images

### Hero/Scene Backgrounds
- **Start Screen**: Atmospheric illustration of a snowy attic window with twinkling stars outside (full viewport background, subtle parallax scroll)
- **Chapter 2 (Cozy Street)**: Warm street scene with string lights and snow-covered houses (background image with overlay gradient for text readability)
- **Chapter 3 (Market)**: Bustling winter market stalls with colorful decorations and warm lighting
- **Chapter 4 (Forest)**: Moonlit forest path with snow-laden trees, mystical blue tones
- **Chapter 5 (Square)**: Town square with large New Year tree being decorated, community gathering
- **Final Scene**: Close-up of the glowing star with all four crystals embedded, radiating magical light

All scene images should have a painted/illustrated quality rather than photorealistic - think digital watercolor or soft vector art.

### UI Icons
- Crystal icons for each type (Heroicons or custom illustrations): heart (Kindness), photo (Memories), shield (Courage), users (Unity)
- Star icon for progress indicator (Font Awesome or Heroicons)

## Animations

**Purposeful Motion:**
- **Scene Transitions**: Fade in/out (500ms) between chapters
- **Crystal Collection**: Scale up + glow pulse when obtained (1s celebratory animation)
- **Star Lighting (Final)**: Gradual brightness increase with particle effects (2-3s)
- **Mini-Game Feedback**: Card flips (300ms), tile slides (250ms), rhythm pulse (synced to beats)
- **Button Interactions**: Subtle scale (1.05) and shadow increase on hover
- **Progress Dots**: Fill animation when chapter completed

**Ambient Effects:**
- Gentle floating snowflakes (CSS animation, low density)
- Star twinkle on start screen (random opacity fade)
- Soft glow pulse on active crystals

## Accessibility & Responsiveness

- High contrast text over all background images (use overlay gradients or semi-transparent boxes)
- Minimum touch target: 44x44px for all interactive elements
- Keyboard navigation for all mini-games
- Skip dialogue/cutscene option for replay
- Responsive breakpoints: mobile-first, tablet (md:), desktop (lg:)