Perfect, TailAdmin V2 is a solid choice.
Here’s a big, dense but concise spec you can paste into Claude Code / Cursor as “project rules”.

No code, just structure + instructions.

⸻

0. Context: What we’re building

Product: SaaS “Coaching OS” for 1:1 and group coaches.
Users (MVP): Coaches only (clients will come later).
Core idea: A clean dashboard where a coach can see:
	•	Today’s sessions & tasks
	•	Their clients and status
	•	Programs/packages
	•	Notes & progress

Monetization, AI features, and client portal come later.

⸻

1. Tech + Template Rules

Stack:
	•	Next.js (latest stable App Router)
	•	Tailwind CSS
	•	TypeScript
	•	TailAdmin V2 (Next.js version) as the base UI kit

Global rules for the AI (Claude/Cursor):
	•	Always prefer clarity over cleverness.
	•	Small, composable components. No giant files.
	•	Do not introduce extra libraries unless explicitly requested.
	•	Keep everything framework-native (no Redux, no heavy state libs for MVP).
	•	Prefer Server Components for data-fetch + rendering where possible, Client Components only for interactive bits (forms, modals, filters, etc.).
	•	Avoid magic abstractions. Use straightforward folders, descriptive names.

⸻

2. High-Level Architecture

2.1 App structure (App Router)

Use a simple route structure:
	•	/ → Landing / “Welcome Coach” (placeholder for now)
	•	/dashboard → Main coach dashboard (home)
	•	/clients → List of all clients
	•	/clients/[clientId] → Client profile page
	•	/sessions → All sessions (list / timeline)
	•	/programs → Programs/packages the coach offers
	•	/billing → Subscription status, plan, Stripe links (later)
	•	/settings → Basic account & profile settings

Each route should have:
	•	Main layout using TailAdmin’s sidebar/topbar.
	•	Clear page title + breadcrumbs (if TailAdmin includes them).
	•	Consistent spacing and typography.

2.2 Layers / Modules

Organize code in conceptual layers:
	•	app/ → Routes + top-level layouts
	•	components/ → Reusable UI (buttons, cards, tables, forms)
	•	features/ → Feature modules (clients, sessions, programs, billing) containing:
	•	UI components
	•	hooks (if needed)
	•	types
	•	lib/ → Shared utilities (date formatting, mapping, constants, fake data generators)
	•	config/ → App-wide config (app name, navigation config, feature flags)

For now, use mock data in lib/mockData to simulate backend until real DB/auth is added.

⸻

3. MVP Feature Scope (Functionally)

3.1 Entities (Conceptual Models, no code)

Define these models conceptually so UI is consistent:
	1.	Coach (User)
	•	id
	•	name
	•	email
	•	avatarUrl (optional)
	•	timezone (optional, default system)
	2.	Client
	•	id
	•	coachId
	•	name
	•	email (optional)
	•	phone (optional)
	•	tags (e.g., “VIP”, “New”, “Integration”)
	•	status (Active, Paused, Completed, Lead)
	•	createdAt
	3.	Program
	•	id
	•	coachId
	•	name
	•	description
	•	type (1:1, Group, Hybrid)
	•	price (number)
	•	currency
	•	numberOfSessions (optional)
	4.	Session
	•	id
	•	coachId
	•	clientId
	•	programId (optional)
	•	dateTime
	•	durationMinutes
	•	status (Scheduled, Completed, Cancelled)
	•	location (Online, In-person, or link text)
	5.	Note
	•	id
	•	coachId
	•	clientId
	•	sessionId (optional)
	•	title (optional)
	•	content (free text)
	•	createdAt

Use these entities consistently across pages, mock data, and UI labels.

⸻

4. Screens to Build (In Order)

Screen 1: /dashboard – Coach Overview

Purpose: Coach sees the most important info at a glance.

Sections (use TailAdmin cards & grids):
	•	“Today’s Schedule”
	•	List of upcoming sessions for today (time, client name, program, status)
	•	“Clients Overview”
	•	Small stats cards: total clients, active clients, new this month
	•	“Programs Summary”
	•	Cards showing 3–4 main programs (name, # active clients, average price)
	•	“Recent Notes”
	•	List of last 5 notes taken (client, date, note title/preview)

Rules:
	•	Keep layout simple: 2–3 columns max on desktop, stack on mobile.
	•	Use TailAdmin’s built-in components (cards, tables, badges, etc.).
	•	Avoid special filters here initially — basic static view from mock data is fine.

⸻

Screen 2: /clients – Clients List

Purpose: Coach manages their clients.

Elements:
	•	Page header: “Clients” + count
	•	Primary CTA: “Add Client” (opens a modal or appears as future behaviour; for now can be a non-functional placeholder with standard UI)
	•	Table of clients with columns:
	•	Name
	•	Status
	•	Tags
	•	Last Session (string like “3 days ago” or date)
	•	Next Session (date/time or “None”)

Features (MVP):
	•	Simple search box at top to filter by name (front-end only, mock).
	•	Basic status badge styling (Active, Lead, Completed, Paused).

Click row → navigate to /clients/[clientId].

⸻

Screen 3: /clients/[clientId] – Client Profile

Purpose: Single client view with everything in one place.

Layout (2 columns on desktop, stacked on mobile):

Left side:
	•	Client header card:
	•	Name
	•	Status badge
	•	Tags
	•	Contact info
	•	“Programs with this client”
	•	List of programs they are in
	•	“Upcoming Sessions” for this client

Right side:
	•	“Timeline” or “Notes”
	•	List of notes (sorted newest first)
	•	Show createdAt and small preview
	•	Optional: small sessions history list below notes

MVP actions:
	•	Buttons for “New Note” and “Schedule Session” (UI only now).
	•	Use TailAdmin modal or drawer look (even if non-functional yet).

⸻

Screen 4: /sessions – Sessions List

Purpose: View and manage all sessions.

UI:
	•	Page header: “Sessions”
	•	Filters row:
	•	Date range (simplified, like a select or “All / Today / This week”)
	•	Status dropdown (All, Scheduled, Completed, Cancelled)
	•	Table columns:
	•	Date & Time
	•	Client
	•	Program (or “—”)
	•	Status
	•	Location

Later this can evolve into a calendar-style view, but for MVP keep it a table.

⸻

Screen 5: /programs – Programs

Purpose: Coach sees and manages offerings.

UI:
	•	Grid of program cards:
	•	Name
	•	Type (1:1, Group, Hybrid)
	•	Price
	•	Clients currently in it (from mock data)

CTA: “Create Program” (UI-only placeholder for now).

⸻

Screen 6: /billing & /settings (Skeletons)

For MVP:
	•	/billing:
	•	Show current plan: “Free / Pro (Placeholder)”
	•	Show dummy “Upgrade to Pro” button (no real Stripe yet)
	•	/settings:
	•	Basic placeholders:
	•	Name
	•	Email
	•	Timezone
	•	Non-functional form, just show UI.

These exist so routing & layout are ready for when billing/auth are added.

⸻

5. Design & Component Rules

General UI Rules
	•	Use TailAdmin’s typography, spacing, and colors.
	•	Avoid creating custom CSS unless necessary; rely on Tailwind utilities.
	•	Keep pages visually light: white/light cards, enough spacing, no clutter.
	•	Use consistent naming for labels:
	•	“Client” not “Customer”
	•	“Program” not “Package” (or pick one and stick with it).

Components

Create reusable components in a components/ folder (names conceptual):
	•	PageHeader (title, optional actions area)
	•	StatCard (number + label + icon placeholder)
	•	EntityTable (for clients, sessions, etc. but keep generic)
	•	StatusBadge (for client/session status)

Use these across pages to keep a coherent design system.

⸻

6. Data / State Strategy (for now)

For MVP UI iteration phase:
	•	Use mock data only, no real backend yet.
	•	Place mock data and simple helper functions in a folder like lib/mockData.
	•	All filtering, search, and status changes are front-end local only.

Goals of this phase:
	•	Validate flows.
	•	Lock down layout.
	•	Make sure it feels like a real product visually.

Backend (auth + DB + Stripe) comes after UI is stable.

⸻

7. Work Method for Claude/Cursor

Rules for how Claude/Cursor should work on this repo:
	1.	One task at a time
	•	Example: “Implement /clients list page using TailAdmin and mock data.”
	•	Don’t redesign everything in a single change.
	2.	Preserve structure
	•	Don’t move files around unless explicitly instructed.
	•	Don’t rename routes or entities without a clear reason.
	3.	No surprise dependencies
	•	Don’t add new libraries or tools unless explicitly requested (e.g., don’t add Zustand, Redux, or form libraries by default).
	4.	Keep components small
	•	If a file gets large or complex, split into smaller components in the same folder.
	5.	Types before logic
	•	Define or re-use TypeScript types for entities (Client, Session, etc.) conceptually before building UI that uses them, so everything remains consistent.
	6.	Explain structural changes in plain language
	•	When changing multiple files, include a short human-readable explanation of what changed and why (for you, not in code comments).
	7.	Do not implement real auth/billing yet
	•	For now, everything assumes a single coach logged in.
	•	Leave clear TODO markers in comments or descriptions when something is auth/billing dependent.

⸻

8. Development Phases (So AI Doesn’t Jump Ahead)

Phase 1 – UI Skeleton
	•	Setup TailAdmin V2 in Next.js.
	•	Implement layout with sidebar & topbar.
	•	Create stub pages:
	•	/dashboard, /clients, /clients/[clientId], /sessions, /programs, /billing, /settings.
	•	Add navigation items.

Phase 2 – Mocked Data & Realistic UI
	•	Implement mock data for Coach, Clients, Sessions, Programs, Notes.
	•	Fill out UI of all pages using mock data.
	•	Make simple search/filter interactions (front-end only).

Phase 3 – UX Polishing
	•	Pass through all pages:
	•	Check spacing, responsiveness, clarity.
	•	Ensure consistent naming, capitalization, labels.

Phase 4 – Backend & Auth (later)
	•	Only after UX is solid:
	•	Choose backend (Supabase, custom API, etc.).
	•	Implement auth, DB models, and Stripe.

⸻

You can now tell Claude/Cursor something like:

“Here are the project rules/spec for my Coaching Platform UI built on TailAdmin V2. Start at Phase 1: set up the TailAdmin layout and create the routes and basic page structures described, using mocked data and no real backend yet.”

And it should have a very clear, opinionated map of how to proceed.