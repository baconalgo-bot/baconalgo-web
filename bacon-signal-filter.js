/**
 * 🔥 BACONALGO SIGNAL FILTER
 * Filtre les erreurs de Supabase/Discord - pas besoin pour scanner LOCAL
 */

// Disable Supabase errors (we use local data anyway)
window.supabase = {
    from: () => ({ insert: async () => {}, select: async () => [] })
};

// Mock Discord if not available (we'll use local alerts)
if (!window.BaconDiscord) {
    window.BaconDiscord = {
        send: (message) => console.log('💬 Discord:', message)
    };
}

// Suppress specific console errors
const originalError = console.error;
console.error = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Ignore Supabase errors
    if (message.includes('supabase') || message.includes('Supabase')) {
        return;
    }
    
    // Ignore Discord send errors
    if (message.includes('BaconDiscord') && message.includes('send')) {
        return;
    }
    
    // Ignore Risk calculation errors (for now)
    if (message.includes('Risk calculation')) {
        return;
    }
    
    // Print everything else
    originalError.apply(console, args);
};

console.log('✅ Signal filter loaded - local mode active');
