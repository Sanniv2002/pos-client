'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api, TaskData } from '@/lib/api';
import { toast } from 'sonner';
import { Globe, MessageSquare, Bot, Hash, Play } from 'lucide-react';

interface TaskFormProps {
  sessionId: string;
  onTaskSubmit: (taskData: TaskData, taskId: string) => void;
  isGenerating: boolean;
}

const languages = ['Hindi', 'Tamil', 'Telugu', 'English'];
const posOptions = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'article'];
const models = [
  { value: 'perplexity', label: 'Perplexity', icon: '🔮' },
  { value: 'gemini', label: 'Gemini', icon: '💎' },
  { value: 'groq', label: 'Groq', icon: '⚡' },
];
const counts = [10, 20, 30];

export function TaskForm({ sessionId, onTaskSubmit, isGenerating }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskData>({
    language: '',
    pos: '',
    model: '',
    count: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.language || !formData.pos || !formData.model) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await api.submitTask({
        session_id: sessionId,
        task_data: formData,
      });
      
      toast.success('Task submitted successfully!');
      onTaskSubmit(formData, response.task_id);
    } catch (error) {
      toast.error('Failed to submit task');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>Task Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pos" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Part of Speech</span>
              </Label>
              <Select
                value={formData.pos}
                onValueChange={(value) => setFormData({ ...formData, pos: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select POS" />
                </SelectTrigger>
                <SelectContent>
                  {posOptions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span>Model</span>
              </Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <span className="flex items-center space-x-2">
                        <span>{model.icon}</span>
                        <span>{model.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Count</span>
              </Label>
              <Select
                value={formData.count.toString()}
                onValueChange={(value) => setFormData({ ...formData, count: parseInt(value) })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {counts.map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !formData.language || !formData.pos || !formData.model}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}