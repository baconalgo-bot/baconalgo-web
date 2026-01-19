/**
 * 🔥 BACONALGO LIVE DASHBOARD - SIMPLIFIÉ
 * Met à jour les cartes GOOGL/QQQ avec les signaux du scanner
 */

const BaconLiveDashboard = {
    updateInterval: 2000,
    lastSignalIdx: 0,
    
    init() {
        console.log('🎯 BACON LIVE DASHBOARD STARTING...');
        
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
        }, this.updateInterval);
        
        // First update immediately
        this.updateTopSignals();
        this.updateStats();
    },

    // ============================================
    // UPDATE TOP SIGNALS - SIMPLE & DIRECT
    // ============================================
    updateTopSignals() {
        if (!window.BaconScanner || !window.BaconScanner.signals) return;
        
        const signals = window.BaconScanner.signals;
        if (signals.length === 0) return;
        
        // Get top 2 signals
        const signal1 = signals[0];
        const signal2 = signals[1] || signals[0];
        
        // Update card #1 (GOOGL)
        this.updateCardByPosition(0, signal1, '#1');
        
        // Update card #2 (QQQ) 
        this.updateCardByPosition(1, signal2, '#2');
    },

    updateCardByPosition(position, signal, rankLabel) {
        try {
            // Find all cards in the TOP SIGNALS section
            const allDivs = document.querySelectorAll('div');
            let topSignalsFound = false;
            let cardCount = 0;
            
            for (let div of allDivs) {
                // Look for "TOP SIGNALS" marker
                if (div.textContent.includes('TOP SIGNALS')) {
                    topSignalsFound = true;
                    continue;
                }
                
                // After finding TOP SIGNALS, look for grade badges
                if (topSignalsFound && div.textContent.includes('Grade: LEGENDARY')) {
                    if (cardCount === position) {
                        // Found the card to update!
                        this.updateCardHTML(div, signal, rankLabel);
                        return;
                    }
                    cardCount++;
                }
            }
        } catch (err) {
            console.error('Card update error:', err);
        }
    },

    updateCardHTML(cardElement, signal, rankLabel) {
        try {
            // Find and update symbol
            const h3 = cardElement.querySelector('h3');
            if (h3) {
                h3.textContent = `${rankLabel} ${signal.symbol}`;
            }
            
            // Find and update grade
            const gradeSpan = Array.from(cardElement.querySelectorAll('span')).find(s => s.textContent.includes('Grade:'));
            if (gradeSpan) {
                let grade = signal.score >= 80 ? 'LEGENDARY' : signal.score >= 60 ? 'EPIC' : 'RARE';
                let color = signal.score >= 80 ? '#ffd700' : signal.score >= 60 ? '#ff8c00' : '#00d4ff';
                gradeSpan.textContent = `Grade: ${grade}`;
                gradeSpan.style.background = color;
            }
            
            // Find all price/score values
            const values = Array.from(cardElement.querySelectorAll('div')).filter(d => 
                d.textContent.match(/^\$\d+/) || d.textContent.match(/^\d+\/100/)
            );
            
            // Update prices and score
            if (values.length >= 3) {
                values[0].textContent = `$${signal.price}`;  // Entry price
                values[1].textContent = `$${signal.price}`;  // Target
                values[2].textContent = `${signal.score}/100`; // Score
            }
            
            // Update reason/confluence
            const reasonDivs = Array.from(cardElement.querySelectorAll('div')).filter(d => 
                d.textContent.includes('📈') || d.textContent.includes('📉') || 
                d.textContent.includes('Uptrend') || d.textContent.includes('Downtrend')
            );
            if (reasonDivs.length > 0) {
                reasonDivs[reasonDivs.length - 1].textContent = signal.reason;
            }
            
            console.log(`✅ Card updated: ${rankLabel} ${signal.symbol} @ $${signal.price}`);
        } catch (err) {
            console.error('HTML update error:', err);
        }
    },

    // ============================================
    // UPDATE STATS
    // ============================================
    updateStats() {
        if (!window.BaconScanner) return;
        
        const signals = window.BaconScanner.signals;
        if (signals.length === 0) return;
        
        try {
            // Find stat divs by their current values
            const allDivs = document.querySelectorAll('div');
            
            // Update "Total" from 38 to signal count
            for (let div of allDivs) {
                if (div.textContent.trim() === '38') {
                    div.textContent = signals.length;
                    break;
                }
            }
            
            // Update "Avg Score" from 94 to actual average
            const avgScore = Math.round(signals.reduce((s, a) => s + a.score, 0) / signals.length);
            for (let div of allDivs) {
                if (div.textContent.trim() === '94') {
                    div.textContent = avgScore;
                    break;
                }
            }
        } catch (err) {
            console.error('Stats update error:', err);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconLiveDashboard.init());
} else {
    BaconLiveDashboard.init();
}

window.BaconLiveDashboard = BaconLiveDashboard;
