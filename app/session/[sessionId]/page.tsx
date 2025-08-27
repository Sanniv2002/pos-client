'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TaskForm } from '@/components/task-form';
import { ResultsTable } from '@/components/results-table';
import { TaskSidebar } from '@/components/task-sidebar';
import { usePolling } from '@/hooks/usePolling';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { TaskData, Task } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SessionPage() {
  const { sessionId } = useParams();
  const [sessionStorageId] = useSessionStorage('session_id', '');
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskSubmitted, setIsTaskSubmitted] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: results, isLoading } = usePolling(
    sessionStorageId || (sessionId as string),
    selectedTaskId,
    currentTask?.count || 0,
    isTaskSubmitted && selectedTaskId !== null
  );

  const handleTaskSubmit = (taskData: TaskData, taskId: string) => {
    setCurrentTask(taskData);
    setSelectedTaskId(taskId);
    setIsTaskSubmitted(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskSelect = (taskId: string, task: Task) => {
    console.log('Task selected:', { taskId, task });
    setSelectedTaskId(taskId);
    setCurrentTask({
      language: task.language,
      pos: task.pos,
      model: task.model,
      count: task.count,
    });
    // Reset and clear previous results when selecting a new task
    setIsTaskSubmitted(false);
    // Small delay to ensure state is updated before enabling polling
    setTimeout(() => {
      setIsTaskSubmitted(true);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Session: {sessionId}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Tasks Sidebar */}
          <div className="lg:col-span-1">
            <TaskSidebar
              sessionId={sessionStorageId || (sessionId as string)}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Middle Panel - Form */}
          <div className="lg:col-span-1 space-y-6">
            <TaskForm
              sessionId={sessionStorageId || (sessionId as string)}
              onTaskSubmit={handleTaskSubmit}
              isGenerating={isLoading}
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 h-full">
            {(results?.result.length || isLoading) && (
              <ResultsTable
                results={results?.result || []}
                count={results?.count || 0}
                targetCount={currentTask?.count || 0}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}