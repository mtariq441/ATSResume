# Premium ATS Resume Analyzer - Design Guidelines

## Design Approach
**Hybrid Approach**: Foundation from Linear's premium dark UI patterns + Vercel's refined aesthetics + Stripe's professional polish. This is a utility tool demanding exceptional visual treatment to justify premium positioning.

**Core Principle**: Luxury utility - every interaction should feel effortless and premium while maintaining information clarity.

---

## Typography

**Font Stack**:
- Primary: Inter (400, 500, 600, 700) via Google Fonts
- Monospace: JetBrains Mono (for scores, metrics)

**Hierarchy**:
- Hero Headline: text-5xl/text-6xl font-bold tracking-tight
- Section Titles: text-3xl/text-4xl font-semibold
- Card Headers: text-xl font-semibold
- Body: text-base/text-lg font-normal
- Labels/Meta: text-sm font-medium
- Captions: text-xs font-normal

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6, p-8
- Section gaps: gap-8, gap-12
- Page margins: py-12, py-16, py-20

**Grid System**:
- Container: max-w-7xl mx-auto
- Results dashboard: 2-column (lg:grid-cols-2) for score breakdown vs recommendations
- Feature showcase: 3-column (lg:grid-cols-3) for capabilities

---

## Component Library

### Hero Section
Full-viewport centered layout (min-h-screen) with gradient backdrop
- Primary CTA: "Analyze Your Resume" (large, prominent)
- Drag-drop zone preview
- Trust indicators below fold: "No signup required • Instant analysis • Free"
- Subtle animated gradient mesh background (dark purples/blues)

### File Upload Zone
Large drag-drop area with dashed border and premium hover states
- Icon: Document upload (Heroicons)
- Accepted formats badge: "PDF, DOC, DOCX"
- File preview card with remove option after upload
- Animated progress bar during processing

### Results Dashboard
Split-pane layout:

**Left Pane (Score Section)**:
- Large circular progress indicator (animated) showing match score 0-100
- Color-coded: 0-59 red, 60-79 amber, 80-100 emerald
- Score breakdown cards (5 metrics) in grid
- Mini bar charts for each category

**Right Pane (Recommendations)**:
- Tabbed interface: "Missing Keywords" | "Add These Bullets" | "Improve Existing"
- Each tab with organized lists, color-coded priorities
- Copy-to-clipboard buttons on each item
- Export to PDF button (premium, prominent)

### Google Reviews Section
Embedded Google review widget in card container
- Section title: "Loved by Job Seekers"
- 5-star rating display
- CTA: "Leave a Review" button
- 3-column testimonial grid above widget (if available)

### Navigation
Minimal top bar:
- Logo/brand left
- CTA button right ("Try It Free")
- Dark glass-morphism effect (backdrop-blur)

### Footer
Clean, organized:
- Brand + tagline
- Quick links (How It Works, Privacy, Contact)
- Social proof: "Trusted by X professionals"

---

## Dark Theme Palette

**DO NOT SPECIFY IN CODE** - Framework only:
- Pure blacks avoided - use near-blacks with slight blue tint
- Elevated surfaces use subtle gradients
- Accent colors: vibrant emerald for success, amber for warnings
- Text: High contrast whites/grays on dark backgrounds
- Borders: Subtle, low-opacity dividers

---

## Visual Effects

**Glass-morphism**: Cards with backdrop-blur and subtle borders
**Gradients**: Mesh gradients in hero, subtle radial gradients on hover
**Shadows**: Layered shadows for depth (avoid harsh shadows)
**Animations**: Minimal, purposeful:
- Score counter animation
- Progress bar fill
- Fade-in for results
- Smooth transitions (200ms standard)

---

## Accessibility
- WCAG AAA contrast ratios for dark theme
- Focus indicators with visible outlines
- Keyboard navigation throughout
- ARIA labels on all interactive elements
- Screen reader announcements for score updates

---

## Images
**Hero Background**: Abstract gradient mesh or geometric pattern (dark purples, blues, teals) - subtle, not distracting
**Feature Icons**: Use Heroicons (outline style) - consistent throughout
**No photography needed** - this is a tool-focused application

---

## Key Differentiators
1. **Premium loading states**: Skeleton screens with shimmer effects, not spinners
2. **Micro-interactions**: Subtle scale on card hover, smooth color transitions
3. **Data visualization**: Custom-styled charts (not default library styles)
4. **Spatial luxury**: Generous whitespace, uncluttered layouts
5. **Typography excellence**: Perfect hierarchy, optimal line-height/spacing

This creates a world-class, $100K-worthy product that users will love using instantly without barriers.