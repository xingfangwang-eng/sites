import { calculateWaitDays } from '@/lib/utils';

describe('calculateWaitDays', () => {
  it('should calculate the correct number of days between two dates', () => {
    // Create a date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const result = calculateWaitDays(threeDaysAgo.toISOString());
    expect(result).toBeGreaterThanOrEqual(3);
    expect(result).toBeLessThanOrEqual(4);
  });

  it('should return 0 for today', () => {
    const today = new Date();
    const result = calculateWaitDays(today.toISOString());
    expect(result).toBe(0);
  });

  it('should handle edge case with 1 day difference', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const result = calculateWaitDays(yesterday.toISOString());
    expect(result).toBe(1);
  });
});
