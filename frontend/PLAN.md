# Teacher Course Platform — Template Foundation

## What this is
A reusable, resellable SaaS template for individual teachers/tutors to sell courses to students.
Each client (teacher) gets their **own deployment** of this codebase — NOT a shared multi-tenant platform.
The goal: build the core once, then re-skin (branding, colors, fonts, enabled features) per client quickly via a single config file.

Target market: Egypt / MENA. Arabic-only UI, RTL layout.

---

## Design Direction

- **Language/Direction:** Arabic only, full RTL (mirrored layout, mirrored icons, right-to-left animation direction, not just `dir="rtl"` on text).
- **Typography:** Bold, calligraphy-influenced display font for headlines (e.g. Rakkas, Aref Ruqaa, or Lalezar) paired with a clean modern Arabic font for body text (e.g. Cairo, IBM Plex Sans Arabic, Tajawal). Confirm final font pairing by testing 2-3 options visually before locking in.
- **Avoid the "generic AI SaaS" look:** no centered-hero + 3-icon-cards + gradient-blob layout, no default indigo/purple gradient palette, no generic rounded-card-with-shadow-everywhere styling, no stock illustration people.
- **Visual identity:** asymmetric section layouts, subtle geometric Arabic/Islamic pattern textures used sparingly as texture (not overused), warm/bold color palette (e.g. deep teal + gold, or terracotta + charcoal — to be finalized with a mood board pass).
- **Animation (a major focus):**
  - Scroll-triggered reveals on landing page sections
  - "Ink stroke" draw-on animations for dividers/logo/headings
  - Smooth page transitions between dashboard views
  - Card hover physics (subtle lift/tilt, not generic scale-up)
  - Library: Framer Motion for React component-level animation, GSAP for landing page hero flourishes and scroll-triggered sequences

---

## Tech Stack

- **Frontend/Backend:** Next.js (App Router) + Tailwind CSS (RTL-configured)
- **Animation:** Framer Motion + GSAP
- **Auth/Database/File Storage:** Supabase (Postgres + Auth + Storage — storage used for PDFs/worksheets/certificates/images)
- **Payments:** Paymob (covers cards, mobile wallets, and Fawry reference codes under one integration — confirm current API details when implementation starts, as payment provider APIs change)
- **Video:** Real video upload + secure streaming via Bunny Stream (or Cloudflare Stream). Teacher uploads the actual video file (not a link). Playback uses **signed, time-limited URLs** generated per logged-in, paying student session — links expire shortly after generation, so they can't be freely shared or reused outside the platform. Cost is usage-based (storage + bandwidth), typically a few dollars/month for a small course catalog — far cheaper than Vimeo's flat monthly plans, and far more secure than plain YouTube/Drive links.
- **Certificates:** Server-side PDF generation from an HTML/CSS template on course completion
- **Hosting:** Vercel (frontend/backend), Supabase cloud (data), each client gets their own instance of both

---

## Core Features (included for every client)

1. **Teacher side**
   - Create/edit courses → organize into modules → lessons
   - Each lesson: upload real video file (processed/hosted via Bunny Stream) + optional file attachments (PDF/worksheets)
   - Set price per course: one-time OR subscription
   - View student enrollments and payment status
   - Create quizzes (attached to a lesson or module)

2. **Student side**
   - Browse available courses (public course catalog page)
   - Purchase via Paymob (one-time or subscription)
   - Access purchased content: video plays via a secure, signed URL generated fresh per session (not a static shareable link)
   - Track lesson completion progress
   - Take quizzes, see auto-graded results
   - Receive auto-generated PDF certificate when a course is fully completed

3. **Payments**
   - One-time purchase: pay once, permanent access
   - Subscription: **manual renewal model** (no true auto-recurring, since Fawry can't auto-charge)
     - App stores an `expires_at` date per subscription
     - Content automatically locks when `expires_at` passes
     - Reminder notification sent a few days before expiry
     - Student manually pays again each period to extend `expires_at`

4. **Quizzes**
   - Multiple choice / true-false questions
   - Auto-graded, attached to a lesson or module
   - Results stored per student, contribute to "completion" status

5. **Certificates**
   - Auto-generated PDF when all modules/quizzes in a course are completed
   - Template includes: student name, course name, teacher name/signature area, completion date
   - Downloadable from student dashboard

---

## Optional Add-on Modules (toggle per client, off by default — upsell potential)

- Student community/comments per lesson
- WhatsApp/email notification integration
- (list grows as new client needs come up — keep these as separate, isolated modules so they don't entangle with core logic)

---

## Per-Client Reskin System

Every client-specific customization should live in ONE config location, so spinning up a new client is:
duplicate template repo → edit config + swap assets → set Paymob keys → deploy.

Config should control:
- Teacher name, bio, photo
- Logo
- Color palette (CSS variables / Tailwind theme tokens)
- Font selection (if variation needed between clients)
- Hero section copy/images
- Which optional add-on modules are enabled
- Paymob API keys (per-client, since each teacher has their own Paymob account/payouts)
- Supabase project keys (per-client, since each teacher has separate data)
- Bunny Stream (or Cloudflare Stream) API key + library ID (per-client, since each teacher's videos are billed/stored separately)

Core application code should NEVER need to be touched to onboard a new client — only this config layer.

---

## Build Stages (for Claude Code to work through incrementally)

1. **Project scaffold** — Next.js + Tailwind (RTL config) + Supabase connection + folder structure + design tokens/config system
2. **Auth** — teacher & student roles, sign up/login/session handling
3. **Teacher dashboard** — course/module/lesson CRUD, video upload flow (upload to Bunny Stream, store video ID), file attachment upload
4. **Student dashboard** — course catalog, purchased content view with secure signed-URL video playback, progress tracking
5. **Payments** — Paymob integration, one-time purchase flow, manual-renewal subscription flow + expiry lock logic, tied to signed-URL video access (no access = no valid signed URL generated)
6. **Quizzes** — creation (teacher side), taking + auto-grading (student side)
7. **Certificates** — PDF generation on course completion
8. **Landing page + design polish** — apply full visual identity, animations, RTL polish, calligraphy-style typography
9. **Add-on modules** — build as isolated, toggleable features
10. **Reskin test** — validate the config-only reskin process actually works end-to-end with a second dummy brand

Each stage should be tested/reviewed before moving to the next. Do not attempt all stages in one session.
