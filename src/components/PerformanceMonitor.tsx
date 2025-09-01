'use client'

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  totalRequests: number;
  cachedRequests: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    totalRequests: 0,
    cachedRequests: 0,
  });

  useEffect(() => {
    // Measure page load time
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Monitor API performance
  useEffect(() => {
    const originalFetch = window.fetch;
    let totalRequests = 0;
    let cachedRequests = 0;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      totalRequests++;

      try {
        const response = await originalFetch(...args);
        const responseTime = performance.now() - startTime;
        
        // Check if response came from cache
        if (response.headers.get('x-cache') === 'HIT') {
          cachedRequests++;
        }

        setMetrics(prev => ({
          ...prev,
          apiResponseTime: responseTime,
          totalRequests,
          cacheHitRate: totalRequests > 0 ? (cachedRequests / totalRequests) * 100 : 0,
        }));

        return response;
      } catch (error) {
        const responseTime = performance.now() - startTime;
        setMetrics(prev => ({ ...prev, apiResponseTime: responseTime }));
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Page Load: {metrics.pageLoadTime.toFixed(0)}ms</div>
        <div>API Response: {metrics.apiResponseTime.toFixed(0)}ms</div>
        <div>Cache Hit: {metrics.cacheHitRate.toFixed(1)}%</div>
        <div>Requests: {metrics.totalRequests}</div>
      </div>
    </div>
  );
}

export default PerformanceMonitor;
