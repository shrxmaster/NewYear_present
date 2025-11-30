# Ainazik and the Star's Glow

## Overview

"Ainazik and the Star's Glow" is an interactive story game with a magical New Year atmosphere. Players follow Ainazik on a journey to restore a family New Year star by collecting four Memory Crystals through different chapters, each featuring unique mini-games. The application is built as a single-page React application with a warm, cozy visual design inspired by games like Alto's Adventure and Monument Valley.

The game progresses through seven main chapters:
1. Start Screen - Introduction and theme selection
2. The Attic - Story setup where Ainazik discovers the dimmed star
3. Cozy Street - Memory matching game to earn the Crystal of Kindness
4. Market - Object finding game to earn the Crystal of Memories
5. Winter Forest - Sliding puzzle game to earn the Crystal of Courage
6. Celebration Square - Rhythm/timing game to earn the Crystal of Unity
7. Final Scene - Crystal placement and star restoration celebration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running in a single-page application (SPA) architecture.

**State Management**: The application uses React Context API for global game state management through a custom `GameProvider`. Game state persists to localStorage, including current chapter, collected crystals, completed chapters, theme color preference, and game completion status. This approach was chosen over external state management libraries to keep the bundle size minimal and avoid unnecessary complexity for a self-contained game.

**UI Component Library**: Built on shadcn/ui components (Radix UI primitives) with the "new-york" style variant. Components are co-located in the client codebase using path aliases (`@/components`, `@/lib`, etc.). This provides accessible, customizable components while maintaining consistent styling through Tailwind CSS variables.

**Styling System**: Tailwind CSS with extensive CSS custom properties for theming. Design follows a handcrafted, warm aesthetic with:
- Custom font families (Quicksand for headings, Lato for body text, Fredoka for accents)
- Gradient backgrounds and soft shadows
- Animation utilities for transitions, fades, and interactive effects
- Dark mode support via class-based toggling

**Routing**: Chapter navigation is handled entirely through state changes rather than URL routing. The `GameRouter` component renders different chapter components based on `gameState.currentChapter`. This decision simplifies the game flow and avoids browser history complications.

### Backend Architecture

**Server Framework**: Express.js server with minimal API surface. The current implementation serves primarily as a static file server for the built React application.

**Build Process**: Custom esbuild configuration bundles the server code, with selective dependency bundling to optimize cold start times. Vite builds the client application with custom plugins for development (error overlay, cartographer, dev banner).

**Development Environment**: Vite dev server runs in middleware mode, integrated with Express for hot module replacement (HMR). The server proxies requests and serves the development build with live reloading.

### Data Architecture

**Schema Definition**: Drizzle ORM schemas defined in `shared/schema.ts` establish TypeScript types for game state, crystals, and chapters. These types are shared between client and server through path aliases.

**Key Data Structures**:
- `GameState`: Tracks current chapter, crystal collection status, completed chapters, theme color, and completion flag
- `Crystal`: Defines crystal types (kindness, memories, courage, unity) with metadata
- `ChapterKey`: Union type for type-safe chapter navigation

**Storage Strategy**: Client-side localStorage for game state persistence. No server-side database is currently implemented, making the game fully client-side and stateless from the server's perspective. This architectural decision prioritizes simplicity and eliminates the need for user accounts or session management.

### Component Architecture

**Game Components** (`client/src/components/game/`):
- `SceneWrapper`: Provides consistent layout with optional progress indicator and snowflake animations
- `DialogueBox`: Displays story text with speaker labels
- `GameButton`: Customized button variants (primary, secondary, magical) with icon support
- `ProgressIndicator`: Shows chapter completion status using a star-based stepper
- `CrystalDisplay`: Renders individual crystal UI with collection states
- `Star`: Animated star component with lit/unlit states

**Page Components** (`client/src/pages/`): Each chapter is a self-contained page component managing its own local state (dialogue progression, mini-game state). Pages communicate with global state only for chapter transitions and crystal collection.

### Mini-Game Implementations

Each mini-game is embedded within its chapter component:

1. **Memory Match (Cozy Street)**: Pair-matching game using local state to track flipped cards and matched pairs
2. **Object Finding (Market)**: Click-to-collect items positioned absolutely within a scene container
3. **Sliding Puzzle (Forest)**: 3x3 tile puzzle with move validation and solve detection
4. **Rhythm Game (Square)**: Timing-based note catching with scrolling animation and score tracking

Games are implemented with pure React state and effects, avoiding external game engines to maintain a lightweight bundle.

## External Dependencies

### UI Component Library
- **Radix UI**: Headless component primitives (@radix-ui/react-*) for accessible, unstyled base components
- **shadcn/ui**: Pre-configured component patterns built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing

### State & Data Management
- **React Query (@tanstack/react-query)**: Client-side data fetching and caching (minimal usage in current implementation)
- **React Hook Form (@hookform/resolvers)**: Form state management (included but not actively used)
- **Drizzle ORM**: TypeScript ORM for database schemas and type generation
- **Zod**: Schema validation library used with Drizzle for type safety

### Database
- **@neondatabase/serverless**: Serverless Postgres driver (configured but not actively used in current game flow)
- **PostgreSQL**: Intended database via Drizzle configuration, though game state currently persists to localStorage only

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Type-safe development across client and server

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation tool (Replit-specific)
- **@replit/vite-plugin-dev-banner**: Development mode indicator (Replit-specific)

### Utility Libraries
- **class-variance-authority**: Type-safe variant creation for components
- **clsx & tailwind-merge**: Conditional className utilities
- **date-fns**: Date manipulation (included but minimal usage)
- **nanoid**: Unique ID generation

### Animation & Interaction
- **embla-carousel-react**: Carousel/slider component (included via dependencies)
- **lucide-react**: Icon library for UI elements

### Session Management
- **express-session**: Server session handling (configured but minimal usage)
- **connect-pg-simple**: PostgreSQL session store (configured for future use)

### Fonts
- **Google Fonts**: Quicksand, Fredoka, and Lato font families loaded via CDN for consistent typography

### Future Integration Points
The architecture includes provisions for user authentication (passport, passport-local), email (nodemailer), AI services (@google/generative-ai, openai), payments (stripe), and file uploads (multer), though these are not currently implemented in the game logic.