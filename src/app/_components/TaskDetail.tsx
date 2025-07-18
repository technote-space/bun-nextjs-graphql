'use client';

import type { UpdateTaskInput } from '$/types';
import {
  useCompleteTask,
  useDeleteTask,
  useGetTask,
  useStartTask,
  useUpdateTask,
} from '@/_hooks/useTasks';
import dayjs from 'dayjs';
import { useState } from 'react';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function TaskDetail({ taskId, onClose, onDeleted }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiredAt, setExpiredAt] = useState<Date | null | undefined>(
    undefined,
  );

  // Query to get task details
  const { loading, error, data } = useGetTask(taskId);

  // Set form values when data is loaded
  if (data?.task) {
    if (!title) setTitle(data.task.title);
    if (!description) setDescription(data.task.description);
    if (expiredAt === undefined) setExpiredAt(data.task.expiredAt);
  }

  // Mutation to update a task
  const [updateTask, { loading: updating }] = useUpdateTask(taskId);

  // Mutation to complete a task
  const [completeTask, { loading: completing }] = useCompleteTask(taskId);

  // Mutation to start a task
  const [startTask, { loading: starting }] = useStartTask(taskId);

  // Mutation to delete a task
  const [deleteTask, { loading: deleting }] = useDeleteTask({
    onCompleted: () => {
      onDeleted();
    },
  });

  const handleUpdate = async () => {
    if (!isEditing) {
      // Prevent editing if task is already completed
      if (isCompleted) {
        return;
      }
      setIsEditing(true);
      return;
    }

    const input: UpdateTaskInput = {};
    if (title !== data?.task.title) input.title = title;
    if (description !== data?.task.description) input.description = description;

    // Check if expiredAt has changed
    const currentExpiredAt = data?.task.expiredAt ?? null;
    if (expiredAt !== currentExpiredAt) {
      input.expiredAt = expiredAt ? new Date(expiredAt) : null;
    }

    if (Object.keys(input).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await updateTask({
        variables: {
          id: taskId,
          input,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask({
        variables: {
          id: taskId,
        },
      });
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleStart = async () => {
    try {
      await startTask({
        variables: {
          id: taskId,
        },
      });
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask({
          variables: {
            id: taskId,
          },
        });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading)
    return <div className="p-4 text-foreground">Loading task details...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.task)
    return <div className="p-4 text-foreground">Task not found</div>;

  const task = data.task;
  const isCompleted = !!task.completedAt;
  const canBeStarted = !task.startedAt && !task.completedAt;

  return (
    <div className="bg-card-background rounded-lg shadow-lg p-6 max-w-2xl mx-auto border border-card-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">Task Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-foreground/70 hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Title
          </label>
          {isEditing ? (
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-input-background border-input-border text-foreground"
            />
          ) : (
            <p
              id="task-title"
              className="p-2 bg-input-background rounded border border-input-border text-foreground"
            >
              {task.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Description
          </label>
          {isEditing ? (
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded bg-input-background border-input-border text-foreground"
            />
          ) : (
            <p
              id="task-description"
              className="p-2 bg-input-background rounded whitespace-pre-wrap border border-input-border text-foreground"
            >
              {task.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-created"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Created
            </label>
            <p
              id="task-created"
              className="p-2 bg-input-background rounded border border-input-border text-foreground"
            >
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label
              htmlFor="task-updated"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Updated
            </label>
            <p
              id="task-updated"
              className="p-2 bg-input-background rounded border border-input-border text-foreground"
            >
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="task-expired"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Expires
          </label>
          {isEditing ? (
            <input
              id="task-expired"
              type="datetime-local"
              value={
                expiredAt ? dayjs(expiredAt).format('YYYY-MM-DDTHH:mm') : ''
              }
              onChange={(e) =>
                setExpiredAt(e.target.value ? new Date(e.target.value) : null)
              }
              className="w-full p-2 border rounded bg-input-background border-input-border text-foreground"
            />
          ) : (
            <p
              id="task-expired"
              className="p-2 bg-input-background rounded border border-input-border text-foreground"
            >
              {task.expiredAt
                ? new Date(task.expiredAt).toLocaleString()
                : 'No expiration date'}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Status
          </label>
          <p
            id="task-status"
            className="p-2 bg-input-background rounded border border-input-border text-foreground"
          >
            {isCompleted ? (
              <span className="text-green-500">
                Completed on{' '}
                {task.completedAt
                  ? new Date(task.completedAt).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span className="text-yellow-500">Not completed</span>
            )}
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={updating || isCompleted}
            className="px-4 py-2 bg-button-primary text-button-primary-text rounded hover:bg-button-primary/90 disabled:opacity-50"
          >
            {isEditing ? 'Save Changes' : 'Edit Task'}
          </button>

          {canBeStarted && (
            <button
              type="button"
              onClick={handleStart}
              disabled={starting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600/90 disabled:opacity-50"
            >
              Start Task
            </button>
          )}

          {!isCompleted && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600/90 disabled:opacity-50"
            >
              Mark as Completed
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-500/90 disabled:opacity-50"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
