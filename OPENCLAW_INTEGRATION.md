# OpenClaw Integration Guide

## Overview

OpenClaw 是一套完整的實時通信和監控系統。本文檔說明如何將 SeoulMate 的 CCTV 監控面板與 OpenClaw Node 系統整合。

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│ SeoulMate Web (Frontend)                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ CCTV Dashboard (cctv_dashboard_v2.html)              │ │
│ │ - Live monitoring UI                                │ │
│ │ - Real-time alerts                                  │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/WebSocket
                       ▼
┌─────────────────────────────────────────────────────────┐
│ SeoulMate Backend (paypal_server.js)                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ /cctv-api/* endpoints                               │ │
│ │ - Controlled fallback mode (`mock`)                 │ │
│ │ - Live OpenClaw adapter (`live`)                    │ │
│ │ - Automatic live->fallback failover (`auto`)        │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│ OpenClaw Node System (openclaw_src/)                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Real-time monitoring & alerting                     │ │
│ │ Multi-sensor integration                            │ │
│ │ Event logging & analytics                           │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Setup Steps

### 1. Enable OpenClaw Backend (Optional)

Add to `.env`:
```bash
CCTV_DATA_MODE=auto
OPENCLAW_API_URL=http://localhost:9000
OPENCLAW_API_KEY=your-api-key-here
# Optional path overrides when OpenClaw uses non-default routes
# OPENCLAW_STATUS_PATH=/status
# OPENCLAW_HEALTH_PATH=/health
# OPENCLAW_SENSORS_PATH=/sensors
# OPENCLAW_EVENTS_PATH=/events
```

Modes:
- `mock`: always use bundled fallback CCTV data.
- `live`: always call `OPENCLAW_API_URL` and return an error if OpenClaw is unavailable.
- `auto`: try OpenClaw first, then fall back to local data if the upstream is unavailable.

Request override:
```bash
GET /cctv-api/status?mode=mock
GET /cctv-api/status?mode=live
```

### 2. CCTV API Endpoints

#### Get System Status
```bash
GET /cctv-api/status
# Returns: { status: 'fallback'|'integrated', mode: 'mock'|'live', backend: '...', data: {...} }
```

#### Get System Health
```bash
GET /cctv-api/health
# Returns: { systemHealth: 98.5, activeNodes: 12, totalSensors: 8, activeSensors: 7 }
```

#### Get All Sensors
```bash
GET /cctv-api/sensors
# Returns: Array of sensor objects with id, name, status, health, recording
```

#### Get Recent Events
```bash
GET /cctv-api/events?limit=10
# Returns: Array of event logs (motion, door_open, errors, etc.)
```

### 3. Real-time WebSocket Integration (Future)

The CCTV dashboard can be enhanced with WebSocket support for real-time alerts:

```javascript
const ws = new WebSocket('ws://localhost:3000/cctv-ws');
ws.onmessage = (event) => {
    const alert = JSON.parse(event.data);
    // Handle real-time alert
};
```

## Testing

### 1. Check CCTV API Availability
```bash
npm run check-env
```

### 2. Test Fallback Data
```bash
curl "http://localhost:3000/cctv-api/health?mode=mock"
curl "http://localhost:3000/cctv-api/sensors?mode=mock"
curl "http://localhost:3000/cctv-api/events?mode=mock"
```

### 3. Test Live OpenClaw Data
```bash
curl "http://localhost:3000/cctv-api/status?mode=live"
curl "http://localhost:3000/cctv-api/health?mode=live"
```

### 4. View Dashboard
Open browser: `http://localhost:3000/cctv_dashboard_v2.html`

## Integration Roadmap

- [ ] WebSocket support for real-time updates
- [x] OpenClaw native adapter
- [ ] Event replay and forensics
- [ ] Multi-tenant sensor management
- [ ] Alert routing to Slack/Discord/Email
- [ ] Analytics and reporting

## Troubleshooting

**Q: Dashboard shows "System Offline"**
- Check: `npm run doctor`
- Verify: `/cctv-api/status` returns 200

**Q: No sensor data visible**
- Ensure: `OPENCLAW_API_URL` is set correctly (if using real backend)
- Check: `CCTV_DATA_MODE` is `live`, `mock`, or `auto`
- Or: Fallback mode is active because OpenClaw is unavailable

**Q: WebSocket connection fails**
- Not yet implemented; check roadmap above

## References

- [OpenClaw Repository](../openclaw_src/CLAUDE.md)
- [CCTV Dashboard](../stitch_assets/cctv_dashboard_v2.html)
- [API Server](../paypal_server.js)
