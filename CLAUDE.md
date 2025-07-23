# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js 15 project with TypeScript. Common commands:

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Project Architecture

This is a personal portfolio website built with:

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom IBM Plex Mono font
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Icons**: Lucide React icons and React Icons
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Motion library for smooth animations
- **Analytics**: Custom analytics component

### Key Directory Structure

- `src/app/` - Next.js app router pages (home, about, contact, projects, resume)
- `src/components/` - React components organized by feature
- `src/data/` - Static data files for content (projects, experience, education, skills, personal info)
- `src/lib/` - Utility functions and configurations
- `src/pages/api/` - API routes (contact form handler)

### Data Architecture

The portfolio content is managed through TypeScript data files:
- `src/data/personalInfo.ts` - Contact info and social links
- `src/data/projects.ts` - Project portfolio data
- `src/data/experience.ts` - Work experience data
- `src/data/education.ts` - Education data
- `src/data/skills.ts` - Technical skills data

### Contact Form Integration

The contact form integrates with Google Sheets API for form submissions:
- API endpoint: `src/pages/api/contact.ts`
- Requires environment variables: `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`
- Uses googleapis library for Sheets API integration

### Component Structure

- **Layout Components**: Header, Footer, navigation
- **Section Components**: HeroSection, ProjectsSection, SkillsSection, etc.
- **Card Components**: ProjectCard, ExperienceCard, EducationCard
- **UI Components**: shadcn/ui components with custom styling

### Styling System

- Uses Tailwind CSS v4 with custom configuration
- IBM Plex Mono font family with multiple weights
- Responsive design with mobile-first approach
- Custom CSS variables for theme consistency

### Bundle Analysis

The project includes bundle analyzer support:
- Run `ANALYZE=true npm run build` to analyze bundle size
- Configuration in `next.config.ts`

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured (`@/*` maps to `src/*`)
- Next.js plugin for enhanced TypeScript support

### Key Features

- Server-side rendering with Next.js App Router
- Responsive design across all device sizes
- Form validation with Zod schemas
- Google Sheets integration for contact forms
- SEO optimization with proper metadata
- Modern React patterns with TypeScript