/**
 * BaconAlgo Configuration
 * Stocke les clés API et les webhooks
 * À charger AVANT les autres modules
 */

const BaconConfig = {
    // Clés API
    apis: {
        // Interactive Brokers - À remplir avec ta clé
        ib: {
            apiKey: localStorage.getItem('ib_api_key') || null,
            accountId: localStorage.getItem('ib_account_id') || null,
            endpoint: 'https://api.ibkr.com/v1'
        },
        
        // Bitget - À remplir avec ta clé
        bitget: {
            apiKey: localStorage.getItem('bitget_api_key') || 'paste_ton_bitget_api_key_ici',
            apiSecret: localStorage.getItem('bitget_api_secret') || 'paste_ton_bitget_secret_ici',
            passphrase: localStorage.getItem('bitget_passphrase') || 'paste_ta_passphrase_ici',
            endpoint: 'https://api.bitget.com/v2'
        },
        
        // Discord Webhook - ✅ DÉJÀ CONFIGURÉ
        discord: {
            webhook: localStorage.getItem('discord_webhook') || 'https://discord.com/api/webhooks/1454086410796662905/cF1S4wIRvYLIoMgggFoXQrrtw-KxXb2nb9zYDuFQH7SnCxy3jm1VJYhz-4f9uORlC0qB'
        }
    },

    // Initialiser la config
    init() {
        console.log('⚙️ BaconConfig initialized');
        
        // Sauvegarder Discord webhook automatiquement
        if (!localStorage.getItem('discord_webhook')) {
            localStorage.setItem('discord_webhook', this.apis.discord.webhook);
            console.log('✅ Discord webhook sauvegardé');
        }
        
        // Afficher le statut
        this.showStatus();
    },

    // Afficher le statut de la config
    showStatus() {
        console.log(`
🥓 BaconAlgo Configuration Status:
${this.apis.ib.apiKey ? '✅' : '❌'} Interactive Brokers
${this.apis.bitget.apiKey !== 'paste_ton_bitget_api_key_ici' ? '✅' : '❌'} Bitget
${this.apis.discord.webhook ? '✅' : '❌'} Discord Webhook
        `);
    },

    // Configurer les clés API
    setIB(apiKey, accountId) {
        localStorage.setItem('ib_api_key', apiKey);
        localStorage.setItem('ib_account_id', accountId);
        this.apis.ib.apiKey = apiKey;
        this.apis.ib.accountId = accountId;
        console.log('✅ IB API configured');
    },

    setBitget(apiKey, apiSecret, passphrase) {
        localStorage.setItem('bitget_api_key', apiKey);
        localStorage.setItem('bitget_api_secret', apiSecret);
        localStorage.setItem('bitget_passphrase', passphrase);
        this.apis.bitget.apiKey = apiKey;
        this.apis.bitget.apiSecret = apiSecret;
        this.apis.bitget.passphrase = passphrase;
        console.log('✅ Bitget API configured');
    },

    setDiscordWebhook(webhook) {
        localStorage.setItem('discord_webhook', webhook);
        this.apis.discord.webhook = webhook;
        console.log('✅ Discord webhook configured');
    },

    // Obtenir une clé API
    getAPI(service) {
        return this.apis[service] || null;
    }
};

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconConfig.init());
} else {
    BaconConfig.init();
}

// Rendre accessible globalement
window.BaconConfig = BaconConfig;
