'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export function CreateSessionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setSessionId] = useSessionStorage('session_id', '');

  const handleCreateSession = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.createSession();
      setSessionId(response.session_id);
      toast.success(response.message);
      window.location.href = `/session/${response.session_id}`;
    } catch (error) {
      toast.error('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateSession}
      disabled={isLoading}
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition duration-200 hover:scale-105 disabled:transform-none"
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Creating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Create Session
        </>
      )}
    </Button>
  );
}