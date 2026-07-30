# Teacher SaaS Template

A fully functional, reskinnable SaaS platform template tailored for individual Arabic-speaking educators and tutors. This project provides a complete end-to-end learning management system (LMS) including courses, video lessons, quizzes, certificates, payments, and an admin dashboard.

## Overview

This application is designed to be easily re-deployed for different teachers ("clients") by simply updating a single configuration file, without needing to modify the core application logic or styling system.

## Setup & Environment Variables

To run the project locally, you need to set up the appropriate environment variables. Copy the example file to create your local environment configuration:

```bash
cp .env.example .env.local
```

Required environment variables include:
- Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Paymob integration keys for payment processing
- Bunny.net credentials for secure video streaming

Please refer to `.env.example` for the complete list of required keys.

## Database & Migrations

This project uses [Supabase](https://supabase.com) for its database, authentication, and storage.

To apply the database schema and migrations to your local or remote Supabase instance:

1. Ensure you have the Supabase CLI installed.
2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
3. Push the migrations to the database:
   ```bash
   supabase db push
   ```

## Onboarding a New Teacher Client (Reskinning)

This template is built with a configuration-driven theming and content system. To deploy this app for a new client, you **only** need to edit the configuration file.

1. Open `config/site.config.ts`.
2. Update the `teacher` object with the new client's name, bio, subject, and photo URL.
3. Update the `theme.colors` object to match the client's branding. The app's CSS variables will automatically update based on this config.
4. Update the `hero`, `features`, `stats`, `testimonials`, and `faq` content.
5. Provide the client's specific third-party integration keys (like Paymob) in their secure environment variables.

> **Note on Fonts:** While colors and content are fully dynamic, changing the application's typography (fonts) currently requires manually updating the `next/font/google` imports in `app/layout.tsx`.

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
