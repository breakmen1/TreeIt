import React, { useState } from "react";

const LeftSidebar = ({
  projects = [],
  onAddProject,
  onSelectProject,
  selectedProjectId,
}) => {
  return (
    <div className="w-64 h-screen bg-gray-100 border-r px-4 py-6 fixed top-0 left-0">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      <div className="flex flex-col gap-2 mb-4">
        {projects.map((project, index) => {
          const isSelected = project.projectId === selectedProjectId;
          return (
            <button
              key={index}
              onClick={() => onSelectProject(project.projectId)}
              className={`text-left px-3 py-2 rounded shadow transition 
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-200 text-black"
                }`}
            >
              {project.name}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col">
        <button
          onClick={onAddProject}
          className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
