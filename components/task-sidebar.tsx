import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, Task } from '@/lib/api';
import { Clock, Globe, MessageSquare, Bot, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSidebarProps {
  sessionId: string;
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string, task: Task) => void;
  refreshTrigger: number;
}

export function TaskSidebar({ sessionId, selectedTaskId, onTaskSelect, refreshTrigger }: TaskSidebarProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      const response = await api.getTasks(sessionId);
      setTasks(response.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sessionId, refreshTrigger]);

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'perplexity': return '🔮';
      case 'gemini': return '💎';
      case 'groq': return '⚡';
      default: return '🤖';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Tasks</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-4">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => (
                <Button
                  key={task.task_id}
                  variant="ghost"
                  className={cn(
                    "w-full p-3 h-auto justify-start text-left hover:bg-accent",
                    selectedTaskId === task.task_id && "bg-accent"
                  )}
                  onClick={() => onTaskSelect(task.task_id, task)}
                >
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getModelIcon(task.model)}</span>
                        <span className="font-medium capitalize">{task.model}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.count}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{task.language}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{task.pos}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      ID: {task.task_id}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}