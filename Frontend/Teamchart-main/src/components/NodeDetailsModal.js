import './../style/NodeDetailsModal.css';

const NodeDetailsModal = ({ show, onClose, nodeName, description, todos, isCompleted, onToggleTodo, onMarkCompleted, onAddTodo }) => {
  if (!show) return null;
  console.log("todos-->"+todos);
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-button" onClick={onClose}>×</button>

        <h2 className="modal-title">{nodeName}</h2>
        <p className="modal-description">{description}</p>

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

        <div className="modal-actions">
          <input
            type="text"
            placeholder="New task..."
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                await onAddTodo(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button onClick={onMarkCompleted}>Mark Node Completed</button>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsModal;