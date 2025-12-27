/**
 * 🔥 BACONALGO LIVE DASHBOARD
 * Met à jour en TEMPS RÉEL avec les signaux du scanner
 */

const BaconLiveDashboard = {
    updateInterval: 1000, // Refresh all 1 second
    
    init() {
        console.log('🎯 BACON LIVE DASHBOARD STARTING...');
        
        // Wait for BaconScanner to be ready
        const checkScanner = setInterval(() => {
            if (window.BaconScanner && window.BaconScanner.signals) {
                clearInterval(checkScanner);
                console.log('✅ SCANNER DETECTED - Dashboard synced');
                this.startLiveUpdate();
            }
        }, 500);
    },

    startLiveUpdate() {
        setInterval(() => {
            this.updateTopSignals();
            this.updateStats();
            this.updatePortfolio();
        }, this.updateInterval);
        
        // First update immediately
        this.updateTopSignals();
        this.updateStats();
    },

    // ============================================
    // UPDATE TOP SIGNALS (Rank 1 & 2)
    // ============================================
    updateTopSignals() {
        if (!window.BaconScanner || !window.BaconScanner.signals) return;
        
        const signals = window.BaconScanner.signals.slice(0, 5); // Top 5
        
        // Rank 1 (Highest score)
        const top1 = signals[0];
        if (top1) {
            this.updateSignalCard('#1', top1);
        }
        
        // Rank 2 (Second highest)
        const top2 = signals[1];
        if (top2) {
            this.updateSignalCard('#2', top2);
        }
    },

    updateSignalCard(rankId, signal) {
        // Find the card (target by content matching)
        const cards = document.querySelectorAll('[style*="color: #ff6b6b"]');
        
        cards.forEach((card, idx) => {
            // Check if this looks like a signal card (has score, price info)
            const hasScore = card.textContent.includes('100') || card.textContent.includes('/');
            
            if (hasScore) {
                // Update the card content
                let grade = signal.score >= 80 ? 'LEGENDARY' : 
                           signal.score >= 60 ? 'EPIC' : 'RARE';
                
                let gradeColor = signal.score >= 80 ? '#ffd700' : 
                                signal.score >= 60 ? '#ff8c00' : '#00d4ff';
                
                let html = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="color: #ff6b6b; margin: 0; font-size: 20px;">${rankId} ${signal.symbol}</h3>
                        <span style="background: ${gradeColor}; color: #000; padding: 5px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">
                            Grade: ${grade}
                        </span>
                    </div>
                    
                    <p style="color: #94a3b8; margin: 10px 0 0 0;">${signal.action}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div>
                            <div style="color: #94a3b8; font-size: 12px;">PRICE</div>
                            <div style="color: #22c55e; font-size: 18px; font-weight: bold;">$${signal.price}</div>
                        </div>
                        <div>
                            <div style="color: #94a3b8; font-size: 12px;">SCORE</div>
                            <div style="color: #3b82f6; font-size: 18px; font-weight: bold;">${signal.score}/100</div>
                        </div>
                        <div>
                            <div style="color: #94a3b8; font-size: 12px;">R:R</div>
                            <div style="color: #ff6b6b; font-size: 18px; font-weight: bold;">2.50:1</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <div style="color: #94a3b8; font-size: 12px;">CONFLUENCE</div>
                        <div style="color: #e2e8f0; font-size: 13px; margin-top: 5px;">
                            ${signal.reason}
                        </div>
                    </div>
                    
                    <button style="
                        width: 100%;
                        padding: 12px;
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-top: 15px;
                    ">+ Add to Portfolio</button>
                    
                    <button style="
                        width: 100%;
                        padding: 10px;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-top: 8px;
                        font-size: 12px;
                    ">📊 View Chart</button>
                `;
                
                // Replace card content
                if (idx === 0 || idx === 1) {
                    card.innerHTML = html;
                }
            }
        });
    },

    // ============================================
    // UPDATE STATS
    // ============================================
    updateStats() {
        if (!window.BaconScanner) return;
        
        const scanner = window.BaconScanner;
        const signals = scanner.signals;
        
        // Total signals
        const totalEl = document.querySelector('[style*="color: #22c55e"]');
        if (totalEl && totalEl.textContent.includes('38')) {
            totalEl.textContent = signals.length;
        }
        
        // Avg score
        const avgScore = signals.length > 0 
            ? Math.round(signals.reduce((s, a) => s + a.score, 0) / signals.length)
            : 0;
        
        const avgEl = document.querySelector('[style*="color: #3b82f6"][style*="font-size: 24px"]');
        if (avgEl) {
            avgEl.textContent = avgScore;
        }
        
        // Legendary signals (score >= 80)
        const legendary = signals.filter(s => s.score >= 80).length;
        const legendaryEl = document.querySelectorAll('[style*="color: #ff8c00"]');
        if (legendaryEl.length > 0) {
            legendaryEl[0].parentElement.querySelector('div:last-child').textContent = legendary;
        }
        
        // Whale signals (Bullish MACD)
        const whales = signals.filter(s => s.reason.includes('Bullish')).length;
        const whaleEl = document.querySelectorAll('[style*="color: #ff8c00"]');
        if (whaleEl.length > 1) {
            whaleEl[1].parentElement.querySelector('div:last-child').textContent = whales;
        }
    },

    updatePortfolio() {
        // Update portfolio if visible
        const portfolio = document.getElementById('portfolio-panel');
        if (portfolio) {
            // Inject live portfolio data here
        }
    }
};

// Auto-init when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconLiveDashboard.init());
} else {
    BaconLiveDashboard.init();
}

window.BaconLiveDashboard = BaconLiveDashboard;
