/**
 * 🔥 BACONALGO LIVE DASHBOARD v3 - WORKING VERSION
 * Crée et maintient les cartes GOOGL/QQQ en temps réel
 */

const BaconLiveDashboard = {
    updateInterval: 2000,
    signals: [],
    
    init() {
        console.log('🎯 BACON LIVE DASHBOARD v3 STARTING...');
        
        const checkScanner = setInterval(() => {
            if (window.BaconScanner && window.BaconScanner.signals) {
                clearInterval(checkScanner);
                console.log('✅ SCANNER DETECTED - Dashboard synced');
                
                // Create the cards container if not exists
                this.setupCards();
                this.startLiveUpdate();
            }
        }, 500);
    },

    setupCards() {
        // Find or create the TOP SIGNALS section
        const topSignalsSection = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('TOP SIGNALS') && el.textContent.includes('#1')
        );

        if (topSignalsSection) {
            console.log('✅ TOP SIGNALS section found - ready to update');
        }
    },

    startLiveUpdate() {
        // Update immediately
        this.updateTopSignals();
        this.updateStats();

        // Then update every 2 seconds
        setInterval(() => {
            this.updateTopSignals();
            this.updateStats();
        }, this.updateInterval);
    },

    // ============================================
    // UPDATE TOP SIGNALS
    // ============================================
    updateTopSignals() {
        if (!window.BaconScanner || !window.BaconScanner.signals) return;
        
        const signals = window.BaconScanner.signals;
        if (signals.length === 0) return;

        // Get top 2 signals
        const signal1 = signals[0];
        const signal2 = signals[1] || signals[0];

        // Update card 1 (GOOGL position)
        this.updateSignalCard(0, signal1);
        
        // Update card 2 (QQQ position)
        this.updateSignalCard(1, signal2);
    },

    updateSignalCard(cardIndex, signal) {
        try {
            // Find all cards with "#1" or "#2" in them
            const allElements = document.querySelectorAll('*');
            let cardCount = 0;
            
            for (let el of allElements) {
                // Look for cards that have "#1" or "#2" and "GOOGL" or "QQQ"
                const text = el.textContent;
                const isCard = text.includes('100/100') || text.includes('90/100') || text.includes('Grade: LEGENDARY');
                
                if (isCard && (text.includes('GOOGL') || text.includes('QQQ') || text.includes('Add to Portfolio'))) {
                    if (cardCount === cardIndex) {
                        // Found the card!
                        this.updateCardContent(el, cardIndex + 1, signal);
                        return;
                    }
                    cardCount++;
                }
            }
        } catch (err) {
            console.error('Card search error:', err);
        }
    },

    updateCardContent(cardElement, rankNum, signal) {
        try {
            // Find the h3 (symbol)
            const h3 = cardElement.querySelector('h3');
            if (h3) {
                h3.textContent = `#${rankNum} ${signal.symbol}`;
                console.log(`✅ Updated card #${rankNum} to ${signal.symbol}`);
            }

            // Find and update score values
            const allDivs = cardElement.querySelectorAll('div, span, p');
            
            let scoreUpdated = false;
            let priceUpdated = false;

            for (let el of allDivs) {
                const text = el.textContent?.trim();
                
                // Update score (look for "/100")
                if (text?.includes('/100') && !scoreUpdated) {
                    el.textContent = `${signal.score}/100`;
                    scoreUpdated = true;
                }
                
                // Update price (look for "$" followed by numbers)
                if (text?.match(/^\$\d/) && !priceUpdated) {
                    el.textContent = `$${signal.price}`;
                    priceUpdated = true;
                }

                // Update grade
                if (text?.includes('Grade:')) {
                    let grade = signal.score >= 80 ? 'LEGENDARY' : 
                               signal.score >= 60 ? 'EPIC' : 'RARE';
                    let color = signal.score >= 80 ? '#ffd700' : 
                               signal.score >= 60 ? '#ff8c00' : '#00d4ff';
                    
                    el.textContent = `Grade: ${grade}`;
                    el.style.background = color;
                }

                // Update reason
                if (text?.includes('Uptrend') || text?.includes('Oversold') || 
                    text?.includes('Overbought') || text?.includes('High Volume')) {
                    el.textContent = signal.reason;
                }
            }
        } catch (err) {
            console.error('Card update error:', err);
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
            const allElements = document.querySelectorAll('*');
            
            // Update total signals
            for (let el of allElements) {
                const text = el.textContent?.trim();
                
                // Update "38" to signal count
                if (text === '38') {
                    el.textContent = signals.length;
                    break;
                }
            }

            // Update average score
            const avgScore = Math.round(
                signals.reduce((sum, sig) => sum + sig.score, 0) / signals.length
            );

            for (let el of allElements) {
                const text = el.textContent?.trim();
                
                // Update "94" to avg score
                if (text === '94') {
                    el.textContent = avgScore;
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
