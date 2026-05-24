# Study Tasks App

Minimal full-stack starter: ASP.NET Core Web API + React (Vite) + PostgreSQL.

## Structure

```
backend/
  Data/AppDbContext.cs
  Entities/StudyTask.cs
  Migrations/
frontend/  React + TypeScript (Vite)
```

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- PostgreSQL running locally

Create the database (or let migrations create the schema on first run):

```sql
CREATE DATABASE studytasks;
```

Update the connection string in `backend/appsettings.Development.json` if your credentials differ.

## Run locally

**API** (http://localhost:5044):

```bash
cd backend
dotnet run
```

Migrations are applied automatically in Development.

**Frontend** (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/tasks` requests to the backend.

## Database migrations

```bash
cd backend
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{ "title": "..." }`) |
| PUT | `/tasks/{id}/toggle` | Toggle completed state |
