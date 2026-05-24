# Study Tasks App

Minimal full-stack starter: ASP.NET Core Web API + React (Vite).

## Structure

```
backend/   ASP.NET Core Web API
frontend/  React + TypeScript (Vite)
```

## Run locally

**API** (http://localhost:5044):

```bash
cd backend
dotnet run
```

**Frontend** (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/tasks` requests to the backend.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{ "title": "..." }`) |
| PUT | `/tasks/{id}/toggle` | Toggle completed state |
