# 🥓 BaconAlgo - Trading Platform Complète

## 📋 Vue d'ensemble

**BaconAlgo** est une plateforme de trading automatisée et modulaire construite avec:
- ✅ JavaScript pur (zéro dépendances)
- ✅ Intégration multi-broker (Interactive Brokers + Bitget)
- ✅ Webhooks TradingView
- ✅ Alerts Discord, Telegram, Push Notifications
- ✅ Gestion des risques avancée
- ✅ Analytics & Backtesting
- ✅ Export CSV/Excel des trades

---

## 🚀 Installation Rapide

### 1️⃣ **Télécharge les fichiers**

Crée un dossier `BaconAlgo/` et télécharge:

```
bacon-config.js        ⚙️ Configuration (CHARGER EN PREMIER)
bacon-settings.js      🔧 Settings Panel
bacon-trading.js       💹 Execution des trades
bacon-portfolio.js     📊 Portfolio tracking
bacon-discord.js       💬 Discord alerts
bacon-analytics.js     📈 Charts & analytics
bacon-history.js       📋 Trade history & export
bacon-risk.js          🛑 Risk management
bacon-webhooks.js      🔗 Webhooks & integrations
```

### 2️⃣ **Ajoute à ton HTML**

Dans ton `dashboard.html`, ajoute avant `</body>`:

```html
<!-- 🥓 BaconAlgo Modules -->
<script src="bacon-config.js"></script>
<script src="bacon-settings.js"></script>
<script src="bacon-trading.js"></script>
<script src="bacon-portfolio.js"></script>
<script src="bacon-discord.js"></script>
<script src="bacon-analytics.js"></script>
<script src="bacon-history.js"></script>
<script src="bacon-risk.js"></script>
<script src="bacon-webhooks.js"></script>
```

### 3️⃣ **Configure les clés API**

Ouvre la console navigateur (F12) et exécute:

```javascript
// Configure Interactive Brokers
BaconConfig.setIB('TON_IB_API_KEY', 'TON_IB_ACCOUNT_ID');

// Configure Bitget
BaconConfig.setBitget('BITGET_KEY', 'BITGET_SECRET', 'BITGET_PASSPHRASE');

// Configure Discord (optionnel, déjà pré-configuré)
BaconConfig.setDiscordWebhook('TON_DISCORD_WEBHOOK');
```

**OU utilise le Settings Panel (⚙️ en bas-à-gauche)**

---

## 📖 Guide des Modules

### ⚙️ **BaconConfig** - Configuration Centrale
Gère toutes les clés API et configurations globales:
```javascript
BaconConfig.getAPI('ib')           // Récupère les données IB
BaconConfig.getAPI('bitget')       // Récupère les données Bitget
BaconConfig.getAPI('discord')      // Récupère le webhook Discord
```

### 🔧 **BaconSettings** - Panneau de Configuration
Bouton ⚙️ en bas-à-gauche pour:
- Ajouter/modifier clés API
- Gérer webhooks
- Tester connexions

### 💹 **BaconTrading** - Exécution des Trades
- Execute trades sur IB ou Bitget
- Gère les ordres limités/au marché
- Trailing stops automatiques

```javascript
// Executer un trade
await BaconTrading.executeTrade('BUY', 'AAPL', 100, 'IB');
```

### 📊 **BaconPortfolio** - Suivi du Portefeuille
- Positions ouvertes en temps réel
- Calcul du P&L
- Allocation d'actifs
- Visualisation graphique

### 💬 **BaconDiscord** - Alertes Discord
Envoie automatiquement les signaux de trading à Discord:
```javascript
BaconDiscord.send({
    title: 'Signal AAPL',
    description: 'BUY @ $150',
    color: 34816
});
```

### 📈 **BaconAnalytics** - Charts & Statistiques
Bouton 📈 en haut-à-droite pour:
- **Charts**: Timeline P&L, Distribution wins/losses, Daily returns, Cumulative P&L
- **Heatmap**: Performance par symbole/jour/heure
- **Stats**: Métriques détaillées (win rate, avg trade, etc.)

### 📋 **BaconHistory** - Historique des Trades
Bouton 📊 en bas-à-gauche pour:
- Table complète de tous les trades
- Filtrage par date/symbole/broker
- **Export CSV** pour analyse Excel

### 🛑 **BaconRisk** - Gestion des Risques
Bouton 🛑 pour configurer:
- **Daily Loss Limit**: Arrête trading si perte quotidienne atteinte
- **Max Position Size**: Limite par position
- **Risk Per Trade**: % du capital à risquer par trade
- Monitoring continu en temps réel

### 🔗 **BaconWebhooks** - Intégrations Avancées
Bouton 🔗 pour:
- **TradingView Webhooks**: Copie les signaux TV automatiquement
- **Telegram**: Reçois les alerts sur Telegram
- **Push Notifications**: Notifications desktop

---

## 🔌 API & Webhooks

### TradingView → BaconAlgo

1. Dans TradingView, crée une alerte
2. Va dans "Notifications" → "Webhook URL"
3. Colle: `YOUR_DOMAIN/api/webhook/WEBHOOK_KEY`
4. Format du message JSON:
```json
{
  "action": "BUY",
  "symbol": "AAPL",
  "quantity": 100,
  "broker": "IB"
}
```

### Telegram Bot

1. Crée un bot sur @BotFather (Telegram)
2. Récupère le token
3. Trouve ton Chat ID: `https://api.telegram.org/botTON_TOKEN/getUpdates`
4. Configure dans BaconAlgo Settings

---

## 📊 Données Supabase

Table `trades` requise:
```sql
CREATE TABLE trades (
    id UUID PRIMARY KEY,
    symbol VARCHAR(20),
    broker VARCHAR(20),
    action VARCHAR(10),
    entry_price DECIMAL,
    exit_price DECIMAL,
    pnl DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## ⚡ Fonctionnalités Avancées

### Trailing Stop Automatique
```javascript
BaconTrading.setTrailingStop('AAPL', 0.02); // 2% trailing stop
```

### Position Sizing Automatique
```javascript
const size = BaconRisk.calculatePositionSize(100, 2); // 100$ risque, 2% stop
```

### Risk-Reward Ratio
```javascript
const ratio = BaconRisk.calculateRiskReward(entry, stop, target);
```

---

## 🐛 Troubleshooting

### Les boutons ne s'affichent pas?
- Vérifiez que tous les `.js` sont importés
- Ouvrez la console (F12) pour les erreurs
- Rechargez la page

### Discord alerts ne fonctionnent pas?
- Vérifiez le webhook URL
- Testez avec: `curl -X POST -H 'Content-Type: application/json' -d '{"content":"test"}' YOUR_WEBHOOK`

### Trades ne s'exécutent pas?
- Vérifiez les clés API dans Settings
- Testez la connexion au broker
- Vérifiez les logs de console

---

## 📈 Performance Tracking

Les données sont sauvegardées automatiquement dans Supabase:
- ✅ Tous les trades
- ✅ P&L quotidien/total
- ✅ Win/Loss ratio
- ✅ Drawdown
- ✅ Sharpe ratio (calculé automatiquement)

---

## 🔐 Sécurité

⚠️ **Clés API:**
- Jamais commit les clés dans Git
- Utilisez `.env` en production
- Chiffrez les clés sensibles
- Utilisez HTTPS uniquement

**localStorage** est utilisé localement - en prod, utilisez un backend sécurisé.

---

## 📞 Support

Erreurs? Questions?
1. Ouvrez la console (F12)
2. Copier les erreurs
3. Vérifiez la configuration
4. Testez chaque module séparément

---

## 🚀 Déploiement

### Vercel
```bash
git add .
git commit -m "Add BaconAlgo modules"
git push
```

Déploiement automatique! ✨

### Auto-Trade (Production)
```bash
# Backend pour webhooks
python bacon_signal_pusher_v2.py

# Frontend sur Vercel/Netlify
npm run deploy
```

---

**Construire une fortune, 1 trade à la fois 🥓💰**
