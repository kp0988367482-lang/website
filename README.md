# Seoualmate

Website workspace for the Seoualmate product.

## Structure

- `apps/core/backend` - FastAPI API
- `apps/core/frontend` - member dashboard
- `apps/landing` - marketing site
- `apps/admin` - admin dashboard

## Quick Start

### Fastest

```bash
npm run dev
```

This starts the landing site.

### 1. Backend

```bash
cd apps/core/backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontends

Core:

```bash
cd apps/core/frontend
npm install
npm run dev
```

Landing:

```bash
cd apps/landing
npm run dev
```

Admin:

```bash
cd apps/admin
npm run dev
```

## Notes

- API health check: `http://127.0.0.1:8000/health`
- Backend uses SQLite locally and seeds sample profiles on startup.
- Optional Firebase support uses `FIREBASE_SA` or `FIREBASE_SA_JSON`.
