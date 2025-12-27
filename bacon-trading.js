/**
 * BaconAlgo Auto-Trading Module
 * Intègre Interactive Brokers (IB) + Bitget
 * Aucune modification du HTML - Injection dynamique
 */

const BaconTrading = {
    // Configuration des brokers
    brokers: {
        ib: {
            name: 'Interactive Brokers',
            icon: '🔵',
            color: '#667eea',
            endpoint: 'https://api.ibkr.com/v1/orders'
        },
        bitget: {
            name: 'Bitget',
            icon: '💰',
            color: '#ff6b00',
            endpoint: 'https://api.bitget.com/v2/spot/trade/submit-order'
        }
    },

    // Clés API (à remplacer par les vraies)
    apiKeys: {
        ib: localStorage.getItem('ib_api_key') || null,
        bitget: localStorage.getItem('bitget_api_key') || null
    },

    // Initialiser le module
    init() {
        console.log('🥓 BaconTrading initialized');
        this.injectTradeButtons();
        this.setupEventListeners();
    },

    // Injecter les boutons de trade dans chaque signal
    injectTradeButtons() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const signalCards = document.querySelectorAll('.signal-card');
                signalCards.forEach((card, index) => {
                    const existingButtons = card.querySelector('.bacon-trade-buttons');
                    if (!existingButtons) {
                        this.addTradeButtonsToCard(card, index);
                    }
                });
            }, 500);
        });
    },

    // Ajouter les boutons à une carte de signal
    addTradeButtonsToCard(card, signalId) {
        const tradeDiv = document.createElement('div');
        tradeDiv.className = 'bacon-trade-buttons';
        tradeDiv.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #334155;
        `;

        // Récupérer les données du signal
        const symbolEl = card.querySelector('.signal-symbol');
        const symbol = symbolEl ? symbolEl.textContent : 'UNKNOWN';
        const entryEl = card.querySelector('.signal-item-value');
        const entry = entryEl ? parseFloat(entryEl.textContent.replace('$', '')) : 0;

        // Bouton IB
        const ibBtn = document.createElement('button');
        ibBtn.innerHTML = '🔵 Trade IB';
        ibBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.3s;
        `;
        ibBtn.onmouseover = () => ibBtn.style.background = '#7c8ff0';
        ibBtn.onmouseout = () => ibBtn.style.background = '#667eea';
        ibBtn.onclick = () => this.tradeIB(symbol, entry, signalId);

        // Bouton Bitget
        const bgBtn = document.createElement('button');
        bgBtn.innerHTML = '💰 Trade Bitget';
        bgBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #ff6b00;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.3s;
        `;
        bgBtn.onmouseover = () => bgBtn.style.background = '#ff8533';
        bgBtn.onmouseout = () => bgBtn.style.background = '#ff6b00';
        bgBtn.onclick = () => this.tradeBitget(symbol, entry, signalId);

        tradeDiv.appendChild(ibBtn);
        tradeDiv.appendChild(bgBtn);
        card.appendChild(tradeDiv);
    },

    // Trade sur IB
    async tradeIB(symbol, entry, signalId) {
        if (!this.apiKeys.ib) {
            alert('❌ Clé API IB non configurée!\nAllez sur https://baconalgo.com/settings');
            return;
        }

        try {
            const response = await fetch(this.brokers.ib.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.ib}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symbol: symbol,
                    orderType: 'LMT',
                    action: 'BUY',
                    quantity: 100,
                    limitPrice: entry,
                    timeInForce: 'DAY'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ IB Order placed:', data);
                this.logTrade('ib', symbol, entry, signalId, data.orderId);
                alert(`✅ Ordre IB placé!\nOrdre #${data.orderId}`);
            } else {
                alert('❌ Erreur IB: ' + response.statusText);
            }
        } catch (err) {
            console.error('IB Trade Error:', err);
            alert('❌ Erreur: ' + err.message);
        }
    },

    // Trade sur Bitget
    async tradeBitget(symbol, entry, signalId) {
        if (!this.apiKeys.bitget) {
            alert('❌ Clé API Bitget non configurée!\nAllez sur https://baconalgo.com/settings');
            return;
        }

        try {
            const response = await fetch(this.brokers.bitget.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.bitget}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symbol: symbol + 'USDT',
                    side: 'buy',
                    orderType: 'limit',
                    price: entry.toString(),
                    size: '0.01',
                    timeInForce: 'gtc'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Bitget Order placed:', data);
                this.logTrade('bitget', symbol, entry, signalId, data.data.orderId);
                alert(`✅ Ordre Bitget placé!\nOrdre #${data.data.orderId}`);
            } else {
                alert('❌ Erreur Bitget: ' + response.statusText);
            }
        } catch (err) {
            console.error('Bitget Trade Error:', err);
            alert('❌ Erreur: ' + err.message);
        }
    },

    // Logger les trades dans Supabase
    async logTrade(broker, symbol, entry, signalId, orderId) {
        try {
            const { data, error } = await supabase
                .from('trades')
                .insert({
                    signal_id: signalId,
                    broker: broker,
                    symbol: symbol,
                    entry: entry,
                    order_id: orderId,
                    created_at: new Date().toISOString()
                });

            if (error) console.error('Supabase error:', error);
            else console.log('✅ Trade logged:', data);
        } catch (err) {
            console.error('Log trade error:', err);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Observer pour les nouveaux signaux
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('signal-card')) {
                            if (!node.querySelector('.bacon-trade-buttons')) {
                                this.addTradeButtonsToCard(node, Date.now());
                            }
                        }
                    });
                }
            });
        });

        const container = document.getElementById('signalsContainer');
        if (container) {
            observer.observe(container, { childList: true });
        }
    }
};

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconTrading.init());
} else {
    BaconTrading.init();
}
