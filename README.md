
# Team Portfolio AI

AIE312 Final Project — Team Portfolio and AI Chat Application

A web application that presents our team portfolio and provides an AI-powered chat interface. The project uses React and TypeScript for the frontend, with an Express API and PostgreSQL planned for backend and database integration.

## Project Status

| Component | Status |
|---|---|
| React + TypeScript Frontend | Implemented |
| Group Portfolio Page | Implemented (sample data) |
| Interactive Chat UI | Implemented |
| Frontend API Service | Implemented |
| Chat API Contract | Documented |
| Frontend Unit and Component Tests | 25 tests passing |
| GitHub Actions Frontend CI | Passing |
| Express Backend | In development |
| PostgreSQL Integration | Pending |
| AI Model Integration | Pending |
| Production Deployment | Pending |

> The Chat UI is implemented, but real AI responses and persistent chat history are not available until the backend and database are integrated.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Vitest
- React Testing Library

### Planned Backend and Database

- Node.js
- Express
- PostgreSQL

## Repository Structure

```text
team-portfolio-ai/
├── .github/
│   └── workflows/
│       └── frontend-ci.yml
├── docs/
│   └── chat-api-contract.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── backend/             # Backend development area
├── database/            # Database development area
└── README.md
```

Empty directories are not tracked by Git until they contain files.

## Getting Started

### Prerequisites

- Node.js 24 or compatible version
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/waru1549/team-portfolio-ai.git
cd team-portfolio-ai
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm ci
```

### 3. Configure Environment Variables

Copy the example environment file.

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS / Linux:

```bash
cp .env.example .env.local
```

The default development configuration uses the Vite proxy:

```env
API_PROXY_TARGET=http://localhost:3000
VITE_API_BASE_URL=
```

Do not put API keys, passwords, or other secrets in variables prefixed with `VITE_`.

### 4. Start the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite.

> The Portfolio and Chat interfaces can be explored while the frontend runs. Chat API requests require the Express backend to be running.

## Available Frontend Commands

Run these commands inside the `frontend` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run automated tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

## Chat API

The frontend communicates with the backend through:

```http
POST /api/chat
Content-Type: application/json
```

The request and response structures are documented in:

`docs/chat-api-contract.md`

The frontend API service is located at:

`frontend/src/services/chatApi.ts`

## Automated Quality Checks

GitHub Actions runs the Frontend CI workflow when relevant frontend files or the workflow configuration change.

Workflow file:

`.github/workflows/frontend-ci.yml`

The pipeline performs:

1. Checkout Repository
2. Setup Node.js
3. Install Dependencies using `npm ci`
4. Run ESLint
5. Run Automated Tests
6. Build Production App

## Team Portfolio Data

The sample team and member information is maintained in:

`frontend/src/data/portfolioData.ts`

Replace the placeholder names, skills, descriptions, profile links, and contact information with the actual information approved by the team.

## Security Notes

- Never commit `.env.local` or other environment files containing secrets.
- Use `.env.example` to document required environment variables.
- Do not expose private API keys in frontend code.
- Keep credentials and database secrets on the backend.

## Project Repository

GitHub:

https://github.com/waru1549/team-portfolio-ai

## License

This project is developed for academic purposes as part of the AIE312 course.
