(function() {
  'use strict';

  const STORAGE_KEY = 'latetax_settings';
  const STATS_KEY = 'latetax_stats';
  const DEFAULT_HOURLY_RATE = 80;
  const DEFAULT_PARTICIPANTS = 1;
  
  let settings = {
    hourlyRate: DEFAULT_HOURLY_RATE,
    participants: DEFAULT_PARTICIPANTS,
    currency: 'USD',
    enabled: true
  };
  
  let startTime = null;
  let animationFrameId = null;
  let isWaiting = false;
  let container = null;
  let detectedParticipants = 1;
  let manualParticipants = null;
  let lastDollarAmount = 0;
  let cashRegisterAudio = null;
  let invoiceContainer = null;

  const CURRENCY_SYMBOLS = {
    'CNY': '¥',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  function formatCurrency(amount) {
    const symbol = CURRENCY_SYMBOLS[settings.currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function calculateCost(seconds) {
    const hours = seconds / 3600;
    const participants = manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants);
    return hours * settings.hourlyRate * participants;
  }

  function detectWaitingState() {
    const url = window.location.href;
    
    if (url.includes('meet.google.com')) {
      const waitingMessage = document.querySelector('[data-is-muted="true"]') ||
                            document.querySelector('[data-requested-captions="true"]') ||
                            document.querySelector('[aria-label*="waiting"]') ||
                            document.querySelector('[role="button"][aria-label*="join"]') ||
                            document.querySelector('button[aria-label*="Join"]') ||
                            document.querySelector('button[aria-label*="Ask to join"]');
      
      const hasVideo = document.querySelector('video[src]') || 
                       document.querySelector('video[class*="video"]') ||
                       document.querySelector('video[autoplay]');
      
      return waitingMessage !== null && !hasVideo;
    }
    
    if (url.includes('zoom.us')) {
      const waitingRoom = document.querySelector('[class*="waiting"]') ||
                         document.querySelector('[class*="lobby"]') ||
                         document.querySelector('[id*="waiting"]') ||
                         document.querySelector('button[class*="join"]') ||
                         document.querySelector('button[class*="Join"]');
      
      const hasMeetingStarted = document.querySelector('video[id*="video"]') ||
                                document.querySelector('[class*="meeting"]') ||
                                document.querySelector('audio[id*="audio"]');
      
      return waitingRoom !== null && !hasMeetingStarted;
    }
    
    return false;
  }

  function detectParticipants() {
    const url = window.location.href;
    
    if (url.includes('meet.google.com')) {
      const participantElements = document.querySelectorAll('div[role="listitem"]') ||
                                 document.querySelectorAll('[data-participant-id]') ||
                                 document.querySelectorAll('[aria-label*="participant"]') ||
                                 document.querySelectorAll('[class*="participant"]');
      
      if (participantElements.length > 0) {
        return participantElements.length;
      }
      
      const participantText = document.querySelector('span') ||
                             document.querySelector('div') ||
                             document.querySelector('p');
      
      if (participantText) {
        const text = participantText.textContent || '';
        const match = text.match(/(\d+)\s*participants?/i) ||
                     text.match(/(\d+)\s*people/i) ||
                     text.match(/(\d+)\s*attendees?/i);
        if (match) {
          return parseInt(match[1]);
        }
      }
    }
    
    if (url.includes('zoom.us')) {
      const participantCount = document.querySelector('[class*="participant"]') ||
                               document.querySelector('[id*="participant"]') ||
                               document.querySelector('[aria-label*="participant"]');
      
      if (participantCount) {
        const text = participantCount.textContent || '';
        const match = text.match(/(\d+)/);
        if (match) {
          return parseInt(match[1]);
        }
      }
    }
    
    return settings.participants;
  }

  function getMeetingName() {
    const url = window.location.href;
    
    if (url.includes('meet.google.com')) {
      return document.title || 'Google Meet';
    }
    
    if (url.includes('zoom.us')) {
      return document.title || 'Zoom Meeting';
    }
    
    return 'Meeting';
  }

  function createTimerUI() {
    if (container) {
      container.remove();
    }

    const participants = manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants);

    container = document.createElement('div');
    container.id = 'latetax-container';
    container.innerHTML = `
      <div class="latetax-overlay">
        <div class="latetax-header">
          <div class="latetax-title">BURNING MONEY</div>
          <button class="latetax-close-btn" id="latetax-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="latetax-body">
          <div class="latetax-money" id="latetax-money">$0.00</div>
          <div class="latetax-participants-section">
            <button class="latetax-participant-btn" id="latetax-minus">-</button>
            <div class="latetax-participants" id="latetax-participants">[${participants}] Participants Waiting...</div>
            <button class="latetax-participant-btn" id="latetax-plus">+</button>
          </div>
        </div>
        
        <div class="latetax-footer">
          <button class="latetax-btn" id="latetax-export">
            Stop & Export
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    
    document.getElementById('latetax-close').addEventListener('click', () => {
      container.style.display = 'none';
    });

    document.getElementById('latetax-export').addEventListener('click', exportData);

    document.getElementById('latetax-minus').addEventListener('click', () => {
      const current = manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants);
      if (current > 1) {
        manualParticipants = current - 1;
        updateParticipantsDisplay();
      }
    });

    document.getElementById('latetax-plus').addEventListener('click', () => {
      const current = manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants);
      if (current < 100) {
        manualParticipants = current + 1;
        updateParticipantsDisplay();
      }
    });

    makeDraggable(container);
  }

  function updateParticipantsDisplay() {
    const participants = manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants);
    const participantsEl = document.getElementById('latetax-participants');
    if (participantsEl) {
      participantsEl.textContent = `[${participants}] Participants Waiting...`;
    }
  }

  function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function saveToStats(amount) {
    chrome.storage.local.get([STATS_KEY], (result) => {
      const stats = result[STATS_KEY] || {};
      const todayKey = getTodayKey();
      stats[todayKey] = (stats[todayKey] || 0) + amount;
      chrome.storage.local.set({ [STATS_KEY]: stats });
    });
  }

  function generateInvoice(data) {
    if (invoiceContainer) {
      invoiceContainer.remove();
    }

    invoiceContainer = document.createElement('div');
    invoiceContainer.id = 'latetax-invoice-container';
    invoiceContainer.innerHTML = `
      <div class="latetax-invoice-overlay">
        <div class="latetax-invoice">
          <div class="latetax-invoice-header">
            <div class="latetax-invoice-title">OFFICIAL INVOICE</div>
            <div class="latetax-invoice-subtitle">FOR LOST PRODUCTIVITY</div>
          </div>
          
          <div class="latetax-invoice-body">
            <div class="latetax-invoice-section">
              <div class="latetax-invoice-label">Meeting</div>
              <div class="latetax-invoice-value">${data.meetingName}</div>
            </div>
            
            <div class="latetax-invoice-section">
              <div class="latetax-invoice-label">Waiting Time</div>
              <div class="latetax-invoice-value">${data.waitingTime}</div>
            </div>
            
            <div class="latetax-invoice-section">
              <div class="latetax-invoice-label">Participants</div>
              <div class="latetax-invoice-value">${data.participants}</div>
            </div>
            
            <div class="latetax-invoice-section">
              <div class="latetax-invoice-label">Hourly Rate</div>
              <div class="latetax-invoice-value">${data.hourlyRate}</div>
            </div>
            
            <div class="latetax-invoice-divider"></div>
            
            <div class="latetax-invoice-section latetax-invoice-total">
              <div class="latetax-invoice-label">TOTAL WASTED</div>
              <div class="latetax-invoice-value latetax-invoice-total-value">${data.moneyWasted}</div>
            </div>
            
            <div class="latetax-invoice-quote">
              "Punctuality is a sign of respect. Please value our time."
            </div>
            
            <div class="latetax-invoice-footer-text">
              Generated by LateTax Pro - Save $500/mo by being on time.
            </div>
          </div>
          
          <div class="latetax-invoice-footer">
            <button class="latetax-invoice-btn latetax-invoice-btn-secondary" id="latetax-invoice-close">
              Close
            </button>
            <button class="latetax-invoice-btn latetax-invoice-btn-primary" id="latetax-invoice-copy">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(invoiceContainer);
    
    document.getElementById('latetax-invoice-close').addEventListener('click', () => {
      invoiceContainer.remove();
      invoiceContainer = null;
    });

    document.getElementById('latetax-invoice-copy').addEventListener('click', () => {
      const message = `⏰ Hi Team, we just wasted ${data.moneyWasted} waiting. Here is the breakdown: Meeting: ${data.meetingName}, Waiting Time: ${data.waitingTime}, Participants: ${data.participants}`;
      navigator.clipboard.writeText(message).then(() => {
        const copyBtn = document.getElementById('latetax-invoice-copy');
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('latetax-invoice-btn-success');
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
          copyBtn.classList.remove('latetax-invoice-btn-success');
        }, 2000);
      });
    });
  }

  function exportData() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const cost = calculateCost(elapsed);
    const data = {
      meetingName: getMeetingName(),
      waitingTime: formatTime(elapsed),
      moneyWasted: formatCurrency(cost),
      participants: manualParticipants !== null ? manualParticipants : (detectedParticipants || settings.participants),
      hourlyRate: formatCurrency(settings.hourlyRate),
      timestamp: new Date().toISOString()
    };
    
    saveToStats(cost);
    generateInvoice(data);
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `latetax-export-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  function playCashRegisterSound() {
    if (!cashRegisterAudio) {
      cashRegisterAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA//8AAANZAADgnACkAAAAAwAAAbMAAAKuAACQAACUAwAD/AL0AAJkAAADACAB8AMkAAI0AAADgAgD+ARAAAIwAAAElJTkQgQ29tcHJlc3NlciAoMi4wLjApV29ya1NvdXJjZSwgMjAwMTEgR29vZ2xlLCBmdWxsIHRyYWNrIGNvbnN0cmFpbmVkLg==');
      cashRegisterAudio.volume = 0.3;
    }
    cashRegisterAudio.currentTime = 0;
    cashRegisterAudio.play().catch(e => console.log('Audio play failed:', e));
  }

  function updateDisplay() {
    if (!startTime) return;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const cost = calculateCost(elapsed);
    const moneyEl = document.getElementById('latetax-money');
    
    if (moneyEl) {
      moneyEl.textContent = formatCurrency(cost);
    }
    
    const currentDollarAmount = Math.floor(cost);
    if (currentDollarAmount > lastDollarAmount) {
      playCashRegisterSound();
      lastDollarAmount = currentDollarAmount;
    }
    
    animationFrameId = requestAnimationFrame(updateDisplay);
  }

  function startTimer() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    startTime = Date.now();
    lastDollarAmount = 0;
    
    updateDisplay();
  }

  function stopTimer() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      const cost = calculateCost(elapsed);
      saveToStats(cost);
      startTime = null;
    }
  }

  function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const header = element.querySelector('.latetax-header');
    
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      
      isDragging = true;
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
      
      element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'default';
    });
  }

  function checkWaitingState() {
    if (!settings.enabled) {
      if (container) {
        container.style.display = 'none';
      }
      stopTimer();
      return;
    }
    
    const currentlyWaiting = detectWaitingState();
    
    if (!manualParticipants) {
      detectedParticipants = detectParticipants();
      updateParticipantsDisplay();
    }
    
    if (currentlyWaiting && !isWaiting) {
      isWaiting = true;
      if (!container) {
        createTimerUI();
      } else {
        container.style.display = 'block';
      }
      startTimer();
    } else if (!currentlyWaiting && isWaiting) {
      isWaiting = false;
      stopTimer();
      if (container) {
        container.style.display = 'none';
      }
    }
  }

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
          settings = { ...settings, ...result[STORAGE_KEY] };
        }
        resolve();
      });
    });
  }

  function init() {
    loadSettings().then(() => {
      createTimerUI();
      
      checkWaitingState();
      
      setInterval(checkWaitingState, 2000);
      
      chrome.storage.onChanged.addListener((changes) => {
        if (changes[STORAGE_KEY]) {
          settings = { ...settings, ...changes[STORAGE_KEY].newValue };
          checkWaitingState();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
