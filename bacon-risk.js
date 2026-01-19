/**
 * BaconAlgo Risk Management
 * Gestion des risques - Daily limits, position sizing, alerts
 */

const BaconRisk = {
    config: {
        dailyLossLimit: parseFloat(localStorage.getItem('daily_loss_limit')) || 500,
        maxPositionSize: parseFloat(localStorage.getItem('max_position')) || 1000,
        maxLeverageIB: parseFloat(localStorage.getItem('max_leverage_ib')) || 4,
        maxLeverageBitget: parseFloat(localStorage.getItem('max_leverage_bitget')) || 5,
        riskPerTrade: parseFloat(localStorage.getItem('risk_per_trade')) || 0.02
    },

    dailyPnL: 0,

    init() {
        console.log('🛑 BaconRisk initialized');
        this.createRiskButton();
        this.startMonitoring();
    },

    createRiskButton() {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: fixed;
            bottom: 140px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #ef4444;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        btn.innerHTML = '🛑';
        btn.title = 'Risk Management';
        btn.addEventListener('click', () => this.showRiskPanel());
        document.body.appendChild(btn);
    },

    startMonitoring() {
        setInterval(async () => {
            await this.calculateDailyPnL();
            if (this.dailyPnL <= -this.config.dailyLossLimit) {
                this.triggerDailyLimitAlert();
            }
        }, 5000); // Check every 5 seconds
    },

    async calculateDailyPnL() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: trades } = await supabase
                .from('trades')
                .select('pnl')
                .gte('created_at', `${today}T00:00:00`)
                .lt('created_at', `${today}T23:59:59`);

            this.dailyPnL = (trades || []).reduce((sum, t) => sum + t.pnl, 0);
        } catch (err) {
            console.error('Risk calculation error:', err);
        }
    },

    triggerDailyLimitAlert() {
        const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
        audio.play().catch(() => {});
        
        if (window.BaconDiscord) {
            window.BaconDiscord.send({
                title: '⚠️ DAILY LOSS LIMIT REACHED',
                description: `Daily P&L: $${this.dailyPnL.toFixed(2)} (Limit: -$${this.config.dailyLossLimit})`,
                color: 16711680
            });
        }
    },

    showRiskPanel() {
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

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            color: #e2e8f0;
        `;

        content.innerHTML = `
            <h2 style="color: #ef4444; margin-bottom: 20px;">🛑 Risk Management</h2>
            
            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8;">Daily Loss Limit ($)</label>
                <input type="number" id="daily-limit" value="${this.config.dailyLossLimit}" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8;">Max Position Size ($)</label>
                <input type="number" id="max-position" value="${this.config.maxPositionSize}" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8;">Risk Per Trade (%)</label>
                <input type="number" id="risk-trade" value="${(this.config.riskPerTrade * 100)}" step="0.1" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
            </div>

            <div style="padding: 15px; background: #0f172a; border-radius: 4px; margin-bottom: 15px;">
                <p style="color: #22c55e; margin: 0; font-weight: 600;">Today's P&L: $${this.dailyPnL.toFixed(2)}</p>
                <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px;">Remaining: $${(this.config.dailyLossLimit + this.dailyPnL).toFixed(2)}</p>
            </div>

            <button id="save-risk" style="
                width: 100%;
                padding: 10px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                margin-bottom: 10px;
            ">Save Settings</button>
            
            <button onclick="document.body.removeChild(this.parentElement.parentElement)" style="
                width: 100%;
                padding: 10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('save-risk').addEventListener('click', () => {
            this.config.dailyLossLimit = parseFloat(document.getElementById('daily-limit').value);
            this.config.maxPositionSize = parseFloat(document.getElementById('max-position').value);
            this.config.riskPerTrade = parseFloat(document.getElementById('risk-trade').value) / 100;

            localStorage.setItem('daily_loss_limit', this.config.dailyLossLimit);
            localStorage.setItem('max_position', this.config.maxPositionSize);
            localStorage.setItem('risk_per_trade', this.config.riskPerTrade);

            alert('✅ Risk settings saved!');
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconRisk.init());
} else {
    BaconRisk.init();
}

window.BaconRisk = BaconRisk;
