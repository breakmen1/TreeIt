import { useState, useEffect } from 'react';

import { showError, showSuccess, showInfo } from "../utility/ToastNotofication";

import './../../style/Nodecard.css';

const Nodecard = ({
  show,
  onClose,
  nodeName,
  description,
  todos,
  isCompleted,
  assignedTo,
  creatorId,
  onToggleTodo,
  onMarkCompleted,
  onAddTodo,
  status,
  onStatusChange,
  nodeData,
  onDeadlineChange,
}) => {
  // States Start
  const [newTodo, setNewTodo] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  // States End

  useEffect(() => {
    if (show) {
      setDeadline(nodeData.deadline);
    }
  }, []);

  if (!show) return null;

  const loggedInMember = localStorage.getItem("username");
  const loggedInMemberId = localStorage.getItem("memberId");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          ×
        </button>

        {/* Title & Description */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">{nodeName}</h2>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {/* Status Dropdown */}
        {assignedTo === loggedInMember && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
            >
              <option value="">None</option>
              <option value="pending">Pending</option>
              <option value="stuck">Stuck</option>
            </select>
          </div>
        )}

        {/* Deadline editor (only for creator) */}
        {creatorId === loggedInMemberId && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edit Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
            />
            <button
              onClick={async () => {
                if (!deadline) {
                  showError("Deadline cannot be empty");
                  return;
                }
                try {
                  await onDeadlineChange(deadline);
                  showSuccess("Deadline updated successfully!");
                } catch (e) {
                  showError("Failed to update deadline");
                }
              }}
              className="mt-2 bg-blue-600 text-white text-sm py-2 px-6 rounded hover:bg-blue-700 transition"
            >
              Update Deadline
            </button>
          </div>
        )}

        {/* Todo List */}
        <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  if (assignedTo === loggedInMember) {
                    onToggleTodo(todo.id);
                  } else {
                    showError("You are not assigned to this task.");
                  }
                }}
                className="accent-blue-500 w-4 h-4"
              />
              <span className={todo.completed ? "line-through text-gray-500" : ""}>
                {todo.task}
              </span>
            </li>
          ))}
        </ul>

        {/* Add Todo Section (only for creator) */}
        {creatorId === loggedInMemberId && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="New task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={async () => {
                if (newTodo.trim() !== "") {
                  await onAddTodo(newTodo);
                  setNewTodo("");
                }
              }}
              className="bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
            >
              Add Todo
            </button>
          </div>
        )}

        {/* Mark Complete Button (only for assigned user) */}
        {assignedTo === loggedInMember && (
          <button
            onClick={onMarkCompleted}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Mark Node as Completed
          </button>
        )}
      </div>
    </div>

  );
};

export default Nodecard;