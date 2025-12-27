/**
 * 🔥 BACONALGO ULTIMATE SCANNER
 * Le cœur de la machine: Génère 50+ signaux/jour
 * Suporte: Stocks, Crypto, Futures - TOUT!
 */

const BaconScanner = {
    // Config
    scanInterval: 5000, // Scan every 5 seconds
    symbols: ['AAPL', 'TSLA', 'NVDA', 'QQQ', 'SPY', 'GOOGL', 'AMZN', 'BTC', 'ETH'],
    signals: [],
    
    // Indicators cache
    cache: {},
    
    // ============================================
    // INIT
    // ============================================
    async init() {
        console.log('🔥 BACONSCANNER STARTING...');
        
        // Create control button
        this.createScannerButton();
        
        // Start auto-scanning
        this.startScanning();
        
        // Periodic status check
        setInterval(() => this.reportStatus(), 30000);
        
        console.log('✅ BACONSCANNER READY');
    },

    // ============================================
    // UI BUTTON
    // ============================================
    createScannerButton() {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff6b6b, #ff8c00);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9998;
            font-size: 24px;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
            animation: pulse 2s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        btn.innerHTML = '🔍';
        btn.title = 'SCANNER LIVE';
        
        // Add pulse animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        btn.addEventListener('click', () => this.showScannerDashboard());
        btn.addEventListener('mouseover', () => {
            btn.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.8)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.5)';
        });
        
        document.body.appendChild(btn);
    },

    // ============================================
    // MAIN SCANNING ENGINE
    // ============================================
    startScanning() {
        setInterval(() => {
            this.symbols.forEach(symbol => {
                this.scanSymbol(symbol);
            });
        }, this.scanInterval);
        
        // Initial scan
        this.symbols.forEach(symbol => this.scanSymbol(symbol));
    },

    async scanSymbol(symbol) {
        try {
            // Generate fake but realistic data for demo
            // In production: Connect to real API (TradingView, Alpha Vantage, Finnhub, etc)
            const price = Math.random() * 1000 + 100;
            const volume = Math.random() * 1000000 + 100000;
            const ma20 = price * (0.95 + Math.random() * 0.1);
            const ma50 = price * (0.9 + Math.random() * 0.15);
            const rsi = Math.random() * 100;
            const macd = Math.random() * 10 - 5;
            
            // SIGNAL GENERATION (Core Logic)
            let signal = this.generateSignal(symbol, {
                price, volume, ma20, ma50, rsi, macd
            });
            
            if (signal) {
                this.signals.unshift(signal);
                
                // Keep only last 50 signals
                if (this.signals.length > 50) {
                    this.signals.pop();
                }
                
                // Send to Discord + Execute trade
                this.processSignal(signal);
                
                // Update UI
                this.updateUI();
            }
        } catch (err) {
            console.error(`Scan error for ${symbol}:`, err);
        }
    },

    // ============================================
    // SIGNAL GENERATION (MAGIC HAPPENS HERE)
    // ============================================
    generateSignal(symbol, data) {
        const { price, volume, ma20, ma50, rsi, macd } = data;
        
        let score = 0;
        let reason = [];
        
        // 1. TREND: MA20 > MA50 = Uptrend
        if (ma20 > ma50) {
            score += 20;
            reason.push('📈 Uptrend');
        } else {
            score -= 20;
            reason.push('📉 Downtrend');
        }
        
        // 2. MOMENTUM: RSI extremes
        if (rsi > 70) {
            score += 15;
            reason.push('🔥 Overbought');
        } else if (rsi < 30) {
            score += 25; // Strong oversold bounce
            reason.push('💎 Oversold');
        }
        
        // 3. MACD: Momentum oscillator
        if (macd > 0) {
            score += 10;
            reason.push('⚡ Bullish MACD');
        }
        
        // 4. VOLUME: High volume = conviction
        if (volume > 500000) {
            score += 10;
            reason.push('📊 High Volume');
        }
        
        // DECISION THRESHOLD
        if (score >= 50) {
            return {
                symbol,
                action: score > 0 ? 'BUY' : 'SELL',
                score: Math.round(score),
                price: price.toFixed(2),
                reason: reason.join(' + '),
                timestamp: new Date().toLocaleTimeString(),
                confidence: Math.min(100, Math.round((score / 100) * 100))
            };
        }
        
        return null;
    },

    // ============================================
    // PROCESS SIGNAL (Execute + Alert)
    // ============================================
    async processSignal(signal) {
        console.log(`✅ SIGNAL GENERATED:`, signal);
        
        // 1. Send to Discord
        if (window.BaconDiscord) {
            const color = signal.action === 'BUY' ? 3066993 : 15158332; // Green : Red
            window.BaconDiscord.send({
                title: `🎯 ${signal.action} ${signal.symbol} @ $${signal.price}`,
                description: `Score: ${signal.score}/100\n${signal.reason}`,
                color: color
            });
        }
        
        // 2. Save to database (if connected)
        // await this.saveSignalToDB(signal);
        
        // 3. Auto-execute trade (if enabled)
        // if (window.BaconTrading && this.autoTrade) {
        //     await window.BaconTrading.executeTrade(
        //         signal.action, 
        //         signal.symbol, 
        //         100, // default qty
        //         'Bitget'
        //     );
        // }
    },

    // ============================================
    // UI DASHBOARD
    // ============================================
    showScannerDashboard() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10003;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #0f172a;
            border: 2px solid #ff6b6b;
            border-radius: 12px;
            padding: 30px;
            width: 95%;
            max-width: 1200px;
            max-height: 85vh;
            overflow-y: auto;
            color: #e2e8f0;
            font-family: monospace;
        `;
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ff6b6b; margin: 0;">🔥 BACONALGO SCANNER - LIVE</h2>
                <button onclick="document.body.removeChild(document.body.lastChild.parentElement)" style="
                    padding: 10px 20px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">CLOSE</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
                    <div style="color: #94a3b8; font-size: 12px;">SIGNALS TODAY</div>
                    <div style="color: #22c55e; font-size: 24px; font-weight: bold;">${this.signals.length}</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <div style="color: #94a3b8; font-size: 12px;">AVG SCORE</div>
                    <div style="color: #3b82f6; font-size: 24px; font-weight: bold;">
                        ${this.signals.length > 0 ? Math.round(this.signals.reduce((s, a) => s + a.score, 0) / this.signals.length) : 0}
                    </div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <div style="color: #94a3b8; font-size: 12px;">STATUS</div>
                    <div style="color: #ff6b6b; font-size: 24px; font-weight: bold;">🔴 LIVE</div>
                </div>
            </div>
            
            <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #94a3b8; margin-top: 0;">LATEST SIGNALS</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #334155;">
                            <th style="text-align: left; padding: 10px; color: #667eea;">TIME</th>
                            <th style="text-align: left; padding: 10px; color: #667eea;">SYMBOL</th>
                            <th style="text-align: left; padding: 10px; color: #667eea;">ACTION</th>
                            <th style="text-align: left; padding: 10px; color: #667eea;">PRICE</th>
                            <th style="text-align: left; padding: 10px; color: #667eea;">SCORE</th>
                            <th style="text-align: left; padding: 10px; color: #667eea;">REASON</th>
                        </tr>
        `;
        
        this.signals.slice(0, 20).forEach(signal => {
            const actionColor = signal.action === 'BUY' ? '#22c55e' : '#ef4444';
            html += `
                <tr style="border-bottom: 1px solid #1e293b; hover: background: #1e293b;">
                    <td style="padding: 10px; color: #94a3b8;">${signal.timestamp}</td>
                    <td style="padding: 10px; color: #e2e8f0; font-weight: bold;">${signal.symbol}</td>
                    <td style="padding: 10px; color: ${actionColor}; font-weight: bold;">${signal.action}</td>
                    <td style="padding: 10px; color: #e2e8f0;">$${signal.price}</td>
                    <td style="padding: 10px; color: #3b82f6; font-weight: bold;">${signal.score}</td>
                    <td style="padding: 10px; color: #94a3b8; font-size: 11px;">${signal.reason}</td>
                </tr>
            `;
        });
        
        html += `
                    </table>
                </div>
            </div>
        `;
        
        content.innerHTML = html;
        modal.appendChild(content);
        document.body.appendChild(modal);
    },

    updateUI() {
        // Could update a persistent widget with latest signal count
    },

    reportStatus() {
        console.log(`
        ╔═══════════════════════════════╗
        ║ 🥓 BACONSCANNER STATUS REPORT ║
        ╠═══════════════════════════════╣
        ║ Signals Generated: ${this.signals.length}
        ║ Symbols Tracked: ${this.symbols.length}
        ║ Scan Interval: ${this.scanInterval}ms
        ║ Last Updated: ${new Date().toLocaleTimeString()}
        ╚═══════════════════════════════╝
        `);
    }
};

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconScanner.init());
} else {
    BaconScanner.init();
}

window.BaconScanner = BaconScanner;
