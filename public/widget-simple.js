// x402 Universal Payment Widget - Simplified Version
// This version doesn't rely on external x402-fetch for testing

(function () {
  'use strict';

  // Configuration
  const API_BASE = window.location.origin;
  const DEFAULT_AMOUNT = 1;
  let selectedAmount = DEFAULT_AMOUNT;
  let connectedWallet = null;

  // Create widget HTML
  function createWidgetHTML() {
    return `
            <div class="x402-widget-container" style="
                background: #1a1a1a;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid #333;
                max-width: 400px;
                width: 100%;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #ffffff;
            ">
                <div class="widget-header" style="text-align: center; margin-bottom: 24px;">
                    <div class="widget-title" style="
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        background: linear-gradient(135deg, #00ff88, #00cc6a);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    ">Support with Crypto</div>
                    <div class="widget-subtitle" style="color: #888; font-size: 14px;">Powered by x402 Protocol</div>
                </div>

                <div class="amount-options" style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 24px;
                ">
                    <div class="amount-option" data-amount="1" style="
                        background: #2a2a2a;
                        border: 2px solid #333;
                        border-radius: 8px;
                        padding: 16px 12px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 600;
                    ">
                        <div class="amount-value" style="font-size: 18px; font-weight: 700;">$1</div>
                        <div class="amount-label" style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Quick Tip</div>
                    </div>
                    <div class="amount-option" data-amount="5" style="
                        background: #2a2a2a;
                        border: 2px solid #333;
                        border-radius: 8px;
                        padding: 16px 12px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 600;
                    ">
                        <div class="amount-value" style="font-size: 18px; font-weight: 700;">$5</div>
                        <div class="amount-label" style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Nice!</div>
                    </div>
                    <div class="amount-option" data-amount="10" style="
                        background: #2a2a2a;
                        border: 2px solid #333;
                        border-radius: 8px;
                        padding: 16px 12px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 600;
                    ">
                        <div class="amount-value" style="font-size: 18px; font-weight: 700;">$10</div>
                        <div class="amount-label" style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Awesome!</div>
                    </div>
                </div>

                <div class="custom-amount" style="margin-bottom: 24px;">
                    <input type="number" placeholder="Custom amount (USD)" min="0.01" step="0.01" style="
                        width: 100%;
                        background: #2a2a2a;
                        border: 2px solid #333;
                        border-radius: 8px;
                        padding: 16px;
                        color: #fff;
                        font-size: 16px;
                        transition: border-color 0.3s ease;
                    ">
                </div>

                <div class="selected-amount" style="
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                    color: #000;
                    padding: 16px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 24px;
                    font-weight: 700;
                    font-size: 18px;
                    display: none;
                ">
                    Selected: $<span id="selected-amount-value">0</span>
                </div>

                <div class="wallet-section" style="margin-bottom: 24px;">
                    <div class="wallet-status" id="wallet-status" style="
                        background: #2a2a2a;
                        border: 2px solid #333;
                        border-radius: 8px;
                        padding: 16px;
                        text-align: center;
                        margin-bottom: 16px;
                    ">
                        <div>Wallet not connected</div>
                        <button class="connect-wallet-btn" id="connect-wallet-btn" style="
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
                            margin-top: 12px;
                        ">Connect Wallet</button>
                    </div>
                </div>

                <div class="status-message" id="status-message" style="
                    text-align: center;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    display: none;
                "></div>

                <button class="donate-btn" id="donate-btn" disabled style="
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
                ">Donate</button>

                <div class="footer" style="
                    text-align: center;
                    margin-top: 24px;
                    padding-top: 16px;
                    border-top: 1px solid #333;
                    color: #666;
                    font-size: 12px;
                ">
                    <p>Built with ❤️ by <a href="https://valipokkann.in" target="_blank" style="color: #00ff88; text-decoration: none;">valipokkann</a> | Powered by <a href="https://x402.org" target="_blank" style="color: #00ff88; text-decoration: none;">x402 protocol</a></p>
                </div>
            </div>
        `;
  }

  // Initialize widget
  function initWidget() {
    const container = document.getElementById('x402-widget');
    if (!container) {
      console.error('x402-widget container not found');
      return;
    }

    container.innerHTML = createWidgetHTML();
    updateSelectedAmount();
    setupEventListeners();
  }

  // Update selected amount display
  function updateSelectedAmount() {
    const selectedAmountValue = document.getElementById('selected-amount-value');
    const selectedAmountEl = document.querySelector('.selected-amount');
    if (selectedAmountValue && selectedAmountEl) {
      selectedAmountValue.textContent = selectedAmount.toFixed(2);
      selectedAmountEl.style.display = 'block';
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Amount selection
    const amountOptions = document.querySelectorAll('.amount-option');
    amountOptions.forEach(option => {
      option.addEventListener('click', () => {
        amountOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedAmount = parseFloat(option.dataset.amount);
        updateSelectedAmount();
      });
    });

    // Custom amount input
    const customAmountInput = document.querySelector('.custom-amount input');
    if (customAmountInput) {
      customAmountInput.addEventListener('input', () => {
        const value = parseFloat(customAmountInput.value);
        if (value > 0) {
          amountOptions.forEach(opt => opt.classList.remove('selected'));
          selectedAmount = value;
          updateSelectedAmount();
        }
      });
    }

    // Connect wallet
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    if (connectWalletBtn) {
      connectWalletBtn.addEventListener('click', connectWallet);
    }

    // Donate
    const donateBtn = document.getElementById('donate-btn');
    if (donateBtn) {
      donateBtn.addEventListener('click', handleDonation);
    }
  }

  // Connect wallet function
  async function connectWallet() {
    try {
      showStatus('Connecting wallet...', 'loading');
      const connectWalletBtn = document.getElementById('connect-wallet-btn');
      if (connectWalletBtn) {
        connectWalletBtn.disabled = true;
        connectWalletBtn.innerHTML = '<span class="loading-spinner"></span>Connecting...';
      }

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

          const walletStatus = document.getElementById('wallet-status');
          if (walletStatus) {
            walletStatus.innerHTML = `
                            <div style="color: #00ff88;">✓ Wallet Connected</div>
                            <div style="font-family: monospace; font-size: 12px; word-break: break-all; margin-top: 8px; color: #00ff88;">${connectedWallet}</div>
                        `;
            walletStatus.classList.add('wallet-connected');
          }

          if (connectWalletBtn) {
            connectWalletBtn.style.display = 'none';
          }

          const donateBtn = document.getElementById('donate-btn');
          if (donateBtn) {
            donateBtn.disabled = false;
          }

          showStatus('Wallet connected successfully!', 'success');
          setTimeout(() => hideStatus(), 3000);
        }
      } else {
        throw new Error('No wallet found. Please install MetaMask or Coinbase Wallet.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      showStatus(`Connection failed: ${error.message}`, 'error');
      const connectWalletBtn = document.getElementById('connect-wallet-btn');
      if (connectWalletBtn) {
        connectWalletBtn.disabled = false;
        connectWalletBtn.textContent = 'Connect Wallet';
      }
    }
  }

  // Handle donation function (simplified)
  async function handleDonation() {
    if (!connectedWallet) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    try {
      const donateBtn = document.getElementById('donate-btn');
      if (donateBtn) {
        donateBtn.disabled = true;
        donateBtn.innerHTML = '<span class="loading-spinner"></span>Processing...';
      }
      showStatus('Processing payment...', 'loading');

      // Use regular fetch for now (simplified version)
      const response = await fetch(`${API_BASE}/api/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount
        })
      });

      if (response.ok) {
        const result = await response.json();
        showStatus('Payment request sent! Check your wallet for approval.', 'success');
        if (donateBtn) {
          donateBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
          donateBtn.style.color = '#000';
          donateBtn.innerHTML = '<span class="success-checkmark"></span>Request Sent!';
        }

        setTimeout(() => {
          if (donateBtn) {
            donateBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            donateBtn.style.color = '#fff';
            donateBtn.innerHTML = 'Donate';
            donateBtn.disabled = false;
          }
          hideStatus();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      showStatus(`Payment failed: ${error.message}`, 'error');
      const donateBtn = document.getElementById('donate-btn');
      if (donateBtn) {
        donateBtn.disabled = false;
        donateBtn.innerHTML = 'Donate';
      }
    }
  }

  // Show status message
  function showStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = message;
      statusMessage.className = `status-message status-${type}`;
      statusMessage.style.display = 'block';

      // Add appropriate styling based on type
      if (type === 'success') {
        statusMessage.style.background = '#1a2a1a';
        statusMessage.style.border = '1px solid #00ff88';
        statusMessage.style.color = '#00ff88';
      } else if (type === 'error') {
        statusMessage.style.background = '#2a1a1a';
        statusMessage.style.border = '1px solid #ff6b6b';
        statusMessage.style.color = '#ff6b6b';
      } else if (type === 'loading') {
        statusMessage.style.background = '#1a1a2a';
        statusMessage.style.border = '1px solid #6b6bff';
        statusMessage.style.color = '#6b6bff';
      }
    }
  }

  // Hide status message
  function hideStatus() {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.style.display = 'none';
    }
  }

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
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
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .amount-option:hover {
            border-color: #00ff88 !important;
            background: #2a2a2a !important;
        }
        .amount-option.selected {
            border-color: #00ff88 !important;
            background: linear-gradient(135deg, #00ff88, #00cc6a) !important;
            color: #000 !important;
        }
        .connect-wallet-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
        }
        .donate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
        }
        .custom-amount input:focus {
            outline: none;
            border-color: #00ff88 !important;
        }
    `;
  document.head.appendChild(style);

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})(); 