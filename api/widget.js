module.exports = function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const widgetHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>x402 Donation Widget</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .widget-container {
            background: #1a1a1a;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
            max-width: 400px;
            width: 100%;
        }

        .widget-header {
            text-align: center;
            margin-bottom: 24px;
        }

        .widget-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .widget-subtitle {
            color: #888;
            font-size: 14px;
        }

        .amount-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }

        .amount-option {
            background: #2a2a2a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .amount-option:hover {
            border-color: #00ff88;
            background: #2a2a2a;
        }

        .amount-option.selected {
            border-color: #00ff88;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
        }

        .amount-value {
            font-size: 18px;
            font-weight: 700;
        }

        .amount-label {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 4px;
        }

        .custom-amount {
            margin-bottom: 24px;
        }

        .custom-amount input {
            width: 100%;
            background: #2a2a2a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 16px;
            color: #fff;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }

        .custom-amount input:focus {
            outline: none;
            border-color: #00ff88;
        }

        .custom-amount input::placeholder {
            color: #666;
        }

        .selected-amount {
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 24px;
            font-weight: 700;
            font-size: 18px;
        }

        .wallet-section {
            margin-bottom: 24px;
        }

        .wallet-status {
            background: #2a2a2a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin-bottom: 16px;
        }

        .wallet-connected {
            border-color: #00ff88;
            background: #1a2a1a;
        }

        .wallet-address {
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            margin-top: 8px;
            color: #00ff88;
        }

        .connect-wallet-btn {
            width: 100%;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
            border: none;
            border-radius: 8px;
            padding: 16px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .connect-wallet-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
        }

        .connect-wallet-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .donate-btn {
            width: 100%;
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 16px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 16px;
        }

        .donate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
        }

        .donate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .status-message {
            text-align: center;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
        }

        .status-success {
            background: #1a2a1a;
            border: 1px solid #00ff88;
            color: #00ff88;
        }

        .status-error {
            background: #2a1a1a;
            border: 1px solid #ff6b6b;
            color: #ff6b6b;
        }

        .status-loading {
            background: #1a1a2a;
            border: 1px solid #6b6bff;
            color: #6b6bff;
        }

        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #00ff88;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        .success-checkmark {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #00ff88;
            border-radius: 50%;
            position: relative;
            margin-right: 8px;
        }

        .success-checkmark::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000;
            font-weight: bold;
            font-size: 12px;
        }

        .error-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #ff6b6b;
            border-radius: 50%;
            position: relative;
            margin-right: 8px;
        }

        .error-icon::after {
            content: '✕';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-weight: bold;
            font-size: 12px;
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #333;
            color: #666;
            font-size: 12px;
        }

        .footer a {
            color: #00ff88;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="widget-header">
            <div class="widget-title">Support with Crypto</div>
            <div class="widget-subtitle">Powered by x402 Protocol</div>
        </div>

        <div class="amount-options">
            <div class="amount-option" data-amount="1">
                <div class="amount-value">$1</div>
                <div class="amount-label">Quick Tip</div>
            </div>
            <div class="amount-option" data-amount="5">
                <div class="amount-value">$5</div>
                <div class="amount-label">Nice!</div>
            </div>
            <div class="amount-option" data-amount="10">
                <div class="amount-value">$10</div>
                <div class="amount-label">Awesome!</div>
            </div>
        </div>

        <div class="custom-amount">
            <input type="number" placeholder="Custom amount (USD)" min="0.01" step="0.01">
        </div>

        <div class="selected-amount" style="display: none;">
            Selected: $<span id="selected-amount-value">0</span>
        </div>

        <div class="wallet-section">
            <div class="wallet-status" id="wallet-status">
                <div>Wallet not connected</div>
                <button class="connect-wallet-btn" id="connect-wallet-btn">Connect Wallet</button>
            </div>
        </div>

        <div class="status-message" id="status-message" style="display: none;"></div>

        <button class="donate-btn" id="donate-btn" disabled>Donate</button>

        <div class="footer">
            <p>Built with ❤️ by <a href="https://valipokkann.in" target="_blank">valipokkann</a> | Powered by <a href="https://x402.org" target="_blank">x402 protocol</a></p>
        </div>
    </div>

    <script type="module">
        import { createPublicClient, http } from 'https://cdn.jsdelivr.net/npm/viem@2.7.9/+esm';
        import { baseSepolia } from 'https://cdn.jsdelivr.net/npm/viem@2.7.9/chains/+esm';
        import { wrapFetchWithPayment } from 'https://cdn.jsdelivr.net/npm/x402-fetch@0.0.1/+esm';

        // Configuration
        const API_BASE = window.location.origin;
        const DEFAULT_AMOUNT = 1;
        let selectedAmount = DEFAULT_AMOUNT;
        let connectedWallet = null;

        // DOM elements
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountInput = document.querySelector('.custom-amount input');
        const selectedAmountEl = document.querySelector('.selected-amount');
        const selectedAmountValue = document.getElementById('selected-amount-value');
        const walletStatus = document.getElementById('wallet-status');
        const connectWalletBtn = document.getElementById('connect-wallet-btn');
        const donateBtn = document.getElementById('donate-btn');
        const statusMessage = document.getElementById('status-message');

        // Initialize
        updateSelectedAmount();
        setupEventListeners();

        function setupEventListeners() {
            // Amount selection
            amountOptions.forEach(option => {
                option.addEventListener('click', () => {
                    amountOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedAmount = parseFloat(option.dataset.amount);
                    updateSelectedAmount();
                });
            });

            // Custom amount input
            customAmountInput.addEventListener('input', () => {
                const value = parseFloat(customAmountInput.value);
                if (value > 0) {
                    amountOptions.forEach(opt => opt.classList.remove('selected'));
                    selectedAmount = value;
                    updateSelectedAmount();
                }
            });

            // Connect wallet
            connectWalletBtn.addEventListener('click', connectWallet);

            // Donate
            donateBtn.addEventListener('click', handleDonation);
        }

        function updateSelectedAmount() {
            selectedAmountValue.textContent = selectedAmount.toFixed(2);
            selectedAmountEl.style.display = 'block';
        }

        async function connectWallet() {
            try {
                showStatus('Connecting wallet...', 'loading');
                connectWalletBtn.disabled = true;
                connectWalletBtn.innerHTML = '<span class="loading-spinner"></span>Connecting...';

                // Check if MetaMask is available
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    
                    if (accounts.length > 0) {
                        connectedWallet = accounts[0];
                        
                        // Try to switch to Base Sepolia
                        try {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x14a33' }], // Base Sepolia
                            });
                        } catch (switchError) {
                            // If Base Sepolia is not added, add it
                            if (switchError.code === 4902) {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                        chainId: '0x14a33',
                                        chainName: 'Base Sepolia',
                                        nativeCurrency: {
                                            name: 'ETH',
                                            symbol: 'ETH',
                                            decimals: 18
                                        },
                                        rpcUrls: ['https://sepolia.base.org'],
                                        blockExplorerUrls: ['https://sepolia.basescan.org']
                                    }]
                                });
                            }
                        }

                        walletStatus.innerHTML = \`
                            <div style="color: #00ff88;">✓ Wallet Connected</div>
                            <div class="wallet-address">\${connectedWallet}</div>
                        \`;
                        walletStatus.classList.add('wallet-connected');
                        connectWalletBtn.style.display = 'none';
                        donateBtn.disabled = false;
                        
                        showStatus('Wallet connected successfully!', 'success');
                        setTimeout(() => hideStatus(), 3000);
                    }
                } else {
                    throw new Error('No wallet found. Please install MetaMask or Coinbase Wallet.');
                }
            } catch (error) {
                console.error('Wallet connection error:', error);
                showStatus(\`Connection failed: \${error.message}\`, 'error');
                connectWalletBtn.disabled = false;
                connectWalletBtn.textContent = 'Connect Wallet';
            }
        }

        async function handleDonation() {
            if (!connectedWallet) {
                showStatus('Please connect your wallet first', 'error');
                return;
            }

            try {
                donateBtn.disabled = true;
                donateBtn.innerHTML = '<span class="loading-spinner"></span>Processing...';
                showStatus('Processing payment...', 'loading');

                const response = await wrapFetchWithPayment(
                    \`\${API_BASE}/api/donate\`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: selectedAmount
                        })
                    },
                    {
                        maxValue: BigInt(1000 * 10 ** 6), // Allow up to $1000 USDC
                        wallet: window.ethereum
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    showStatus('Payment completed successfully!', 'success');
                    donateBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
                    donateBtn.style.color = '#000';
                    donateBtn.innerHTML = '<span class="success-checkmark"></span>Thank you!';
                    
                    setTimeout(() => {
                        donateBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
                        donateBtn.style.color = '#fff';
                        donateBtn.innerHTML = 'Donate';
                        donateBtn.disabled = false;
                        hideStatus();
                    }, 3000);
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                console.error('Donation error:', error);
                showStatus(\`Payment failed: \${error.message}\`, 'error');
                donateBtn.disabled = false;
                donateBtn.innerHTML = 'Donate';
            }
        }

        function showStatus(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = \`status-message status-\${type}\`;
            statusMessage.style.display = 'block';
        }

        function hideStatus() {
            statusMessage.style.display = 'none';
        }
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(widgetHtml);
} 