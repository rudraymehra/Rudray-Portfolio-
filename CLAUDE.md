# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A terminal-style portfolio website built with React, TypeScript, Vite, and Tailwind CSS. The entire user experience is delivered through an interactive command-line interface in the Terminal component.

## Commands

```bash
npm run dev       # Start dev server at localhost:8080
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

### Core Structure
- `src/components/Terminal.tsx` - Main application component implementing the CLI interface with commands (help, about, projects, skills, experience, etc.)
- `src/components/ui/` - shadcn/ui component library (50+ pre-built components)
- `src/pages/Index.tsx` - Entry page that renders Terminal
- `src/App.tsx` - Root component with providers (QueryClient, Tooltip, Router, Toast)

### Configuration
- **Path alias**: `@/` maps to `src/` (configured in vite.config.ts and tsconfig.json)
- **Dev server**: Port 8080
- **Build**: Vite with SWC plugin for fast TypeScript compilation
- **UI components**: shadcn/ui configured in `components.json`

### Styling
- Tailwind CSS with custom terminal theme colors defined in `tailwind.config.ts`
- Custom CSS variables in `src/index.css` for theming (HSL color system)
- JetBrains Mono as primary monospace font
- Custom animations: typing, blink, glow

### Key Dependencies
- React Query for data fetching
- React Router for navigation
- Zod + React Hook Form for validation
- Radix UI primitives (via shadcn/ui)

## Development Notes

- TypeScript strict mode is disabled for flexibility
- All portfolio content is delivered through terminal commands - maintain this CLI pattern when adding features
- When adding UI components, use existing shadcn/ui components from `src/components/ui/`
