export class TenantStorage {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  private getKey(key: string): string {
    return `${this.tenantId}:${key}`;
  }

  set(key: string, value: any): void {
    try {
      const storageKey = this.getKey(key);
      const stringValue = JSON.stringify(value);
      localStorage.setItem(storageKey, stringValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get(key: string): any {
    try {
      const storageKey = this.getKey(key);
      const stringValue = localStorage.getItem(storageKey);
      return stringValue ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      const storageKey = this.getKey(key);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.tenantId}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
