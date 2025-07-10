import React, { useState } from "react";

const LeftSidebar = ({ projects = [], onAddProject, onSelectProject }) => {
  const [newProjectName, setNewProjectName] = useState("");

  const handleAddProject = () => {
    if (newProjectName.trim() !== "") {
      onAddProject(newProjectName); // inform parent
      setNewProjectName(""); // clear input
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 border-r px-4 py-6 fixed top-0 left-0">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      <div className="flex flex-col gap-2 mb-4">
        {projects.map((project, index) => (
          <button
            key={index}
            onClick={() => onSelectProject(project.projectId)}
            className="text-left px-3 py-2 rounded hover:bg-gray-200 bg-white shadow"
          >
            {project.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="New project"
          className="border px-2 py-1 mb-2 text-sm"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button
          onClick={handleAddProject}
          className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
