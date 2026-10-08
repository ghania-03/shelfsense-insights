# Shelf IQ

Shelf IQ is a frontend dashboard for exploring retail product performance, shelf-space allocation, and store layouts. It currently uses sample data and runs entirely in the browser.

## Overview

The interface brings together retail analysis views and tools for exploring and exporting dashboard data. It is a frontend prototype: it does not connect to a backend or a live data service.

## Features

- Dashboard with store and date-range filters
- Product tail analysis
- Space elasticity views and recommendations
- Store heatmap visualization
- CSV data import interface and CSV exports
- Login and signup flows backed by in-memory demo users
- Settings, theme selection, and browser-local preferences

The dashboard's current data is defined in `src/data/mockData.ts`. Import and authentication flows are client-side demonstrations, not connections to a server.

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Radix UI and shadcn/ui components
- Lucide icons

## Project structure

```text
shelfsense-insights/
├── public/           Static assets
├── src/
│   ├── components/   Shared layout, navigation, and UI components
│   ├── contexts/     Authentication, data, settings, and theme state
│   ├── data/         Sample retail data
│   ├── pages/        Dashboard, analysis, import, and settings screens
│   └── utils/        Export helpers
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Run locally

Requirements: Node.js and npm.

```sh
git clone https://github.com/ghania-03/shelfsense-insights.git
cd shelfsense-insights
npm install
npm run dev
```

Vite serves the development app on port `8080` by default. No environment variables are required.

To create a production build locally, run `npm run build`. This command builds the frontend; it does not deploy or connect the project to a hosted service.

## Current limitations

- Retail data is sample data bundled with the frontend.
- Authentication is a local demo flow and is not server-backed.
- Imported data and preferences are handled in the browser; there is no backend or live API.
