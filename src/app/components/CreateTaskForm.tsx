'use client';

import type { CreateTaskInput } from '@/hooks/types';
import { useCreateTask } from '@/hooks/useTasks';
import { useState } from 'react';

interface CreateTaskFormProps {
  userId: string;
  onCreated?: () => void;
}

export function CreateTaskForm({ userId, onCreated }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [createTask, { loading }] = useCreateTask({
    onCompleted: () => {
      // Reset form and call onCreated callback
      setTitle('');
      setDescription('');
      setError(null);
      if (onCreated) {
        onCreated();
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    // Create task input
    const input: CreateTaskInput = {
      userId,
      title: title.trim(),
      description: description.trim(),
    };

    try {
      await createTask({
        variables: { input },
      });
    } catch {
      // Error is handled in onError callback
    }
  };

  return (
    <div className="bg-card-background rounded-lg shadow p-6 mb-6 border border-card-border">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded">{error}</div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-input-background border-input-border text-foreground"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded bg-input-background border-input-border text-foreground"
            placeholder="Enter task description"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-button-primary text-button-primary-text rounded hover:bg-button-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
