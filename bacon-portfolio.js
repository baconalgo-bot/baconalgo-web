/**
 * BaconAlgo Portfolio Tracking Module
 * Suivi gains/pertes, win rate, sharpe ratio
 * Injection dynamique - Zéro modification HTML
 */

const BaconPortfolio = {
    // Stats du portefeuille
    stats: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalProfit: 0,
        totalLoss: 0,
        winRate: 0,
        avgProfit: 0,
        avgLoss: 0,
        profitFactor: 0,
        sharpeRatio: 0
    },

    // Initialiser
    init() {
        console.log('📊 BaconPortfolio initialized');
        this.loadTrades();
        this.injectPortfolioPanel();
        this.setupRealtime();
    },

    // Charger les trades depuis Supabase
    async loadTrades() {
        try {
            const { data: trades, error } = await supabase
                .from('trades')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.calculateStats(trades);
            this.updateUI();
        } catch (err) {
            console.error('Portfolio load error:', err);
        }
    },

    // Calculer les statistiques
    calculateStats(trades) {
        if (!trades || trades.length === 0) return;

        this.stats.totalTrades = trades.length;
        
        let profits = [];
        let losses = [];
        let totalProfit = 0;
        let totalLoss = 0;

        trades.forEach(trade => {
            if (trade.pnl > 0) {
                this.stats.winningTrades++;
                totalProfit += trade.pnl;
                profits.push(trade.pnl);
            } else if (trade.pnl < 0) {
                this.stats.losingTrades++;
                totalLoss += Math.abs(trade.pnl);
                losses.push(Math.abs(trade.pnl));
            }
        });

        this.stats.totalProfit = totalProfit;
        this.stats.totalLoss = totalLoss;
        this.stats.winRate = this.stats.totalTrades > 0 
            ? ((this.stats.winningTrades / this.stats.totalTrades) * 100).toFixed(2)
            : 0;

        this.stats.avgProfit = profits.length > 0 
            ? (totalProfit / profits.length).toFixed(2)
            : 0;

        this.stats.avgLoss = losses.length > 0 
            ? (totalLoss / losses.length).toFixed(2)
            : 0;

        this.stats.profitFactor = this.stats.avgLoss > 0
            ? (this.stats.avgProfit / this.stats.avgLoss).toFixed(2)
            : 0;

        // Sharpe ratio (simplifié)
        const returns = trades.map(t => t.pnl);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        this.stats.sharpeRatio = stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : 0;
    },

    // Injecter le panneau de portfolio
    injectPortfolioPanel() {
        const panel = document.createElement('div');
        panel.id = 'bacon-portfolio-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: #1e293b;
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 9999;
        `;

        panel.innerHTML = `
            <div style="color: #667eea; font-weight: 700; margin-bottom: 10px;">📊 PORTFOLIO</div>
            <div style="font-size: 12px; color: #94a3b8; line-height: 1.8;">
                <div>Trades: <span style="color: #fff; font-weight: 600;" id="portfolio-trades">0</span></div>
                <div>Win Rate: <span style="color: #22c55e; font-weight: 600;" id="portfolio-winrate">0%</span></div>
                <div>Profit: <span style="color: #22c55e; font-weight: 600;" id="portfolio-profit">$0</span></div>
                <div>Loss: <span style="color: #ef4444; font-weight: 600;" id="portfolio-loss">$0</span></div>
                <div>Profit Factor: <span style="color: #fff; font-weight: 600;" id="portfolio-pf">0</span></div>
                <div>Sharpe: <span style="color: #fff; font-weight: 600;" id="portfolio-sharpe">0</span></div>
            </div>
            <button id="portfolio-toggle" style="
                width: 100%;
                margin-top: 10px;
                padding: 8px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
            ">Détails</button>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('portfolio-toggle').addEventListener('click', () => {
            this.showDetailedStats();
        });
    },

    // Afficher les stats détaillées
    showDetailedStats() {
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
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 30px;
            max-width: 500px;
            color: #e2e8f0;
        `;

        content.innerHTML = `
            <h2 style="color: #667eea; margin-bottom: 20px;">📊 Portfolio Analytics</h2>
            <div style="font-size: 14px; line-height: 2;">
                <div><strong>Total Trades:</strong> ${this.stats.totalTrades}</div>
                <div><strong>Winning Trades:</strong> ${this.stats.winningTrades}</div>
                <div><strong>Losing Trades:</strong> ${this.stats.losingTrades}</div>
                <div><strong>Win Rate:</strong> <span style="color: #22c55e;">${this.stats.winRate}%</span></div>
                <div style="margin-top: 20px; border-top: 1px solid #334155; padding-top: 20px;">
                    <div><strong>Total Profit:</strong> <span style="color: #22c55e;">$${this.stats.totalProfit.toFixed(2)}</span></div>
                    <div><strong>Total Loss:</strong> <span style="color: #ef4444;">-$${this.stats.totalLoss.toFixed(2)}</span></div>
                    <div><strong>Net P&L:</strong> <span style="color: ${this.stats.totalProfit - this.stats.totalLoss > 0 ? '#22c55e' : '#ef4444'};"><strong>$${(this.stats.totalProfit - this.stats.totalLoss).toFixed(2)}</strong></span></div>
                </div>
                <div style="margin-top: 20px; border-top: 1px solid #334155; padding-top: 20px;">
                    <div><strong>Avg Profit/Trade:</strong> $${this.stats.avgProfit}</div>
                    <div><strong>Avg Loss/Trade:</strong> $${this.stats.avgLoss}</div>
                    <div><strong>Profit Factor:</strong> ${this.stats.profitFactor}</div>
                    <div><strong>Sharpe Ratio:</strong> ${this.stats.sharpeRatio}</div>
                </div>
            </div>
            <button style="
                width: 100%;
                margin-top: 20px;
                padding: 10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            " onclick="document.body.removeChild(this.parentElement.parentElement)">Fermer</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    },

    // Mettre à jour l'UI
    updateUI() {
        const els = {
            'portfolio-trades': this.stats.totalTrades,
            'portfolio-winrate': `${this.stats.winRate}%`,
            'portfolio-profit': `$${this.stats.totalProfit.toFixed(2)}`,
            'portfolio-loss': `$${this.stats.totalLoss.toFixed(2)}`,
            'portfolio-pf': this.stats.profitFactor,
            'portfolio-sharpe': this.stats.sharpeRatio
        };

        Object.entries(els).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    },

    // Setup real-time updates
    setupRealtime() {
        supabase
            .channel('trades')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'trades' },
                (payload) => {
                    console.log('Portfolio update:', payload);
                    this.loadTrades();
                }
            )
            .subscribe();
    }
};

// Initialiser
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconPortfolio.init());
} else {
    BaconPortfolio.init();
}
