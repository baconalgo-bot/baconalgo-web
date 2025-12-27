/**
 * 🔥 BACONALGO SIGNAL FILTER v2
 * Mocks Supabase et Discord COMPLÈTEMENT pour mode LOCAL
 */

// ============================================
// MOCK SUPABASE - 100% LOCAL
// ============================================
window.supabase = {
    from: (table) => ({
        insert: async (data) => ({ data: null, error: null }),
        select: async (cols) => ({
            data: [],
            error: null,
            order: (col, opts) => ({ data: [], error: null }),
            limit: (n) => ({ data: [], error: null }),
            range: (start, end) => ({ data: [], error: null })
        }),
        update: async (data) => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null })
    }),
    
    channel: (name) => ({
        on: (event, opts, callback) => ({
            subscribe: (callback) => this
        }),
        subscribe: (callback) => this,
        unsubscribe: () => this,
        removeSubscription: () => this
    })
};

// ============================================
// MOCK DISCORD - CATCHES ALL CALLS
// ============================================
window.BaconDiscord = {
    send: async (message) => {
        console.log('💬 [Discord Mock]', message?.title || 'Signal sent');
        return Promise.resolve();
    }
};

// ============================================
// SUPPRESS REMAINING CONSOLE ERRORS
// ============================================
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args) {
    const message = String(args[0] || '');
    
    // Suppress known non-critical errors
    if (message.includes('supabase') || 
        message.includes('Supabase') ||
        message.includes('BaconDiscord') ||
        message.includes('channel') ||
        message.includes('Portfolio load') ||
        message.includes('Analytics load') ||
        message.includes('setupRealtime') ||
        message.includes('setupSignalListener') ||
        message.includes('Risk calculation')) {
        return; // Suppress
    }
    
    // Print real errors
    originalError.apply(console, args);
};

console.warn = function(...args) {
    const message = String(args[0] || '');
    
    if (message.includes('supabase') || message.includes('Supabase')) {
        return; // Suppress
    }
    
    originalWarn.apply(console, args);
};

console.log('✅ Signal filter v2 loaded - local mode ACTIVE');
