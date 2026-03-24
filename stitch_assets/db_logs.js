/**
 * System Revision & Event Logger (修蹤紀錄裝置)
 * Responsible for recording significant events and environmental detections.
 */
window.SystemLogger = {
    STORAGE_KEY: 'SEOULMATE_SYSTEM_LOGS',

    log(event, details = {}) {
        const logs = this.getLogs();
        const newEntry = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent
        };
        logs.push(newEntry);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        console.log(`[SYSTEM REGISTRY] Recorded: ${event}`, details);
    },

    getLogs() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    clearLogs() {
        if (confirm('確定要永久刪除所有系統修蹤紀錄？')) {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        }
        return false;
    }
};

// Auto-log page visits with path detection (作業位置感測)
(function detectEnvironment() {
    const path = window.location.pathname;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Condition 2: Work Path Detection (作業位置路徑感測)
    if (path.includes('무제 폴더') || path.includes('backup') || path.includes('admin')) {
        window.SystemLogger.log('PATH_SENSE_TRIGGER', {
            detectedPath: path,
            origin: window.location.origin,
            environment: isLocal ? 'DEVELOPMENT' : 'PRODUCTION'
        });
    }
})();
