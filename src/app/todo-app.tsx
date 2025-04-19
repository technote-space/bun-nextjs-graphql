'use client';

import { useState } from 'react';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TaskDetail } from './components/TaskDetail';
import { TaskList } from './components/TaskList';

interface TodoAppProps {
  userId: string;
}

export default function TodoApp({ userId }: TodoAppProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTaskList, setRefreshTaskList] = useState(0);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseDetail = () => {
    setSelectedTaskId(null);
  };

  const handleTaskDeleted = () => {
    setSelectedTaskId(null);
  };

  const handleToggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleTaskCreated = () => {
    setShowCreateForm(false);
    setRefreshTaskList((prev) => prev + 1); // Increment to trigger a refresh
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left sidebar - Task creation */}
      <div className="md:col-span-1">
        <div className="bg-card-background rounded-lg shadow p-6 mb-6 border border-card-border">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Task Management
          </h2>
          <button
            type="button"
            onClick={handleToggleCreateForm}
            className="w-full py-2 px-4 bg-button-primary text-button-primary-text rounded hover:bg-button-primary/90"
          >
            {showCreateForm ? 'Hide Form' : 'Create New Task'}
          </button>
        </div>

        {showCreateForm && (
          <CreateTaskForm userId={userId} onCreated={handleTaskCreated} />
        )}
      </div>

      {/* Main content - Task list or detail */}
      <div className="md:col-span-2">
        {selectedTaskId ? (
          <TaskDetail
            taskId={selectedTaskId}
            onClose={handleCloseDetail}
            onDeleted={handleTaskDeleted}
          />
        ) : (
          <div className="bg-card-background rounded-lg shadow p-6 border border-card-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Your Tasks
            </h2>
            <TaskList
              onTaskSelect={handleTaskSelect}
              refreshTrigger={refreshTaskList}
            />
          </div>
        )}
      </div>
    </div>
  );
}
