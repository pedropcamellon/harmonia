# Frontend Specification - Harmonia

## Overview

The frontend is a Next.js 15 application using the App Router architecture. It provides a modern, responsive interface for musicians to manage their song collection with chord sheets. The application emphasizes server-first rendering with strategic client-side interactivity for optimal performance and SEO.

## Architecture Philosophy

The frontend follows a hybrid rendering approach: server components fetch and display initial data, while client components handle interactive features like transposition controls, search filters, and form submissions. This pattern ensures fast initial page loads while maintaining rich user interactions.

## Core Pages

### Home Page (Song Library)

The landing page displays a comprehensive library view of all songs in the collection. Users are greeted with a clean grid or list layout showing song cards with titles, artists, and musical keys. A prominent search bar allows instant filtering by title or artist name. The search operates on the client side for immediate feedback but could be enhanced with server-side filtering for larger collections. Each song card acts as a clickable link to the detailed song view. A floating action button or prominent button provides quick access to create new songs. The page should feel spacious and organized, with smooth transitions when cards appear or when users navigate between views.

### Song Details Page

This page serves as the primary viewing experience for a song. The layout displays the song's metadata prominently: title, artist, and detected musical key. The chord sheet renders below using a carefully crafted monospace font layout where chords appear precisely aligned above their corresponding lyrics. The alignment is critical and relies on consistent character width, typically using the CSS unit system with monospace fonts. A transposition control panel allows musicians to shift the key up or down in semitone increments, with the interface updating all chords in real-time without page refreshes. An edit button navigates to the editor, while a delete action includes a confirmation dialog to prevent accidental deletions. Print functionality is essential - the page includes print-optimized CSS that removes navigation elements and ensures clean formatting on paper. The rendering must preserve chord positioning accuracy across different screen sizes and print media.

### Song Editor Pages

Two distinct but similar editor experiences exist: one for creating new songs and another for editing existing ones. Both share the same core interface but differ in data initialization. The editor presents a form with fields for title, artist, and musical key selection. The heart of the editor is a large textarea where users paste lyrics with chord annotations. The expected format is simple text where chord symbols appear on lines above the lyrics they correspond to. Section headers enclosed in brackets like "[Verse]" or "[Chorus]" help organize the song structure. Users can optionally see a live preview of how their input will render, showing the structured chord sheet as they type. Form validation ensures required fields are completed before submission. The save action triggers the server-side parsing logic that converts raw text into structured JSON format. Error messages guide users if the parsing encounters issues or if required fields are missing.

### Navigation and Layout

A persistent navigation bar spans the top of every page, providing consistent wayfinding. The navigation includes the application name "Harmonia" as a home link, along with primary actions like "New Song" and potentially user profile controls if authentication is added later. The navigation should be responsive, collapsing into a mobile menu on smaller screens. The overall layout uses a root layout component that wraps all pages, providing consistent styling, font loading, and global providers. Dark mode support could be implemented through a theme provider, persisting user preference across sessions.

## Component Architecture

### UI Component Library

The application inherits an extensive collection of shadcn/ui components that provide polished, accessible interface elements. These components follow Radix UI primitives and include buttons, inputs, dialogs, cards, dropdowns, and many others. All components are styled with Tailwind CSS utility classes, creating a cohesive design system. The components live in the components/ui directory and should be used consistently throughout the application to maintain visual and interaction patterns.

### Custom Components

Several application-specific components handle domain logic. The Navigation component manages the top bar and responsive menu behavior. The SongView component is responsible for the complex task of rendering chord sheets - it takes structured song data and outputs the precisely aligned chord-over-lyric layout. This component must handle the mathematics of character positioning, spacing, and responsive behavior while maintaining alignment integrity. Additional components might include SongCard for library display, TransposeControls for key shifting, and SearchBar for filtering the song list.

## State Management and Data Fetching

The application embraces Next.js server components for initial data fetching, eliminating the need for client-side loading spinners on first render. Song lists and individual song data are fetched on the server and streamed to the client. For mutations like creating, updating, or deleting songs, the application uses either server actions or API routes - server actions provide a more integrated experience with automatic revalidation. The existing TanStack Query setup from the old application may be preserved for specific scenarios requiring optimistic updates or client-side caching, but the primary pattern should leverage server-side data fetching. Form submissions use progressive enhancement where possible, functioning even without JavaScript while providing enhanced experiences when it's available.

## Utilities and Helpers

### Chord Utilities

A critical utility module handles chord transposition logic. When a user shifts the key, every chord in the song must be transposed by the corresponding number of semitones. The utility understands music theory: major chords, minor chords, diminished, augmented, sus chords, and various extensions. It preserves chord suffixes while transposing only the root note. The logic accounts for enharmonic equivalents and follows conventions about when to use sharps versus flats. This module is pure and testable, taking a chord string and a semitone offset as input and returning the transposed chord.

### Styling Utilities

A utils module combines Tailwind classes intelligently using tailwind-merge and clsx, preventing style conflicts and enabling conditional class application. This utility is used throughout components for dynamic styling based on state or props.

## Responsive Design

The application must function beautifully across device sizes. The song library adapts from a multi-column grid on desktops to a single column on mobile devices. The chord sheet view maintains readability on small screens, potentially requiring horizontal scrolling for long lines rather than breaking chord alignment. Forms and editors provide comfortable text input areas on touch devices. Navigation collapses into a hamburger menu on mobile. All interactive elements meet touch target size requirements for mobile usability.

## Performance Considerations

Images are optimized using Next.js Image component if album artwork or artist photos are added. The application implements route prefetching for instant navigation between pages. Server components reduce JavaScript bundle size by moving non-interactive rendering to the server. Code splitting ensures users only download JavaScript needed for the current page. Loading states use Suspense boundaries for graceful progressive rendering.

## Accessibility

All interactive elements are keyboard navigable. Form inputs have associated labels and error messages are announced to screen readers. Color contrast meets WCAG AA standards. The chord sheet rendering provides alternative text representations for screen readers since the visual alignment is primarily visual. Focus indicators are clearly visible. Modal dialogs trap focus and can be dismissed with the escape key.

## Future Enhancements

Potential additions include collaborative editing where multiple musicians can work on the same song simultaneously, setlist management for organizing songs for performances, chord diagram visualizations for guitar or piano, audio playback with synchronized chord highlighting, and integration with music notation software.
