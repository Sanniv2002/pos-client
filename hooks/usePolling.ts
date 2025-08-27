'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ResultsResponse } from '@/lib/api';

export const usePolling = (sessionId: string, taskId: string | null, targetCount: number, isEnabled: boolean) => {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!sessionId || !taskId) return false;
    
    console.log('Fetching results for:', { sessionId, taskId });
    
    try {
      setError(null);
      const results = await api.getResults(sessionId, taskId);
      console.log('Results received:', results);
      setData(results);
      
      // Stop polling if we've reached the target count
      if (results.count >= targetCount) {
        setIsLoading(false);
        return false; // Stop polling
      }
      
      return true; // Continue polling
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
      return false; // Stop polling on error
    }
  }, [sessionId, taskId, targetCount]);

  useEffect(() => {
    console.log('Polling effect triggered:', { isEnabled, sessionId, taskId });
    
    if (!isEnabled || !sessionId || !taskId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = async () => {
      console.log('Starting polling...');
      const shouldContinue = await fetchResults();
      
      if (shouldContinue) {
        console.log('Setting up interval polling...');
        intervalId = setInterval(async () => {
          const continuePolling = await fetchResults();
          if (!continuePolling && intervalId) {
            console.log('Stopping polling - target reached');
            clearInterval(intervalId);
            setIsLoading(false);
          }
        }, 5000);
      } else {
        console.log('Not continuing polling');
        setIsLoading(false);
      }
    };

    startPolling();

    return () => {
      if (intervalId) {
        console.log('Cleaning up polling interval');
        clearInterval(intervalId);
      }
      setIsLoading(false);
    };
  }, [isEnabled, sessionId, taskId, fetchResults]);

  return { data, isLoading, error };
};