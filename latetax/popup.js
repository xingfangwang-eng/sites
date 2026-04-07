(function() {
  'use strict';

  const STORAGE_KEY = 'latetax_settings';
  const STATS_KEY = 'latetax_stats';
  
  const CURRENCY_SYMBOLS = {
    'CNY': '¥',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  const DEFAULT_SETTINGS = {
    hourlyRate: 80,
    currency: 'USD',
    enabled: true
  };

  function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
          resolve(result[STORAGE_KEY]);
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      });
    });
  }

  function saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: settings }, resolve);
    });
  }

  function loadStats() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STATS_KEY], (result) => {
        if (result[STATS_KEY]) {
          resolve(result[STATS_KEY]);
        } else {
          resolve({});
        }
      });
    });
  }

  function saveStats(stats) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STATS_KEY]: stats }, resolve);
    });
  }

  function updateCurrencySymbol(currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    document.getElementById('currency-symbol-display').textContent = symbol;
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function updateTodayWaste() {
    loadStats().then((stats) => {
      const todayKey = getTodayKey();
      const todayWaste = stats[todayKey] || 0;
      const currency = document.getElementById('currency').value || 'USD';
      const symbol = CURRENCY_SYMBOLS[currency] || '$';
      document.getElementById('today-waste').textContent = `${symbol}${todayWaste.toFixed(2)}`;
    });
  }

  async function init() {
    const settings = await loadSettings();
    
    document.getElementById('hourly-rate').value = settings.hourlyRate || DEFAULT_SETTINGS.hourlyRate;
    document.getElementById('currency').value = settings.currency || DEFAULT_SETTINGS.currency;
    document.getElementById('enable-tracker').checked = settings.enabled !== false;
    
    updateCurrencySymbol(settings.currency || DEFAULT_SETTINGS.currency);
    updateTodayWaste();
    
    document.getElementById('currency').addEventListener('change', (e) => {
      updateCurrencySymbol(e.target.value);
      updateTodayWaste();
    });
    
    document.getElementById('save-btn').addEventListener('click', async () => {
      const hourlyRate = parseFloat(document.getElementById('hourly-rate').value) || DEFAULT_SETTINGS.hourlyRate;
      const currency = document.getElementById('currency').value || DEFAULT_SETTINGS.currency;
      const enabled = document.getElementById('enable-tracker').checked;
      
      const newSettings = {
        hourlyRate: Math.max(0, hourlyRate),
        currency,
        enabled
      };
      
      await saveSettings(newSettings);
      showToast('Saved!');
    });
    
    document.getElementById('reset-stats').addEventListener('click', async () => {
      const stats = await loadStats();
      const todayKey = getTodayKey();
      delete stats[todayKey];
      await saveStats(stats);
      updateTodayWaste();
      showToast('Stats reset!');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
