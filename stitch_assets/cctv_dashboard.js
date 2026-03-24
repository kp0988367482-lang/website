(function bootstrapCctvDashboard() {
  const params = new URLSearchParams(window.location.search);
  const requestedMode = params.get('mode');
  const refreshIntervalMs = 15000;

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = $(id);
    if (element && value !== undefined && value !== null) {
      element.textContent = value;
    }
  }

  function formatPercent(value) {
    const num = Number(value);
    return Number.isFinite(num) ? `${num.toFixed(1)}%` : '--';
  }

  function formatIsoTime(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleString('sv-SE');
  }

  function modeLabel(mode) {
    return mode ? `MODE: ${String(mode).toUpperCase()}` : 'MODE: --';
  }

  function statusLabel(mode) {
    return mode === 'live' ? 'OpenClaw Live' : 'Fallback Mode';
  }

  function statusColor(mode) {
    return mode === 'live' ? '#10B981' : '#F59E0B';
  }

  function buildStatusUrl() {
    const url = new URL('/cctv-api/status', window.location.origin);
    if (requestedMode) {
      url.searchParams.set('mode', requestedMode);
    }
    return url.toString();
  }

  function renderNodes(sensors) {
    const container = $('cctv-node-list');
    if (!container) {
      return;
    }

    container.innerHTML = '';
    sensors.slice(0, 8).forEach((sensor) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.gap = '12px';

      const label = document.createElement('span');
      label.textContent = sensor.name;
      label.style.fontSize = '11px';

      const meta = document.createElement('span');
      meta.textContent = `${sensor.health}%`;
      meta.style.color = sensor.status === 'active' ? '#10B981' : sensor.status === 'warning' ? '#F59E0B' : '#EF4444';
      meta.style.fontFamily = "'DM Mono', monospace";
      meta.style.fontSize = '11px';

      row.appendChild(label);
      row.appendChild(meta);
      container.appendChild(row);
    });
  }

  function renderMiniFeeds(sensors) {
    const container = $('cctv-mini-feed-grid');
    if (!container) {
      return;
    }

    container.innerHTML = '';
    sensors.slice(1, 5).forEach((sensor, index) => {
      const card = document.createElement('div');
      card.className = 'mini-feed';

      const label = document.createElement('div');
      label.className = 'mini-label';
      label.textContent = `CAM ${String(index + 2).padStart(2, '0')} // ${sensor.name.toUpperCase()}`;

      card.appendChild(label);
      container.appendChild(card);
    });
  }

  function renderLogs(events, warning) {
    const container = $('cctv-log-feed');
    if (!container) {
      return;
    }

    container.innerHTML = '';
    const format = container.dataset.logFormat || 'modern';
    const lines = [];

    if (warning) {
      lines.push({
        time: new Date().toISOString(),
        severity: 'warning',
        message: warning,
        type: 'FALLBACK',
        location: 'Adapter',
      });
    }

    lines.push(...events);

    if (lines.length === 0) {
      lines.push({
        time: new Date().toISOString(),
        severity: 'info',
        message: 'No recent CCTV events available.',
        type: 'IDLE',
        location: 'System',
      });
    }

    lines.slice(0, 8).forEach((event) => {
      const color = event.severity === 'high' || event.severity === 'error'
        ? '#FCA5A5'
        : event.severity === 'warning'
          ? '#FCD34D'
          : format === 'legacy'
            ? '#94A3B8'
            : '#CBD5E1';

      if (format === 'legacy') {
        const row = document.createElement('div');
        row.className = 'log-entry';

        const time = document.createElement('span');
        time.className = 'log-time';
        time.textContent = `[${new Date(event.time).toLocaleTimeString('it-IT')}]`;

        row.appendChild(time);
        row.appendChild(document.createTextNode(` ${event.type} @ ${event.location}`));
        row.style.color = color;
        container.appendChild(row);
        return;
      }

      const row = document.createElement('p');
      row.style.color = color;

      const time = document.createElement('span');
      time.textContent = `[${new Date(event.time).toLocaleTimeString('it-IT')}] `;
      time.style.color = '#2424eb';

      row.appendChild(time);
      row.appendChild(document.createTextNode(`${event.type} @ ${event.location}`));
      container.appendChild(row);
    });
  }

  function renderState(payload) {
    const snapshot = payload.data || {};
    const sensors = Array.isArray(snapshot.sensors) ? snapshot.sensors : [];
    const events = Array.isArray(snapshot.events) ? snapshot.events : [];
    const primary = sensors[0] || {};
    const statusDot = $('cctv-system-status-dot');

    if (statusDot) {
      statusDot.style.backgroundColor = statusColor(payload.mode);
      statusDot.style.boxShadow = `0 0 12px ${statusColor(payload.mode)}`;
    }

    setText('cctv-system-status-text', statusLabel(payload.mode));
    setText('cctv-system-mode', modeLabel(payload.mode));
    setText('cctv-system-health', formatPercent(snapshot.systemHealth));
    setText('cctv-health-detail', `${snapshot.activeSensors || 0}/${snapshot.totalSensors || sensors.length || 0} sensors active`);
    setText('cctv-active-nodes', `${snapshot.activeNodes || 0}/${snapshot.totalNodes || snapshot.activeNodes || 0}`);
    setText('cctv-active-nodes-count', String(snapshot.activeNodes || 0));
    setText('cctv-node-detail', `${payload.backend || 'adapter'}${payload.sourceUrl ? ' synced' : ''}`);
    setText('cctv-primary-sensor', (primary.name || 'No sensor').toUpperCase());
    setText('cctv-primary-source', primary.source || primary.name || payload.backend || 'UNAVAILABLE');
    setText('cctv-primary-location', `LOCATION: ${primary.location || 'Unspecified'}`);
    setText('cctv-primary-timestamp', formatIsoTime(events[0] && events[0].time));
    setText('cctv-backend-label', `BACKEND: ${(payload.backend || 'adapter').toUpperCase()}`);
    setText('cctv-warning-text', payload.warning || '');
    setText('cctv-last-updated', `Last sync ${new Date().toLocaleTimeString('it-IT')}`);

    renderNodes(sensors);
    renderMiniFeeds(sensors);
    renderLogs(events, payload.warning);
  }

  async function refresh() {
    try {
      const response = await fetch(buildStatusUrl(), {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      renderState(payload);
    } catch (error) {
      setText('cctv-system-status-text', 'System Offline');
      setText('cctv-system-mode', modeLabel(requestedMode || 'live'));
      setText('cctv-warning-text', `Unable to load CCTV data: ${error.message}`);
      const statusDot = $('cctv-system-status-dot');
      if (statusDot) {
        statusDot.style.backgroundColor = '#EF4444';
        statusDot.style.boxShadow = '0 0 12px #EF4444';
      }
    }
  }

  refresh();
  window.setInterval(refresh, refreshIntervalMs);
})();
