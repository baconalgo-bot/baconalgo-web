/**
 * BaconAlgo Discord Webhooks Module
 * Notifications instantanées sur chaque signal/trade
 * Injection dynamique - Zéro modification HTML
 */

const BaconDiscord = {
    // Configuration Discord
    webhookUrl: localStorage.getItem('discord_webhook') || null,
    
    // Couleurs Discord
    colors: {
        'strong-buy': 0x22c55e,    // Vert
        'buy': 0x84cc16,            // Jaune-vert
        'hold': 0xf59e0b,           // Orange
        'profit': 0x22c55e,         // Vert
        'loss': 0xef4444,           // Rouge
        'info': 0x667eea            // Bleu
    },

    // Initialiser
    init() {
        console.log('💬 BaconDiscord initialized');
        if (this.webhookUrl) {
            this.setupSignalListener();
            this.setupTradeListener();
        } else {
            console.warn('⚠️ Discord webhook non configuré');
        }
    },

    // Écouter les nouveaux signaux
    setupSignalListener() {
        supabase
            .channel('signals')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'signals' },
                (payload) => {
                    this.sendSignalAlert(payload.new);
                }
            )
            .subscribe();
    },

    // Écouter les nouveaux trades
    setupTradeListener() {
        supabase
            .channel('trades')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'trades' },
                (payload) => {
                    this.sendTradeAlert(payload.new);
                }
            )
            .subscribe();
    },

    // Envoyer alerte signal
    async sendSignalAlert(signal) {
        if (!this.webhookUrl) return;

        const ratingColor = this.colors[signal.rating] || this.colors.info;

        const embed = {
            title: `🥓 Nouveau Signal: ${signal.symbol}`,
            description: signal.description,
            color: ratingColor,
            fields: [
                {
                    name: 'Rating',
                    value: `\`${signal.rating.toUpperCase()}\``,
                    inline: true
                },
                {
                    name: 'Score',
                    value: `\`${signal.score}/300\``,
                    inline: true
                },
                {
                    name: 'Timeframe',
                    value: `\`${signal.timeframe}\``,
                    inline: true
                },
                {
                    name: 'Entry',
                    value: `\`$${signal.entry.toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'TP1',
                    value: `\`$${signal.tp1.toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'Stop Loss',
                    value: `\`$${signal.stop_loss.toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'Setup',
                    value: signal.setup,
                    inline: false
                },
                {
                    name: 'Wave',
                    value: signal.wave,
                    inline: false
                },
                {
                    name: 'Confluence',
                    value: `\`${signal.confluence}%\``,
                    inline: true
                },
                {
                    name: 'R:R',
                    value: `\`${signal.rr.toFixed(2)}:1\``,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: '🥓 BaconAlgo Scanner',
                icon_url: 'https://baconalgo.com/icon.png'
            }
        };

        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: '🥓 BaconAlgo',
                    avatar_url: 'https://baconalgo.com/avatar.png',
                    embeds: [embed]
                })
            });
            console.log('✅ Signal alert sent to Discord');
        } catch (err) {
            console.error('Discord error:', err);
        }
    },

    // Envoyer alerte trade
    async sendTradeAlert(trade) {
        if (!this.webhookUrl) return;

        const isProfit = trade.pnl > 0;
        const color = isProfit ? this.colors.profit : this.colors.loss;

        const embed = {
            title: `📈 Trade ${isProfit ? 'PROFIT' : 'LOSS'}`,
            description: `${trade.symbol} sur ${trade.broker.toUpperCase()}`,
            color: color,
            fields: [
                {
                    name: 'Broker',
                    value: `\`${trade.broker}\``,
                    inline: true
                },
                {
                    name: 'Order ID',
                    value: `\`${trade.order_id}\``,
                    inline: true
                },
                {
                    name: 'Entry',
                    value: `\`$${trade.entry.toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'Exit',
                    value: `\`$${(trade.entry + trade.pnl).toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'P&L',
                    value: `\`${isProfit ? '+' : ''}$${trade.pnl.toFixed(2)}\``,
                    inline: true
                },
                {
                    name: 'Return %',
                    value: `\`${((trade.pnl / trade.entry) * 100).toFixed(2)}%\``,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: '🥓 BaconAlgo Trading',
                icon_url: 'https://baconalgo.com/icon.png'
            }
        };

        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: '🥓 BaconAlgo',
                    avatar_url: 'https://baconalgo.com/avatar.png',
                    embeds: [embed]
                })
            });
            console.log('✅ Trade alert sent to Discord');
        } catch (err) {
            console.error('Discord error:', err);
        }
    },

    // Configuration du webhook
    setWebhook(url) {
        this.webhookUrl = url;
        localStorage.setItem('discord_webhook', url);
        this.setupSignalListener();
        this.setupTradeListener();
        console.log('✅ Discord webhook configured');
    }
};

// Initialiser
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconDiscord.init());
} else {
    BaconDiscord.init();
}

// Rendre accessible globalement
window.BaconDiscord = BaconDiscord;
