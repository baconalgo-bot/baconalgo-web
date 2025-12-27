/**
 * BaconAlgo Trade History & Logs
 * Affiche tous les trades avec export CSV/Excel
 */

const BaconHistory = {
    trades: [],

    init() {
        console.log('📊 BaconHistory initialized');
        this.createHistoryButton();
        this.loadTrades();
    },

    createHistoryButton() {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #22c55e;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        btn.innerHTML = '📊';
        btn.title = 'Trade History';
        btn.addEventListener('click', () => this.showHistory());
        document.body.appendChild(btn);
    },

    async loadTrades() {
        try {
            const { data: trades, error } = await supabase
                .from('trades')
                .select('*')
                .order('created_at', { ascending: false });
            this.trades = trades || [];
        } catch (err) {
            console.error('Trade load error:', err);
        }
    },

    showHistory() {
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
            border: 1px solid #22c55e;
            border-radius: 8px;
            padding: 20px;
            width: 95%;
            max-height: 85vh;
            overflow-y: auto;
            color: #e2e8f0;
        `;

        let html = `<h2 style="color: #22c55e; margin-bottom: 15px;">📊 Trade History (${this.trades.length})</h2>`;
        html += `<table style="width: 100%; border-collapse: collapse;">`;
        html += `<tr style="border-bottom: 2px solid #667eea;">
                    <th style="padding: 10px; text-align: left;">Date</th>
                    <th style="padding: 10px; text-align: left;">Symbol</th>
                    <th style="padding: 10px; text-align: left;">Broker</th>
                    <th style="padding: 10px; text-align: left;">Entry</th>
                    <th style="padding: 10px; text-align: left;">Exit</th>
                    <th style="padding: 10px; text-align: left;">P&L</th>
                </tr>`;

        this.trades.forEach(trade => {
            const pnlColor = trade.pnl > 0 ? '#22c55e' : '#ef4444';
            html += `<tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 10px;">${new Date(trade.created_at).toLocaleDateString()}</td>
                        <td style="padding: 10px;">${trade.symbol}</td>
                        <td style="padding: 10px;">${trade.broker}</td>
                        <td style="padding: 10px;">$${trade.entry_price}</td>
                        <td style="padding: 10px;">$${trade.exit_price}</td>
                        <td style="padding: 10px; color: ${pnlColor};">$${trade.pnl.toFixed(2)}</td>
                    </tr>`;
        });

        html += `</table>`;
        html += `<div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="export-csv" style="
                        flex: 1;
                        padding: 10px;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">📥 Export CSV</button>
                    <button onclick="document.body.removeChild(this.parentElement.parentElement.parentElement)" style="
                        flex: 1;
                        padding: 10px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Close</button>
                </div>`;

        content.innerHTML = html;
        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('export-csv').addEventListener('click', () => this.exportCSV());
    },

    exportCSV() {
        let csv = 'Date,Symbol,Broker,Entry,Exit,P&L\n';
        this.trades.forEach(trade => {
            csv += `${new Date(trade.created_at).toLocaleDateString()},${trade.symbol},${trade.broker},${trade.entry_price},${trade.exit_price},${trade.pnl}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bacon-trades-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconHistory.init());
} else {
    BaconHistory.init();
}

window.BaconHistory = BaconHistory;
