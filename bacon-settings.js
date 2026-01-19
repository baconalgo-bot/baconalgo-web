/**
 * BaconAlgo Settings Panel
 * Configuration sécurisée des clés API et préférences
 */

const BaconSettings = {
    init() {
        console.log('⚙️ BaconSettings initialized');
        this.createSettingsPanel();
        this.loadSettings();
    },

    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'bacon-settings-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        `;
        panel.innerHTML = '⚙️';
        panel.title = 'Settings';
        
        panel.addEventListener('click', () => this.openSettingsModal());
        panel.addEventListener('mouseover', () => {
            panel.style.transform = 'scale(1.1)';
        });
        panel.addEventListener('mouseout', () => {
            panel.style.transform = 'scale(1)';
        });

        document.body.appendChild(panel);
    },

    openSettingsModal() {
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
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: #e2e8f0;
        `;

        content.innerHTML = `
            <h2 style="color: #667eea; margin-bottom: 20px;">⚙️ BaconAlgo Settings</h2>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #94a3b8;">Interactive Brokers</h3>
                <input type="password" id="ib-key" placeholder="API Key" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <input type="text" id="ib-account" placeholder="Account ID" style="
                    width: 100%;
                    padding: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <button id="save-ib" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                ">Save IB</button>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #94a3b8;">Bitget</h3>
                <input type="password" id="bitget-key" placeholder="API Key" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <input type="password" id="bitget-secret" placeholder="API Secret" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <input type="password" id="bitget-pass" placeholder="Passphrase" style="
                    width: 100%;
                    padding: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <button id="save-bitget" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                ">Save Bitget</button>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #94a3b8;">Discord Webhook</h3>
                <input type="text" id="discord-webhook" placeholder="Webhook URL" style="
                    width: 100%;
                    padding: 10px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #e2e8f0;
                    border-radius: 4px;
                ">
                <button id="save-discord" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                ">Save Discord</button>
            </div>

            <button style="
                width: 100%;
                padding: 10px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            " onclick="document.body.removeChild(this.parentElement.parentElement)">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('save-ib').addEventListener('click', () => {
            const key = document.getElementById('ib-key').value;
            const account = document.getElementById('ib-account').value;
            if (key && account) {
                BaconConfig.setIB(key, account);
                alert('✅ IB configured!');
            }
        });

        document.getElementById('save-bitget').addEventListener('click', () => {
            const key = document.getElementById('bitget-key').value;
            const secret = document.getElementById('bitget-secret').value;
            const pass = document.getElementById('bitget-pass').value;
            if (key && secret && pass) {
                BaconConfig.setBitget(key, secret, pass);
                alert('✅ Bitget configured!');
            }
        });

        document.getElementById('save-discord').addEventListener('click', () => {
            const webhook = document.getElementById('discord-webhook').value;
            if (webhook) {
                BaconConfig.setDiscordWebhook(webhook);
                alert('✅ Discord configured!');
            }
        });
    },

    loadSettings() {
        // Load from localStorage when modal opens
        console.log('Settings loaded');
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaconSettings.init());
} else {
    BaconSettings.init();
}

window.BaconSettings = BaconSettings;
