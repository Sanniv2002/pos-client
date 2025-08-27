'use client';

import { CreateSessionButton } from '@/components/create-session-button';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Language Learning AI
            </h1>
          </div>

          <CreateSessionButton />
        </div>
      </Card>
    </div>
  );
}