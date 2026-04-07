chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    latetax_settings: {
      hourlyRate: 80,
      participants: 1,
      currency: 'USD',
      enabled: true
    }
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'popup.html' });
});
