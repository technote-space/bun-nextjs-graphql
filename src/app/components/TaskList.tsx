'use client';

import { SortOrder, TaskSortKey } from '@/hooks/types';
import { useGetTasks } from '@/hooks/useTasks';
import { useState } from 'react';

interface TaskListProps {
  onTaskSelect: (taskId: string) => void;
  refreshTrigger?: number;
}

export function TaskList({ onTaskSelect, refreshTrigger = 0 }: TaskListProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<TaskSortKey>(TaskSortKey.ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  const { loading, error, data } = useGetTasks(
    {
      page,
      perPage,
      sortKey,
      sortOrder,
      q: activeSearchQuery || undefined,
    },
    refreshTrigger,
  );

  // Update perPage state if it's different from the server
  if (
    data?.tasks?.pageInfo?.perPage &&
    data.tasks.pageInfo.perPage !== perPage
  ) {
    setPerPage(data.tasks.pageInfo.perPage);
  }

  const handleNextPage = () => {
    if (
      data &&
      data.tasks.pageInfo.currentPage < data.tasks.pageInfo.totalPage
    ) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (data && data.tasks.pageInfo.currentPage > 1) {
      setPage(page - 1);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortKey(event.target.value as TaskSortKey);
  };

  const handleOrderChange = () => {
    setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Update the active search query and reset to first page
    setActiveSearchQuery(searchQuery);
    setPage(1);
  };

  if (loading && !data) return <div className="p-4">Loading tasks...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error loading tasks: {error.message}
      </div>
    );

  const tasks = data?.tasks.edges || [];

  return (
    <div className="w-full">
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 p-2 border rounded bg-input-background border-input-border text-foreground"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-button-primary text-button-primary-text rounded"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortKey}
            onChange={handleSortChange}
            className="p-2 border rounded bg-input-background border-input-border text-foreground"
          >
            <option value={TaskSortKey.ID}>ID</option>
            <option value={TaskSortKey.TITLE}>Title</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleOrderChange}
          className="px-3 py-1 border rounded flex items-center gap-1 bg-button-secondary text-button-secondary-text border-input-border"
        >
          {sortOrder === SortOrder.ASC ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-4 text-center border rounded border-card-border text-foreground bg-card-background">
          No tasks found
        </div>
      ) : (
        <div className="border rounded divide-y border-card-border bg-card-background">
          {tasks.map(({ node }) => (
            <button
              key={node.id}
              type="button"
              className="p-4 hover:bg-hover-background cursor-pointer w-full text-left text-foreground"
              onClick={() => onTaskSelect(node.id)}
              aria-label={`View task: ${node.title}`}
            >
              <h3 className="font-medium">{node.title}</h3>
              <p className="text-sm line-clamp-2">{node.description}</p>
              <div className="mt-2 flex items-center text-xs">
                <span>
                  {node.completedAt
                    ? `Completed: ${new Date(node.completedAt).toLocaleDateString()}`
                    : 'Not completed'}
                </span>
                <span className="mx-2">•</span>
                <span>
                  Created: {new Date(node.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={
            !data?.tasks.pageInfo || data?.tasks.pageInfo.currentPage <= 1
          }
          className="px-4 py-2 bg-button-secondary text-button-secondary-text rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-center text-foreground">
          <span className="py-2">
            Page {data?.tasks.pageInfo.currentPage || page} of{' '}
            {data?.tasks.pageInfo.totalPage || 1}
          </span>
          {data?.tasks.pageInfo.totalCount !== undefined && (
            <div className="text-sm">
              Total items: {data.tasks.pageInfo.totalCount}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={
            !data?.tasks.pageInfo ||
            data?.tasks.pageInfo.currentPage >= data?.tasks.pageInfo.totalPage
          }
          className="px-4 py-2 bg-button-secondary text-button-secondary-text rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
