/**
 * BaconAlgo Advanced Webhooks & API
 * Intègre TradingView, Telegram, Push Notifications
 */

const BaconWebhooks = {
    webhookKey: localStorage.getItem('webhook_key') || 'bacon_' + Math.random().toString(36).substr(2, 9),

    init() {
        console.log('🔗 BaconWebhooks initialized');
        localStorage.setItem('webhook_key', this.webhookKey);
        this.createWebhookButton();
    },

    createWebhookButton() {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: fixed;
            bottom: 200px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #f59e0b;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            font-size: 20px;
        `;
        btn.innerHTML = '🔗';
        btn.title = 'Webhooks';
        btn.addEventListener('click', () => this.showWebhookPanel());
        document.body.appendChild(btn);
    },

    async handleTradingViewWebhook(signal) {
        console.log('📊 TradingView Signal:', signal);
        
        // Process signal
        if (signal.action === 'BUY') {
            if (window.BaconTrading) {
                await window.BaconTrading.executeTrade('BUY', signal.symbol, signal.quantity);
            }
        } else if (signal.action === 'SELL') {
            if (window.BaconTrading) {
                await window.BaconTrading.executeTrade('SELL', signal.symbol, signal.quantity);
            }
        }

        // Send confirmation
        await this.sendTelegramAlert(`✅ ${signal.action} ${signal.symbol} executed`);
    },

    async sendTelegramAlert(message) {
        const telegramToken = localStorage.getItem('telegram_token');
        const chatId = localStorage.getItem('telegram_chat_id');
        
        if (!telegramToken || !chatId) return;

        try {
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
        } catch (err) {
            console.error('Telegram error:', err);
        }
    },

    async sendPushNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '🥓' });
        }
    },

    showWebhookPanel() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;

        const webhookURL = `${window.location.origin}/api/webhook/${this.webhookKey}`;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            color: #e2e8f0;
        `;

        content.innerHTML = `
            <h2 style="color: #f59e0b; margin-bottom: 20px;">🔗 Webhooks & Integrations</h2>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #94a3b8;">TradingView Webhook URL</h3>
                <input type="text" value="${webhookURL}" readonly style="
                    width: 100%;
                    padding: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #94a3b8;
                    border-radius: 4px;
                    font-size: 12px;
                ">
                <small style="color: #64748b;">Use this URL in TradingView Alert webhook</small>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #94a3b8;">Telegram Bot</h3>
                <input type="text" id="telegram-token" placeholder="Bot Token" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <input type="text" id="telegram-chat" placeholder="Chat ID" style="
                    width: 100%;
                    padding: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <button id="test-telegram" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Test Telegram</button>
            </div>

            <button id="enable-push" style="
                width: 100%;
                padding: 10px;
                background: #22c55e;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 10px;
            ">Enable Push Notifications</button>

            <button onclick="document.body.removeChild(this.parentElement.parentElement)" style="
                width: 100%;
                padding: 10px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('test-telegram').addEventListener('click', async () => {
            const token = document.getElementById('telegram-token').value;
            const chatId = document.getElementById('telegram-chat').value;
            if (token && chatId) {
                localStorage.setItem('telegram_token', token);
                localStorage.setItem('telegram_chat_id', chatId);
                await this.sendTelegramAlert('✅ BaconAlgo Connected!');
                alert('✅ Telegram configured!');
            }
        });

        document.getElementById('enable-push').addEventListener('click', () => {
            Notification.requestPermission().then(perm => {
                if (perm === 'granted') {
                    this.sendPushNotification('BaconAlgo', 'Push notifications enabled! 🔔');
                }
            });
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconWebhooks.init());
} else {
    BaconWebhooks.init();
}

window.BaconWebhooks = BaconWebhooks;
