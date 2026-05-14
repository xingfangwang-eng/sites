class HTTPDemon {
    constructor() {
        this.currentConfig = {
            latency: 1000,
            statusCode: 200,
            timeoutEnabled: false,
            timeoutValue: 3000,
            networkError: false,
            retryEnabled: false,
            retryCount: 3
        };
        
        this.parsedData = {
            url: '',
            method: 'GET',
            headers: {},
            body: null
        };
        
        this.requestQueue = [];
        this.currentRequestId = 0;
        this.previousAbortController = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadFromStorage();
        this.renderQueue();
        this.generateCode();
        this.updateAudit();
    }
    
    bindEvents() {
        // Drop zone
        const dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', (e) => e.preventDefault());
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const text = e.dataTransfer.getData('text/plain');
            this.parseInput(text);
        });
        
        // Textarea input
        const textarea = document.getElementById('input-textarea');
        textarea.addEventListener('input', () => {
            this.parseInput(textarea.value);
        });
        
        // Controls
        document.getElementById('latency-slider').addEventListener('input', (e) => {
            this.currentConfig.latency = parseInt(e.target.value);
            document.getElementById('latency-value').textContent = e.target.value + 'ms';
            this.generateCode();
            this.saveToStorage();
        });
        
        document.getElementById('status-select').addEventListener('change', (e) => {
            this.currentConfig.statusCode = parseInt(e.target.value);
            this.generateCode();
            this.saveToStorage();
        });
        
        document.getElementById('timeout-enabled').addEventListener('change', (e) => {
            this.currentConfig.timeoutEnabled = e.target.checked;
            document.getElementById('timeout-slider').disabled = !e.target.checked;
            this.generateCode();
            this.saveToStorage();
        });
        
        document.getElementById('timeout-slider').addEventListener('input', (e) => {
            this.currentConfig.timeoutValue = parseInt(e.target.value);
            document.getElementById('timeout-value').textContent = e.target.value + 'ms';
            this.generateCode();
            this.saveToStorage();
        });
        
        document.getElementById('network-error').addEventListener('change', (e) => {
            this.currentConfig.networkError = e.target.checked;
            this.saveToStorage();
        });
        
        document.getElementById('retry-enabled').addEventListener('change', (e) => {
            this.currentConfig.retryEnabled = e.target.checked;
            document.getElementById('retry-count').disabled = !e.target.checked;
            this.saveToStorage();
        });
        
        document.getElementById('retry-count').addEventListener('input', (e) => {
            this.currentConfig.retryCount = parseInt(e.target.value);
            document.getElementById('retry-value').textContent = e.target.value;
            this.saveToStorage();
        });
        
        // Test button
        document.getElementById('test-request').addEventListener('click', () => {
            this.testRequest();
        });
        
        // Race condition button
        document.getElementById('race-condition').addEventListener('click', () => {
            this.simulateRaceCondition();
        });
        
        // Copy button
        document.getElementById('copy-code').addEventListener('click', () => {
            this.copyCode();
        });
        
        // Framework tabs
        const tabs = document.querySelectorAll('.framework-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchFramework(tab.dataset.framework);
            });
        });
        
        // Export button
        document.getElementById('export-demo').addEventListener('click', () => {
            this.exportDemo();
        });
        
        // Clear queue
        document.getElementById('clear-queue').addEventListener('click', () => {
            this.clearQueue();
        });
        
        // Fix buttons
        document.querySelectorAll('.fix-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.fixIssue(e.target.dataset.rule);
            });
        });
    }
    
    parseInput(text) {
        let url = '';
        let method = 'GET';
        let headers = {};
        let body = null;
        
        // Try to parse URL
        const urlMatch = text.match(/https?:\/\/[\w.-]+(?:\/[\w./-]*)*/);
        if (urlMatch) {
            url = urlMatch[0];
        }
        
        // Try to parse method from fetch code
        const methodMatch = text.match(/fetch\s*\(\s*['"]([^'"]+)['"]\s*,\s*\{[^}]*method\s*:\s*['"]([^'"]+)['"]/);
        if (methodMatch) {
            url = methodMatch[1];
            method = methodMatch[2];
        }
        
        // Try to parse headers
        const headersMatch = text.match(/headers\s*:\s*\{([^}]+)\}/);
        if (headersMatch) {
            try {
                headers = JSON.parse('{' + headersMatch[1] + '}');
            } catch (e) {
                headers = {};
            }
        }
        
        // Try to parse body
        const bodyMatch = text.match(/body\s*:\s*([^,}]+)/);
        if (bodyMatch) {
            try {
                body = JSON.parse(bodyMatch[1].trim());
            } catch (e) {
                body = bodyMatch[1].trim();
            }
        }
        
        // Try to parse curl
        if (text.startsWith('curl')) {
            const curlUrl = text.match(/curl\s+['"]?([^\s'"]+)['"]?/);
            if (curlUrl) {
                url = curlUrl[1];
            }
            const curlMethod = text.match(/\-X\s+(\w+)/);
            if (curlMethod) {
                method = curlMethod[1];
            }
        }
        
        this.parsedData = { url, method, headers, body };
        
        if (url) {
            document.getElementById('input-textarea').value = url;
        }
        
        this.generateCode();
        this.saveToStorage();
        this.updateAudit();
    }
    
    generateCode() {
        const framework = document.querySelector('.framework-tab.active').dataset.framework;
        const code = this.generateCodeForFramework(framework);
        document.getElementById('code-output').textContent = code;
        this.updateAudit();
    }
    
    generateCodeForFramework(framework) {
        const { url, method, headers, body } = this.parsedData;
        const { latency, statusCode, timeoutEnabled, timeoutValue, retryEnabled, retryCount } = this.currentConfig;
        
        const headersString = headers && Object.keys(headers).length 
            ? JSON.stringify(headers, null, 4) 
            : '{}';
        
        const bodyString = body 
            ? (typeof body === 'string' ? `"${body}"` : JSON.stringify(body, null, 4))
            : 'null';
        
        switch (framework) {
            case 'fetch':
                return this.generateFetchCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue);
            case 'axios':
                return this.generateAxiosCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue);
            case 'react':
                return this.generateReactCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue);
            case 'vue':
                return this.generateVueCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue);
            default:
                return this.generateFetchCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue);
        }
    }
    
    generateFetchCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue) {
        return `/**
 * Native Fetch Request Function
 * Complete error handling and state management
 */

const API_CONFIG = {
  url: '${url || 'https://api.example.com/endpoint'}',
  method: '${method}',
  headers: ${headersString},
  body: ${bodyString},
  timeoutEnabled: ${timeoutEnabled},
  timeoutMs: ${timeoutEnabled ? timeoutValue : 5000}
};

/**
 * Make API Request with complete error handling
 * @param {Object} config - Request configuration
 * @returns {Promise<Object>} - Request result
 */
async function fetchWithErrorHandling(config) {
  let isLoading = true;
  let abortController = null;
  
  try {
    console.log('[REQUEST] Starting request...');
    
    // Create AbortController for timeout control
    abortController = new AbortController();
    const { signal } = abortController;
    
    // Set timeout timer
    if (config.timeoutEnabled && config.timeoutMs > 0) {
      setTimeout(() => {
        if (isLoading && abortController) {
          abortController.abort();
          console.log('[TIMEOUT] Request timed out after', config.timeoutMs, 'ms');
        }
      }, config.timeoutMs);
    }
    
    // Build request options
    const options = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      signal
    };
    
    // Add request body (for non-GET requests only)
    if (config.body && !['GET', 'HEAD'].includes(config.method.toUpperCase())) {
      options.body = typeof config.body === 'string' 
        ? config.body 
        : JSON.stringify(config.body);
    }
    
    // Execute request
    const response = await fetch(config.url, options);
    
    // Check response status
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status} - \${response.statusText}\`);
    }
    
    // Parse response data
    const data = await response.json();
    
    console.log('[SUCCESS] Request completed successfully');
    
    return {
      success: true,
      data,
      response,
      status: response.status
    };
    
  } catch (error) {
    console.error('[ERROR] Request failed:', error.message);
    
    let errorType = 'unknown';
    let errorMessage = error.message;
    
    if (error.name === 'AbortError') {
      errorType = 'timeout';
      errorMessage = 'Request timeout';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'network';
      errorMessage = 'Network connection failed';
    } else if (error.message.includes('HTTP Error')) {
      errorType = 'http';
    }
    
    return {
      success: false,
      error: errorMessage,
      errorType,
      status: null
    };
    
  } finally {
    // Clean up resources
    isLoading = false;
    abortController = null;
    console.log('[CLEANUP] Request finished, resources cleaned');
  }
}

// Execute request
fetchWithErrorHandling(API_CONFIG)
  .then(result => {
    if (result.success) {
      console.log('Response:', result.data);
    } else {
      console.log('Error:', result.error);
    }
  });`;
    }
    
    generateAxiosCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue) {
        return `/**
 * Axios Request Function
 * Global Error Handling with Interceptors
 */

import axios from 'axios';

const API_CONFIG = {
  url: '${url || 'https://api.example.com/endpoint'}',
  method: '${method}',
  headers: ${headersString},
  body: ${bodyString},
  timeout: ${timeoutEnabled ? timeoutValue : 5000},
  baseURL: ''
};

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    ...API_CONFIG.headers
  }
});

// Request interceptor - Add global request config
apiClient.interceptors.request.use(
  (config) => {
    console.log('[REQUEST] Starting request:', config.url);
    return config;
  },
  (error) => {
    console.error('[ERROR] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors uniformly
apiClient.interceptors.response.use(
  (response) => {
    console.log('[SUCCESS] Request completed:', response.status);
    return response;
  },
  (error) => {
    console.error('[ERROR] Response error:', error.message);
    
    // Unified error handling
    let errorMessage = 'Request Error';
    
    if (axios.isCancel(error)) {
      errorMessage = 'Request cancelled';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout';
    } else if (!error.response) {
      errorMessage = 'Network connection failed';
    } else {
      const { status } = error.response;
      errorMessage = \`HTTP Error: \${status}\`;
    }
    
    return Promise.reject({
      message: errorMessage,
      originalError: error
    });
  }
);

/**
 * Make API Request
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Request result
 */
async function makeApiRequest(options = {}) {
  const config = {
    url: API_CONFIG.url,
    method: API_CONFIG.method,
    data: API_CONFIG.body
  };
  
  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unknown error',
      status: error.response?.status || null
    };
  }
}

// Execute request
makeApiRequest()
  .then(result => {
    if (result.success) {
      console.log('Response:', result.data);
    } else {
      console.log('Error:', result.error);
    }
  });`;
    }
    
    generateReactCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue) {
        return `/**
 * React Hook Implementation
 * AbortController Cleanup for Memory Leak Prevention
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const API_CONFIG = {
  url: '${url || 'https://api.example.com/endpoint'}',
  method: '${method}',
  headers: ${headersString},
  body: ${bodyString},
  timeoutMs: ${timeoutEnabled ? timeoutValue : 5000}
};

/**
 * Custom Hook - Handle API Requests
 */
function useApiRequest() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[REQUEST] Starting request...');
      
      // Set timeout
      if (API_CONFIG.timeoutMs > 0) {
        setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, API_CONFIG.timeoutMs);
      }
      
      const options = {
        method: API_CONFIG.method,
        headers: {
          'Content-Type': 'application/json',
          ...API_CONFIG.headers
        },
        signal
      };
      
      if (API_CONFIG.body && !['GET', 'HEAD'].includes(API_CONFIG.method.toUpperCase())) {
        options.body = typeof API_CONFIG.body === 'string' 
          ? API_CONFIG.body 
          : JSON.stringify(API_CONFIG.body);
      }
      
      const response = await fetch(API_CONFIG.url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP Error: \${response.status}\`);
      }
      
      const responseData = await response.json();
      setData(responseData);
      console.log('[SUCCESS] Request completed');
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[ERROR] Request failed:', err.message);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log('[CLEANUP] Request aborted on unmount');
      }
    };
  }, []);
  
  return { data, isLoading, error, fetchData };
}

/**
 * Example Usage Component
 */
function DataFetcher() {
  const { data, isLoading, error, fetchData } = useApiRequest();
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>API Response</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;`;
    }
    
    generateVueCode(url, method, headersString, bodyString, timeoutEnabled, timeoutValue) {
        return `/**
 * Vue Composition API Implementation
 * Complete Error Handling
 */

import { ref, onUnmounted } from 'vue';

const API_CONFIG = {
  url: '${url || 'https://api.example.com/endpoint'}',
  method: '${method}',
  headers: ${headersString},
  body: ${bodyString},
  timeoutMs: ${timeoutEnabled ? timeoutValue : 5000}
};

/**
 * Composable Function - Handle API Requests
 */
function useApiRequest() {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  let abortController = null;
  
  const fetchData = async () => {
    // Cancel previous request
    if (abortController) {
      abortController.abort();
    }
    
    // Create new AbortController
    abortController = new AbortController();
    const { signal } = abortController;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('[REQUEST] Starting request...');
      
      // Set timeout
      if (API_CONFIG.timeoutMs > 0) {
        setTimeout(() => {
          if (abortController) {
            abortController.abort();
          }
        }, API_CONFIG.timeoutMs);
      }
      
      const options = {
        method: API_CONFIG.method,
        headers: {
          'Content-Type': 'application/json',
          ...API_CONFIG.headers
        },
        signal
      };
      
      if (API_CONFIG.body && !['GET', 'HEAD'].includes(API_CONFIG.method.toUpperCase())) {
        options.body = typeof API_CONFIG.body === 'string' 
          ? API_CONFIG.body 
          : JSON.stringify(API_CONFIG.body);
      }
      
      const response = await fetch(API_CONFIG.url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP Error: \${response.status}\`);
      }
      
      data.value = await response.json();
      console.log('[SUCCESS] Request completed');
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[ERROR] Request failed:', err.message);
        error.value = err.message;
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Cleanup function
  const cleanup = () => {
    if (abortController) {
      abortController.abort();
      console.log('[CLEANUP] Request aborted');
    }
  };
  
  return {
    data,
    isLoading,
    error,
    fetchData,
    cleanup
  };
}

/**
 * Example Usage Component
 */
export function DataFetcher() {
  const { data, isLoading, error, fetchData, cleanup } = useApiRequest();
  
  // Cleanup on component unmount
  onUnmounted(() => {
    cleanup();
  });
  
  return {
    data,
    isLoading,
    error,
    fetchData
  };
}`;
    }
    
    testRequest() {
        const statusEl = document.getElementById('demo-status');
        const contentEl = document.getElementById('demo-content');
        const timeEl = document.getElementById('demo-time');
        const startTime = Date.now();
        
        const { latency, statusCode, timeoutEnabled, timeoutValue, networkError, retryEnabled, retryCount } = this.currentConfig;
        
        this.showLoading(statusEl, contentEl);
        
        if (this.previousAbortController) {
            this.previousAbortController.abort();
        }
        
        if (retryEnabled) {
            this.simulateWithRetry(latency, statusCode, timeoutEnabled, timeoutValue, networkError, retryCount, contentEl, statusEl, timeEl, startTime);
        } else {
            this.simulateAsyncRequest(latency, statusCode, timeoutEnabled, timeoutValue, networkError, null)
                .then(result => {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    
                    if (result.success) {
                        this.showSuccess(statusEl, contentEl, statusCode);
                    } else {
                        this.showError(statusEl, contentEl, result.errorType, result.message);
                    }
                })
                .catch(error => {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    this.showError(statusEl, contentEl, error.name === 'AbortError' ? 'timeout' : 'network', error.message);
                });
        }
    }
    
    async simulateWithRetry(latency, statusCode, timeoutEnabled, timeoutValue, networkError, retryCount, contentEl, statusEl, timeEl, startTime) {
        let attempt = 0;
        const originalStatusCode = statusCode;
        
        while (attempt <= retryCount) {
            attempt++;
            
            if (attempt > 1) {
                contentEl.innerHTML = `<p>Attempt ${attempt}...</p><div class="loading-progress"><div class="loading-progress-bar stage-1"></div></div>`;
                await this.delay(500);
            }
            
            try {
                const simulatedCode = attempt <= retryCount && (networkError || (statusCode >= 400)) ? originalStatusCode : 200;
                const result = await this.simulateAsyncRequest(latency, simulatedCode, timeoutEnabled, timeoutValue, attempt <= retryCount && networkError, null);
                
                if (result.success) {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    this.showSuccess(statusEl, contentEl, simulatedCode);
                    return;
                }
                
                if (attempt <= retryCount) {
                    contentEl.innerHTML = `<p>Request Error: ${retryCount - attempt + 1} retries remaining...</p>`;
                }
            } catch (error) {
                if (attempt <= retryCount) {
                    contentEl.innerHTML = `<p>Network error: ${retryCount - attempt + 1} retries remaining...</p>`;
                } else {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    this.showError(statusEl, contentEl, error.name === 'AbortError' ? 'timeout' : 'network', error.message);
                    return;
                }
            }
            
            if (attempt <= retryCount) {
                await this.delay(500);
            }
        }
        
        const endTime = Date.now();
        timeEl.textContent = `Time: ${endTime - startTime} ms`;
        this.showError(statusEl, contentEl, 'http', `HTTP Error: ${originalStatusCode} (retried ${retryCount} times)`);
    }
    
    simulateRaceCondition() {
        const statusEl = document.getElementById('demo-status');
        const contentEl = document.getElementById('demo-content');
        const timeEl = document.getElementById('demo-time');
        const startTime = Date.now();
        
        const { latency, statusCode, timeoutEnabled, timeoutValue, networkError } = this.currentConfig;
        
        contentEl.innerHTML = '<p>Simulate race condition: sending two requests in quick succession...</p>';
        const requestId1 = this.addQueueItem();
        this.updateQueueItem(requestId1, 'running');
        
        const simulateFirst = this.simulateAsyncRequest(latency * 2, statusCode, timeoutEnabled, timeoutValue, networkError, requestId1);
        
        this.delay(200).then(() => {
            if (this.previousAbortController) {
                this.previousAbortController.abort();
                this.updateQueueItem(requestId1, 'cancelled');
                contentEl.innerHTML = '<p>Cancel previous request, sending new request...</p>';
            }
            
            const requestId2 = this.addQueueItem();
            this.updateQueueItem(requestId2, 'running');
            
            this.simulateAsyncRequest(latency, statusCode, timeoutEnabled, timeoutValue, networkError, requestId2)
                .then(result => {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    
                    if (result.success) {
                        this.showSuccess(statusEl, contentEl, statusCode);
                        this.updateQueueItem(requestId2, 'success');
                    } else {
                        this.showError(statusEl, contentEl, result.errorType, result.message);
                        this.updateQueueItem(requestId2, 'error');
                    }
                })
                .catch(error => {
                    const endTime = Date.now();
                    timeEl.textContent = `Time: ${endTime - startTime} ms`;
                    this.showError(statusEl, contentEl, error.name === 'AbortError' ? 'timeout' : 'network', error.message);
                });
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    simulateAsyncRequest(latency, statusCode, timeoutEnabled, timeoutValue, networkError, requestId) {
        return new Promise((resolve, reject) => {
            const abortController = new AbortController();
            this.previousAbortController = abortController;
            
            const effectiveDelay = timeoutEnabled && latency > timeoutValue ? timeoutValue : latency;
            
            const timeoutId = setTimeout(() => {
                if (abortController.signal.aborted) return;
                
                if (networkError) {
                    reject(new TypeError('Failed to fetch'));
                    return;
                }
                
                if (timeoutEnabled && latency > timeoutValue) {
                    const abortError = new Error('The operation was aborted');
                    abortError.name = 'AbortError';
                    reject(abortError);
                    return;
                }
                
                const isSuccess = statusCode >= 200 && statusCode < 300;
                
                if (isSuccess) {
                    resolve({
                        success: true,
                        statusCode,
                        requestId,
                        data: {
                            status: 'success',
                            message: this.getStatusMessage(statusCode),
                            timestamp: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        errorType: 'http',
                        requestId,
                        message: `HTTP Error: ${statusCode}`
                    });
                }
            }, effectiveDelay);
            
            abortController.signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
            });
        });
    }
    
    getStatusMessage(code) {
        const messages = {
            200: 'Request successful',
            201: 'Resource created',
            204: 'No content',
            400: 'Bad request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Resource not found',
            500: 'Internal server error',
            502: 'Bad gateway',
            503: 'Service unavailable'
        };
        return messages[code] || 'Unknown status';
    }
    
    showLoading(statusEl, contentEl) {
        statusEl.textContent = 'LOADING';
        statusEl.className = 'status-indicator loading';
        contentEl.className = 'terminal-content';
        contentEl.innerHTML = '<p>Making request...</p><div class="loading-progress"><div class="loading-progress-bar stage-1"></div></div>';
    }
    
    showSuccess(statusEl, contentEl, statusCode) {
        statusEl.textContent = 'SUCCESS';
        statusEl.className = 'status-indicator success';
        contentEl.className = 'terminal-content';
        contentEl.innerHTML = '<div class="loading-progress"><div class="loading-progress-bar stage-4"></div></div>\n' + JSON.stringify({
            status: 'success',
            message: this.getStatusMessage(statusCode),
            statusCode,
            url: this.parsedData.url || 'https://api.example.com/endpoint',
            timestamp: new Date().toISOString(),
            method: this.parsedData.method
        }, null, 2);
    }
    
    showError(statusEl, contentEl, errorType, message) {
        statusEl.textContent = 'ERROR';
        statusEl.className = 'status-indicator error';
        contentEl.className = 'terminal-content error';
        
        let errorOutput = '';
        switch (errorType) {
            case 'network':
                errorOutput = '[ERROR] TypeError: Failed to fetch\nNetwork connection failed, please check your network settings';
                break;
            case 'timeout':
                errorOutput = '[ERROR] AbortError: The operation was aborted\nRequest timeout, automatically cancelled';
                break;
            case 'http':
                errorOutput = `[ERROR] HTTP Error: ${message}\nServer returned an error status code`;
                break;
            default:
                errorOutput = `[ERROR] ${message}`;
        }
        
        contentEl.textContent = errorOutput;
    }
    
    addQueueItem() {
        const requestId = ++this.currentRequestId;
        const item = {
            id: requestId,
            status: 'pending',
            timestamp: new Date().toLocaleTimeString()
        };
        this.requestQueue.push(item);
        this.renderQueue();
        return requestId;
    }
    
    updateQueueItem(requestId, status) {
        const item = this.requestQueue.find(r => r.id === requestId);
        if (item) {
            item.status = status;
            this.renderQueue();
        }
    }
    
    renderQueue() {
        const queueList = document.getElementById('queue-list');
        
        if (this.requestQueue.length === 0) {
            queueList.innerHTML = '<p class="empty-queue">Queue is empty</p>';
            return;
        }
        
        queueList.innerHTML = this.requestQueue.map(item => `
            <div class="queue-item ${item.status}">
                [${item.timestamp}] Request #${item.id} - ${this.getStatusText(item.status)}
            </div>
        `).join('');
    }
    
    getStatusText(status) {
        const texts = {
            pending: 'Pending',
            running: 'Running',
            success: 'Success',
            error: 'Error',
            cancelled: 'Cancelled'
        };
        return texts[status] || status;
    }
    
    clearQueue() {
        this.requestQueue = [];
        this.renderQueue();
    }
    
    switchFramework(framework) {
        document.querySelectorAll('.framework-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-framework="${framework}"]`).classList.add('active');
        this.generateCode();
    }
    
    copyCode() {
        const code = document.getElementById('code-output').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('copy-code');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
    
    updateAudit() {
        const code = document.getElementById('code-output').textContent;
        
        let score = 0;
        const rules = {
            trycatch: code.includes('try') && code.includes('catch'),
            timeout: code.includes('AbortController') || code.includes('timeout'),
            loading: code.includes('isLoading') || code.includes('loading'),
            abort: code.includes('AbortController'),
            status: code.includes('response.ok') || code.includes('status')
        };
        
        if (rules.trycatch) score += 20;
        if (rules.timeout) score += 20;
        if (rules.loading) score += 20;
        if (rules.abort) score += 20;
        if (rules.status) score += 20;
        
        const scoreEl = document.getElementById('audit-score');
        const messageEl = document.getElementById('audit-message');
        
        scoreEl.textContent = score;
        scoreEl.className = 'score-number';
        
        if (score < 60) {
            scoreEl.classList.add('danger');
            messageEl.textContent = '❌ Not recommended for production - critical robustness issues';
            messageEl.className = 'audit-message danger';
        } else if (score < 80) {
            scoreEl.classList.add('warning');
            messageEl.textContent = '⚠️ Recommended to improve before production - some robustness issues';
            messageEl.className = 'audit-message warning';
        } else if (score === 100) {
            scoreEl.classList.add('success');
            messageEl.textContent = '✅ Production ready - complete robustness coverage';
            messageEl.className = 'audit-message success';
        } else {
            scoreEl.classList.add('warning');
            messageEl.textContent = '⚠️Almost production ready - Recommend checking and fixing remaining issues';
            messageEl.className = 'audit-message warning';
        }
        
        const ruleIds = ['trycatch', 'timeout', 'loading', 'abort', 'status'];
        ruleIds.forEach(id => {
            const ruleEl = document.getElementById(`rule-${id}`);
            if (ruleEl) {
                ruleEl.className = `audit-rule ${rules[id] ? 'pass' : 'fail'}`;
                ruleEl.querySelector('.rule-status').textContent = rules[id] ? '✓' : '✗';
            }
        });
    }
    
    fixIssue(rule) {
        // This is a simplified fix implementation
        alert(`Would fix ${rule} issue - implementing robustness improvement...`);
        this.generateCode();
        this.updateAudit();
    }
    
    exportDemo() {
        const { latency, statusCode, timeoutEnabled, timeoutValue, networkError, retryEnabled, retryCount } = this.currentConfig;
        const { url, method } = this.parsedData;
        
        const demoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Demo - HTTPDemon</title>
    <style>
        body {
            font-family: 'Consolas', 'Monaco', monospace;
            background: #050505;
            color: #fff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .config-info {
            background: #111;
            padding: 20px;
            border: 1px solid #333;
            margin-bottom: 20px;
        }
        .config-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .config-label {
            color: #888;
        }
        .config-value {
            color: #0f0;
        }
        .demo-panel {
            background: #111;
            border: 1px solid #333;
        }
        .demo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #333;
        }
        .test-btn {
            background: #0066cc;
            border: none;
            color: white;
            padding: 8px 20px;
            cursor: pointer;
            font-family: inherit;
        }
        .test-btn:hover {
            background: #0088ff;
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            background: #0a0a0a;
        }
        .status-indicator {
            font-weight: bold;
        }
        .status-indicator.idle { color: #888; }
        .status-indicator.loading { color: #00ccff; }
        .status-indicator.success { color: #00ff00; }
        .status-indicator.error { color: #ff0000; }
        .loading-bar {
            height: 4px;
            background: #222;
        }
        .loading-bar-fill {
            height: 100%;
            background: #00ccff;
            transition: none;
        }
        .loading-bar-fill.stage1 { width: 25%; }
        .loading-bar-fill.stage2 { width: 50%; }
        .loading-bar-fill.stage3 { width: 75%; }
        .loading-bar-fill.stage4 { width: 100%; background: #00ff00; }
        .response-area {
            padding: 20px;
            min-height: 100px;
            font-size: 12px;
            white-space: pre-wrap;
        }
        .response-area.error {
            color: #ff0000;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #333;
            color: #666;
            font-size: 12px;
        }
        .footer a {
            color: #00ccff;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 API Demo</h1>
            <p>${method} ${url}</p>
        </div>

        <div class="config-info">
            <h3>Current Configuration</h3>
            <div class="config-item">
                <span class="config-label">Simulated Latency:</span>
                <span class="config-value">${latency}ms</span>
            </div>
            <div class="config-item">
                <span class="config-label">Response Status Code:</span>
                <span class="config-value">${statusCode}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Timeout Simulation:</span>
                <span class="config-value">${timeoutEnabled ? 'Enabled (' + timeoutValue + 'ms)' : 'Disabled'}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Network Error:</span>
                <span class="config-value">${networkError ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Auto Retry:</span>
                <span class="config-value">${retryEnabled ? 'Enabled (' + retryCount + ' times)' : 'Disabled'}</span>
            </div>
        </div>

        <div class="demo-panel">
            <div class="demo-header">
                <h3>Demo Panel</h3>
                <button class="test-btn" onclick="runTest()">Run Test</button>
            </div>
            <div class="status-bar">
                <span class="status-indicator idle" id="status">IDLE</span>
                <span id="timer">-</span>
            </div>
            <div class="loading-bar">
                <div class="loading-bar-fill" id="loadingBar"></div>
            </div>
            <div class="response-area" id="response">Click "Run Test" to start simulation...</div>
        </div>

        <div class="footer">
            Generated by <a href="https://www.wangdadi.xyz/httpdemon" target="_blank">HTTPDemon</a> - API Robustness Auditor
        </div>
    </div>

    <script>
        const config = {
            latency: ${latency},
            statusCode: ${statusCode},
            timeoutEnabled: ${timeoutEnabled},
            timeoutValue: ${timeoutValue},
            networkError: ${networkError},
            retryEnabled: ${retryEnabled},
            retryCount: ${retryCount}
        };

        function runTest() {
            const statusEl = document.getElementById('status');
            const responseEl = document.getElementById('response');
            const loadingBar = document.getElementById('loadingBar');
            const timerEl = document.getElementById('timer');

            statusEl.textContent = 'LOADING';
            statusEl.className = 'status-indicator loading';
            responseEl.className = 'response-area';
            responseEl.textContent = 'Making request...';
            loadingBar.className = 'loading-bar-fill stage1';
            timerEl.textContent = '-';

            const startTime = Date.now();
            let stage = 1;
            const stageInterval = setInterval(() => {
                stage = stage >= 4 ? 1 : stage + 1;
                loadingBar.className = 'loading-bar-fill stage' + stage;
            }, 500);

            (async () => {
                try {
                    let result;
                    
                    if (config.retryEnabled) {
                        result = await simulateWithRetry();
                    } else {
                        result = await simulateRequest();
                    }

                    clearInterval(stageInterval);
                    loadingBar.className = 'loading-bar-fill stage4';
                    
                    const endTime = Date.now();
                    timerEl.textContent = 'Time: ' + (endTime - startTime) + 'ms';

                    if (result.success) {
                        statusEl.textContent = 'SUCCESS';
                        statusEl.className = 'status-indicator success';
                        responseEl.textContent = JSON.stringify(result.data, null, 2);
                    } else {
                        statusEl.textContent = 'ERROR';
                        statusEl.className = 'status-indicator error';
                        responseEl.className = 'response-area error';
                        responseEl.textContent = result.message;
                    }
                } catch (error) {
                    clearInterval(stageInterval);
                    loadingBar.className = 'loading-bar-fill';
                    
                    const endTime = Date.now();
                    timerEl.textContent = 'Time: ' + (endTime - startTime) + 'ms';
                    
                    statusEl.textContent = 'ERROR';
                    statusEl.className = 'status-indicator error';
                    responseEl.className = 'response-area error';
                    responseEl.textContent = error.message;
                }
            })();
        }

        function simulateRequest() {
            return new Promise((resolve, reject) => {
                const effectiveDelay = config.timeoutEnabled && config.latency > config.timeoutValue 
                    ? config.timeoutValue 
                    : config.latency;

                setTimeout(() => {
                    if (config.networkError) {
                        reject(new TypeError('Failed to fetch'));
                        return;
                    }

                    if (config.timeoutEnabled && config.latency > config.timeoutValue) {
                        const abortError = new Error('The operation was aborted');
                        abortError.name = 'AbortError';
                        reject(abortError);
                        return;
                    }

                    const isSuccess = config.statusCode >= 200 && config.statusCode < 300;
                    
                    if (isSuccess) {
                        resolve({
                            success: true,
                            data: {
                                status: 'success',
                                message: 'Request successful',
                                statusCode: config.statusCode,
                                url: '${url}',
                                method: '${method}',
                                timestamp: new Date().toISOString()
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'HTTP Error: ' + config.statusCode
                        });
                    }
                }, effectiveDelay);
            });
        }

        async function simulateWithRetry() {
            let attempt = 0;
            const maxRetries = config.retryCount;
            const responseEl = document.getElementById('response');

            while (attempt <= maxRetries) {
                attempt++;
                
                if (attempt > 1) {
                    responseEl.textContent = 'Attempt ' + attempt + '...';
                    await delay(500);
                }

                try {
                    const simulatedCode = attempt <= maxRetries && (config.networkError || (config.statusCode >= 400)) 
                        ? config.statusCode 
                        : 200;
                    
                    const result = await simulateWithCode(simulatedCode);
                    
                    if (result.success) {
                        return result;
                    }

                    if (attempt <= maxRetries) {
                        responseEl.textContent = 'Request failed, ' + (maxRetries - attempt + 1) + ' retries remaining...';
                    }
                } catch (error) {
                    if (attempt <= maxRetries) {
                        responseEl.textContent = 'Network error, ' + (maxRetries - attempt + 1) + ' retries remaining...';
                    } else {
                        throw error;
                    }
                }
                
                if (attempt <= maxRetries) {
                    await delay(500);
                }
            }

            return { success: false, message: 'HTTP Error: ' + config.statusCode + ' (retried ' + maxRetries + ' times)' };
        }

        function simulateWithCode(statusCode) {
            return new Promise((resolve, reject) => {
                const effectiveDelay = config.timeoutEnabled && config.latency > config.timeoutValue 
                    ? config.timeoutValue 
                    : config.latency;

                setTimeout(() => {
                    if (config.networkError) {
                        reject(new TypeError('Failed to fetch'));
                        return;
                    }

                    if (config.timeoutEnabled && config.latency > config.timeoutValue) {
                        const abortError = new Error('The operation was aborted');
                        abortError.name = 'AbortError';
                        reject(abortError);
                        return;
                    }

                    const isSuccess = statusCode >= 200 && statusCode < 300;
                    
                    if (isSuccess) {
                        resolve({
                            success: true,
                            data: {
                                status: 'success',
                                message: 'Request successful',
                                statusCode: statusCode,
                                url: '${url}',
                                method: '${method}',
                                timestamp: new Date().toISOString()
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'HTTP Error: ' + statusCode
                        });
                    }
                }, effectiveDelay);
            });
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    <\/script>
</body>
</html>`;
        
        const blob = new Blob([demoHtml], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'api-demo.html';
        a.click();
        URL.revokeObjectURL(blobUrl);
    }
    
    saveToStorage() {
        const data = {
            config: this.currentConfig,
            parsedData: this.parsedData
        };
        localStorage.setItem('httpdemon-data', JSON.stringify(data));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('httpdemon-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentConfig = { ...this.currentConfig, ...data.config };
                this.parsedData = { ...this.parsedData, ...data.parsedData };
                
                // Update UI
                document.getElementById('latency-slider').value = this.currentConfig.latency;
                document.getElementById('latency-value').textContent = this.currentConfig.latency + 'ms';
                document.getElementById('status-select').value = this.currentConfig.statusCode;
                document.getElementById('timeout-enabled').checked = this.currentConfig.timeoutEnabled;
                document.getElementById('timeout-slider').value = this.currentConfig.timeoutValue;
                document.getElementById('timeout-value').textContent = this.currentConfig.timeoutValue + 'ms';
                document.getElementById('timeout-slider').disabled = !this.currentConfig.timeoutEnabled;
                document.getElementById('network-error').checked = this.currentConfig.networkError;
                document.getElementById('retry-enabled').checked = this.currentConfig.retryEnabled;
                document.getElementById('retry-count').value = this.currentConfig.retryCount;
                document.getElementById('retry-value').textContent = this.currentConfig.retryCount;
                document.getElementById('retry-count').disabled = !this.currentConfig.retryEnabled;
                
                if (this.parsedData.url) {
                    document.getElementById('input-textarea').value = this.parsedData.url;
                }
            } catch (e) {
                console.error('Failed to load from storage:', e);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HTTPDemon();
});
