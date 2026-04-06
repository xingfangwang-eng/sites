export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()

  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark)
    if (!start) {
      throw new Error(`Mark ${startMark} not found`)
    }

    const end = endMark ? this.marks.get(endMark) : performance.now()
    if (!end) {
      throw new Error(`Mark ${endMark} not found`)
    }

    const duration = end - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    
    return duration
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}

export const perfMonitor = new PerformanceMonitor()
