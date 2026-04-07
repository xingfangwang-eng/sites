document.addEventListener('DOMContentLoaded', function() {
  // Load saved base URL
  chrome.storage.local.get('baseUrl', function(result) {
    if (result.baseUrl) {
      document.getElementById('baseUrl').value = result.baseUrl;
    }
  });

  // Save button click event
  document.getElementById('saveBtn').addEventListener('click', function() {
    const baseUrl = document.getElementById('baseUrl').value;
    
    if (baseUrl) {
      // Save to chrome.storage.local
      chrome.storage.local.set({ baseUrl: baseUrl }, function() {
        // Show success message
        const status = document.getElementById('status');
        status.textContent = 'Base URL saved successfully!';
        status.className = 'success';
        
        // Clear message after 2 seconds
        setTimeout(function() {
          status.textContent = '';
          status.className = '';
        }, 2000);
      });
    }
  });
});
