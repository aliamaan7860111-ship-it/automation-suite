# Careers Site

Public-facing careers + investor relations site for the holding company. Notion-backed job listings and inquiries, custom WebGL hero, 3-stage application flow with file uploads.

## Stack

- **Next.js 15** (App Router, Turbopack)
- **Tailwind CSS v4**
- **Framer Motion** (scroll choreography, page transitions)
- **shadcn/ui** for accessible primitives
- **Notion API** as the headless CMS for openings + inquiries
- **UploadThing** for resume/PDF uploads
- **Three.js** for the hero globe

## Highlights

- [src/app/page.tsx](src/app/page.tsx) — landing page with radial-orbital timeline + premium aurora background
- [src/components/HeroGlobe.tsx](src/components/HeroGlobe.tsx) — interactive WebGL globe
- [src/components/ui/radial-orbital-timeline.tsx](src/components/ui/radial-orbital-timeline.tsx) — custom SVG timeline of company divisions
- [src/app/apply/page.tsx](src/app/apply/page.tsx) — multi-step application form, server actions for file uploads
- [src/app/api/apply/route.ts](src/app/api/apply/route.ts) — creates a Notion page in the Applicants DB

## Run

```bash
npm install
cp .env.example .env.local      # fill in NOTION_API_KEY, UPLOADTHING_TOKEN, etc.
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
npm start
```
