import './../style/NodeDetailsModal.css';
import { useState } from 'react';

const NodeDetailsModal = ({ show, onClose, nodeName, description, todos, isCompleted, onToggleTodo, onMarkCompleted, onAddTodo, status, onStatusChange, }) => {
  const [newTodo, setNewTodo] = useState('');
  if (!show) return null;
  console.log("todos-->" + todos);
  
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-button" onClick={onClose}>×</button>

        <h2 className="modal-title">{nodeName}</h2>
        <p className="modal-description">{description}</p>
        <div className="mt-1">
          <label>
            <strong>Status:</strong>
            <select
              className="ml-1 text-black rounded"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">None</option>
              <option value="pending">Pending</option>
              <option value="stuck">Stuck</option>
            </select>
          </label>
        </div>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
              />
              {todo.task}
            </li>
          ))}
        </ul>

        <div className="modal-actions flex flex-col gap-2">
          <input
            type="text"
            placeholder="New task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border p-1 rounded"
          />

          <button
            onClick={async () => {
              if (newTodo.trim() !== "") {
                await onAddTodo(newTodo);
                setNewTodo('');
              }
            }}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>

          <button
            onClick={onMarkCompleted}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          >
            Mark Node Completed
          </button>
        </div>

      </div>
    </div>
  );
};

export default NodeDetailsModal;