# LearnLens Frontend

React app for LearnLens — textbook personalization: build a profile, upload a PDF, get AI summary and study suggestions. The UI came from the interview task; I made the changes below.

## Hosting

- **Frontend:** [https://learnlens-fe.vercel.app/](https://learnlens-fe.vercel.app/)
- **Backend:** [https://learnlens-be.vercel.app](https://learnlens-be.vercel.app)

## Changes I made

- **Step button hover text visibility** — Nav step labels (Intro, Your Profile, Upload, Evaluate) are now readable on hover (fixed contrast).
- **Fixed broken upload page UI** — Upload screen layout and spacing fixed so dropzone, file info, and buttons look correct on all screen sizes.
- **Submit “Personalize” loader** — Added a loading spinner and “Personalizing…” text on the button while the PDF is being processed.
- **Prettier markdown** — Styled the AI result block (headings, lists, code, links) so the summary and suggestions are easier to read.

## Run locally

```bash
npm install
npm run dev
```

Point the app at the backend with a `.env` containing `VITE_API_URL` if needed, or it uses `localhost:8000` by default.
