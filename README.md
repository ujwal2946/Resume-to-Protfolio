# Resume to Portfolio

A web application that turns resume content into a portfolio experience. It is built with React, TypeScript, Vite, Express, Tailwind CSS, and the Google GenAI SDK.

## Technology stack

| Area | Technology |
| --- | --- |
| Front end | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Server | Express, tsx |
| AI integration | Google GenAI SDK |
| Resume parsing | Mammoth for DOCX, pdf-parse for PDF |
| Icons and animation | Lucide React, Motion |

## Prerequisites

- Node.js 18 or later
- npm
- A Google Gemini API key

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ujwal2946/Resume-to-Protfolio.git
cd Resume-to-Protfolio
npm install
```

## Environment configuration

Create a `.env.local` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Keep this key private. Do not commit `.env.local` to Git.

## Run locally

Start the development server:

```bash
npm run dev
```

The terminal will show the local URL for the application.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server through `tsx server.ts` |
| `npm run build` | Builds the Vite client and bundles the Express server |
| `npm start` | Runs the built server from `dist/server.cjs` |
| `npm run lint` | Type-checks the project with TypeScript |
| `npm run clean` | Removes generated build files |

## Production build

Create a production build, then run it:

```bash
npm run build
npm start
```

## Notes

- The project uses the Google GenAI SDK, so AI-powered features require a valid `GEMINI_API_KEY`.
- DOCX and PDF dependencies indicate support for resume-document processing.
- The existing AI Studio project link is available at [Google AI Studio](https://ai.studio/apps/1bd0a519-a714-4add-b40c-029ca4a2cc8a).

## Contributing

Before submitting a change, run:

```bash
npm run lint
npm run build
```

Then describe the user-facing impact of the change in your pull request.
