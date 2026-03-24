# Seoualmate Start Here

## Fastest Local Run

### Landing Only

```bash
npm run dev
```

### Backend

```bash
cd apps/core/backend
.venv/bin/python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Core Frontend

```bash
cd apps/core/frontend
npm run dev
```

### Landing

```bash
cd apps/landing
npm run dev
```

### Admin

```bash
cd apps/admin
npm run dev
```

## Verify

```bash
curl http://127.0.0.1:8000/health
```

Expected result:

```json
{"status":"ok"}
```
