# Virat Kohli: Batting Masterclass Analysis & Live Stat Synchronizer

A high-fidelity, interactive technical analysis dashboard and live statistics tracking system dedicated to the tactical play and biomechanical excellence of Virat Kohli. This application is a full-stack project built using **React 19, TypeScript, Tailwind CSS, and Express**, backed by server-side **Google Search Grounding via the Gemini API** to automatically synchronize career IPL stats and match aggregates in the background.

---

## 🚀 Core Features

- 🏏 **Biomechanical Alignment Engine**: Explore detailed posture analyses comparing neutral equilibrium stances (Kohli) with pre-leaning setups typical of hyper-aggressive short-form batters (e.g., Vaibhav Sooryavanshi).
- 🧬 **Kinematic Delivery Grid**: Interactive ball-by-ball pitch selector mapped to different match phases (Powerplay, Middle Overs, Death Overs). Visualizes how Kohli neutralizes targeted bowler lines.
- 🔄 **Ecosystem Live Synchronizer**: A server-side background worker that runs periodically to fetch, crawl, and verify live IPL updates and career statistics using Google Search Grounding, updating the frontend in real time.
- 📋 **Tactical PDF & Data Exporter**: Generate and download detailed textual briefing briefs or comprehensive biomechanical assessment reports as PDF files dynamically.
- 📊 **Efficiency Frontiers**: Visual charts demonstrating Strike Rate vs. Average Efficiency Frontiers across different seasons.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **Backend**: Express (Node.js) with server-side Typescript (`tsx`)
- **AI Integrations**: @google/genai SDK leveraging Gemini Search Grounding
- **Build System**: `esbuild` for bundling the Node.js server to single-file ES Modules, Vite for the static assets package.

---

## 🏃 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Set Up Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
GEMINI_API_KEY="your_api_key_here"
```

> 💡 **API Key Access**: This key remains completely confidential on the server side and is never exposed to the client browser.

### 3. Install Dependencies
Install packages for both the client and server:
```bash
npm install
```

### 4. Running the Development Server
This starts the TypeScript Express backend with a hot-reloaded Vite server on port `3000`:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Build & Start for Production
To bundle assets for a production-ready container or direct server host deployment:
```bash
# Build both frontend static assets and server.ts CJS output
npm run build

# Start the compiled production server
npm run start
```

---

## 📂 Project Structure

```text
├── server.ts             # Express backend with background sync grounding worker
├── src/
│   ├── App.tsx           # Primary dashboard UI and client fetch managers
│   ├── main.tsx          # Client entry point
│   ├── index.css         # Typography configuration and Tailwind inputs
│   ├── data.ts           # Tactical briefs, career history, and static datasets
│   └── components/       
│       └── KinematicSnapshots.tsx  # Dynamic anatomical canvas models
├── package.json          # Dependency manifest and compiler runner script
└── tsconfig.json         # TypeScript compiler configurations
```
