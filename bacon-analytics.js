/**
 * BaconAlgo Advanced Analytics Module
 * Performance charts, statistiques détaillées, heatmaps
 * Injection dynamique - Zéro modification HTML
 */

const BaconAnalytics = {
    // Charger Chart.js
    async loadChartLib() {
        if (window.Chart) return;
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        document.head.appendChild(script);
        
        return new Promise(resolve => {
            script.onload = resolve;
        });
    },

    // Initialiser
    async init() {
        console.log('📈 BaconAnalytics initialized');
        await this.loadChartLib();
        this.injectAnalyticsPanel();
        this.loadData();
    },

    // Injecter le panneau analytics
    injectAnalyticsPanel() {
        const panel = document.createElement('div');
        panel.id = 'bacon-analytics-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 150px;
            background: #1e293b;
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        panel.innerHTML = `
            <div style="color: #667eea; font-weight: 700; margin-bottom: 8px; font-size: 12px;">📈 ANALYTICS</div>
            <button id="analytics-charts" style="
                width: 100%;
                padding: 6px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 5px;
            ">Charts</button>
            <button id="analytics-heatmap" style="
                width: 100%;
                padding: 6px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 5px;
            ">Heatmap</button>
            <button id="analytics-stats" style="
                width: 100%;
                padding: 6px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
            ">Stats</button>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('analytics-charts').addEventListener('click', () => this.showCharts());
        document.getElementById('analytics-heatmap').addEventListener('click', () => this.showHeatmap());
        document.getElementById('analytics-stats').addEventListener('click', () => this.showStats());
    },

    // Charger les données
    async loadData() {
        try {
            const { data: trades, error } = await supabase
                .from('trades')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            this.trades = trades || [];
        } catch (err) {
            console.error('Analytics load error:', err);
        }
    },

    // Afficher les charts
    async showCharts() {
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
            z-index: 10001;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 1000px;
            max-height: 80vh;
            overflow-y: auto;
            color: #e2e8f0;
        `;

        content.innerHTML = `
            <h2 style="color: #667eea; margin-bottom: 20px;">📈 Performance Charts</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3 style="color: #94a3b8; font-size: 14px; margin-bottom: 10px;">P&L Timeline</h3>
                    <canvas id="chart-pnl"></canvas>
                </div>
                <div>
                    <h3 style="color: #94a3b8; font-size: 14px; margin-bottom: 10px;">Win/Loss Distribution</h3>
                    <canvas id="chart-dist"></canvas>
                </div>
                <div>
                    <h3 style="color: #94a3b8; font-size: 14px; margin-bottom: 10px;">Daily Returns</h3>
                    <canvas id="chart-daily"></canvas>
                </div>
                <div>
                    <h3 style="color: #94a3b8; font-size: 14px; margin-bottom: 10px;">Cumulative P&L</h3>
                    <canvas id="chart-cumulative"></canvas>
                </div>
            </div>
            <button style="
                width: 100%;
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

        // Charts
        setTimeout(() => {
            this.createPNLChart();
            this.createDistributionChart();
            this.createDailyChart();
            this.createCumulativeChart();
        }, 100);
    },

    // Chart P&L Timeline
    createPNLChart() {
        const ctx = document.getElementById('chart-pnl');
        if (!ctx || !window.Chart) return;

        const labels = this.trades.map((t, i) => `Trade ${i + 1}`);
        const data = this.trades.map(t => t.pnl);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'P&L',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    }
                }
            }
        });
    },

    // Chart Distribution
    createDistributionChart() {
        const ctx = document.getElementById('chart-dist');
        if (!ctx || !window.Chart) return;

        const winningTrades = this.trades.filter(t => t.pnl > 0).length;
        const losingTrades = this.trades.filter(t => t.pnl < 0).length;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Winning', 'Losing'],
                datasets: [{
                    data: [winningTrades, losingTrades],
                    backgroundColor: ['#22c55e', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#94a3b8' }
                    }
                }
            }
        });
    },

    // Chart Daily Returns
    createDailyChart() {
        const ctx = document.getElementById('chart-daily');
        if (!ctx || !window.Chart) return;

        const dailyPnL = {};
        this.trades.forEach(trade => {
            const date = new Date(trade.created_at).toLocaleDateString();
            dailyPnL[date] = (dailyPnL[date] || 0) + trade.pnl;
        });

        const labels = Object.keys(dailyPnL);
        const data = Object.values(dailyPnL);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily P&L',
                    data: data,
                    backgroundColor: data.map(v => v > 0 ? '#22c55e' : '#ef4444')
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    }
                }
            }
        });
    },

    // Chart Cumulative
    createCumulativeChart() {
        const ctx = document.getElementById('chart-cumulative');
        if (!ctx || !window.Chart) return;

        let cumulative = 0;
        const data = this.trades.map(t => cumulative += t.pnl);
        const labels = this.trades.map((t, i) => `Trade ${i + 1}`);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative P&L',
                    data: data,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    }
                }
            }
        });
    },

    // Heatmap
    showHeatmap() {
        alert('🔥 Heatmap coming soon!\nSymbol performance by day/time');
    },

    // Stats détaillés
    showStats() {
        alert(`📊 Detailed Stats:\n\nTotal Trades: ${this.trades.length}\nAvg Trade Value: $${(this.trades.reduce((s, t) => s + t.pnl, 0) / this.trades.length).toFixed(2)}`);
    }
};

// Initialiser
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconAnalytics.init());
} else {
    BaconAnalytics.init();
}

// Rendre accessible globalement
window.BaconAnalytics = BaconAnalytics;
