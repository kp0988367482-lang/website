// ============================================================
// db.js — SeoulMate Local Database (LocalStorage Engine v2.0)
// Manages: Users, Orders, Sessions, Subscription Status
// ============================================================

window.FutureDB = {

    // ── KEYS ──────────────────────────────────────────────
    KEYS: {
        users: 'sm_users',
        orders: 'sm_orders',
        session: 'sm_session',
        inquiries: 'sm_inquiries',
    },

    // ── HELPERS ───────────────────────────────────────────
    _get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    },
    _set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },

    // ── USER MANAGEMENT ───────────────────────────────────
    getUsers() { return this._get(this.KEYS.users); },

    findUserByEmail(email) {
        return this.getUsers().find(u => u.email === email.trim().toLowerCase()) || null;
    },

    authenticate(email, password) {
        const user = this.findUserByEmail(email);
        if (user && user.password === password) {
            this.startSession(user);
            return user;
        }
        return null;
    },

    clearUsers() {
        localStorage.removeItem(this.KEYS.users);
        console.log('🗑️ All users cleared');
    },

    // ── SESSION MANAGEMENT ────────────────────────────────
    startSession(user) {
        const session = { userId: user.id, email: user.email, name: user.name, plan: user.plan, loginAt: new Date().toISOString() };
        localStorage.setItem(this.KEYS.session, JSON.stringify(session));
        if (window.SystemLogger) SystemLogger.log('SESSION_START', { email: user.email });
        return session;
    },

    getSession() {
        try { return JSON.parse(localStorage.getItem(this.KEYS.session)); }
        catch { return null; }
    },

    endSession() {
        const session = this.getSession();
        if (window.SystemLogger && session) SystemLogger.log('SESSION_END', { email: session.email });
        localStorage.removeItem(this.KEYS.session);
    },

    isLoggedIn() {
        return !!this.getSession();
    },

    // ── ORDER MANAGEMENT ──────────────────────────────────
    getOrders() { return this._get(this.KEYS.orders); },

    getUserOrders(email) {
        return this.getOrders().filter(o => o.email === email);
    },

    clearOrders() {
        localStorage.removeItem(this.KEYS.orders);
        console.log('🗑️ All orders cleared');
    },

    // ── FIREBASE SYNC ─────────────────────────────────────
    async syncToFirebase(collectionName, docId, data) {
        const sdk = window.FirebaseSDK;
        if (!sdk?.db || typeof sdk.doc !== 'function' || typeof sdk.setDoc !== 'function') {
            console.warn(`[FutureDB] Firebase not configured, skipping sync for ${collectionName}/${docId}`);
            return;
        }
        try {
            const { db, doc, setDoc } = sdk;
            await setDoc(doc(db, collectionName, docId), {
                ...data,
                syncedAt: new Date().toISOString()
            }, { merge: true });
            console.log(`✅ [FutureDB] Synced to Firebase: ${collectionName}/${docId}`);
        } catch (err) {
            console.warn(`⚠️ [FutureDB] Firebase sync skipped (normal):`, err.message);
        }
    },

    // ── USER MANAGEMENT ───────────────────────────────────
    saveUser(userData) {
        const users = this._get(this.KEYS.users);
        const existing = users.findIndex(u => u.email === userData.email);
        const record = {
            id: existing >= 0 ? users[existing].id : 'u_' + Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            plan: userData.plan || 'free',
            joinedAt: existing >= 0 ? users[existing].joinedAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subscription: {
                active: userData.plan && userData.plan !== 'free',
                planName: userData.plan || 'free',
                expiresAt: userData.plan && userData.plan !== 'free'
                    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    : null,
            }
        };

        if (existing >= 0) users[existing] = record;
        else users.push(record);

        this._set(this.KEYS.users, users);
        if (window.SystemLogger) SystemLogger.log('USER_SAVED', { email: record.email, plan: record.plan });

        // 背景同步至 Firebase（非阻塞，不影響同步回傳）
        this.syncToFirebase('users', record.email, record);
        return record;
    },

    // ── ORDER MANAGEMENT ──────────────────────────────────
    saveOrder(orderData) {
        orderData.id = orderData.id || 'ord_' + Date.now();
        orderData.timestamp = new Date().toISOString();
        const orders = this._get(this.KEYS.orders);
        orders.push(orderData);
        this._set(this.KEYS.orders, orders);

        if (window.SystemLogger) SystemLogger.log('ORDER_SAVED', { id: orderData.id, amount: orderData.amount });
        console.log('✅ Order saved locally:', orderData);

        // 背景同步至 Firebase（非阻塞）
        this.syncToFirebase('orders', orderData.id, orderData);
        return orderData;
    },

    // ── INQUIRY MANAGEMENT ─────────────────────────────────
    getInquiries() { return this._get(this.KEYS.inquiries); },

    saveInquiry(data) {
        data.id = data.id || 'inq_' + Date.now();
        data.submittedAt = data.submittedAt || new Date().toISOString();
        data.status = data.status || 'pending';
        const list = this._get(this.KEYS.inquiries);
        list.push(data);
        this._set(this.KEYS.inquiries, list);
        if (window.SystemLogger) SystemLogger.log('INQUIRY_SAVED', { id: data.id, type: data.type });
        return data;
    },

    updateInquiryStatus(id, status) {
        const list = this._get(this.KEYS.inquiries);
        const idx = list.findIndex(i => i.id === id);
        if (idx >= 0) {
            list[idx].status = status;
            list[idx].updatedAt = new Date().toISOString();
            this._set(this.KEYS.inquiries, list);
        }
    },

    clearInquiries() {
        localStorage.removeItem(this.KEYS.inquiries);
        console.log('🗑️ All inquiries cleared');
    },

    // ── BACKEND SYNC ─────────────────────────────────────
    async syncWithBackend(email) {
        if (!email) return null;
        try {
            console.log(`[FutureDB] Syncing data for ${email}...`);
            const resp = await fetch(`/api/user/status?email=${encodeURIComponent(email)}`);
            if (!resp.ok) { console.warn('[FutureDB] Backend sync unavailable:', resp.status); return null; }
            const data = await resp.json();
            
            // 更新本地用戶記錄
            const users = this._get(this.KEYS.users);
            const idx = users.findIndex(u => u.email === email);
            if (idx >= 0) {
                users[idx].plan = data.plan;
                users[idx].isActive = data.isActive;
                users[idx].name = data.name || users[idx].name;
                this._set(this.KEYS.users, users);
            }

            // 如果是當前 Session，也更新 Session
            const session = this.getSession();
            if (session && session.email === email) {
                session.plan = data.plan;
                session.isActive = data.isActive;
                localStorage.setItem(this.KEYS.session, JSON.stringify(session));
            }
            
            // 同步訂單 (Prisma -> LocalStorage)
            if (data.orders) {
                const localOrders = this._get(this.KEYS.orders);
                data.orders.forEach(remoteOrder => {
                    const exists = localOrders.find(lo => 
                        (remoteOrder.paypalOrderId && lo.paypalOrderId === remoteOrder.paypalOrderId) || 
                        lo.id === remoteOrder.id
                    );
                    if (!exists) {
                        localOrders.push({
                            id: remoteOrder.id,
                            email: email,
                            amount: remoteOrder.amount,
                            status: remoteOrder.status,
                            planName: remoteOrder.planName,
                            currency: remoteOrder.currency,
                            createdAt: remoteOrder.createdAt
                        });
                    }
                });
                this._set(this.KEYS.orders, localOrders);
            }

            console.log('✅ [FutureDB] Data synced with backend');
            return data;
        } catch (err) {
            console.warn('⚠️ [FutureDB] Backend sync failed:', err);
            return null;
        }
    },

    // ── MEMBERSHIP STATS ──────────────────────────────────
    getMemberStats() {
        const users = this.getUsers();
        const orders = this.getOrders();
        return {
            totalMembers: users.length,
            paidMembers: users.filter(u => u.plan && u.plan !== 'free').length,
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0).toFixed(2),
        };
    }
};

console.log('[FutureDB v2.0] Initialized with Firebase Sync. Session:', window.FutureDB.getSession()?.email || 'None');

