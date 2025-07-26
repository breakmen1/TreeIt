import React, { useState, useEffect } from "react";

const LeftSidebar = ({
  projects = [],
  onAddProject,
  onSelectProject,
  selectedProjectId,
}) => {
  const username = localStorage.getItem("username") || "User";
  const avatarKey = `avatar-${username}`;

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundType=gradientLinear&fontFamily=Trebuchet%20MS&fontSize=41`;

  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    localStorage.setItem(avatarKey, avatar);
  }, [avatar, avatarKey]);

  return (
    <>
      <div className="w-64 h-screen bg-gray-100 border-r px-4 py-6 fixed top-0 left-0">
        {/* User Profile Section */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <img
              src={avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <span className="text-lg font-semibold">{username}</span>
          </div>
        </div>

        {/* Folder toggle */}
        <div className="flex justify-between items-center mb-2 cursor-pointer">
          <p
            className="text-md font-medium text-gray-700 hover:text-blue-600 transition"
            onClick={() => setIsProjectOpen((prev) => !prev)}
          >
            {isProjectOpen ? "📂 projects" : "📁 open projects"}
          </p>
        </div>

        {/* Projects List with Transition */}
        <div
          className={`flex flex-col gap-2 mb-4 transition-all duration-300 ease-in-out overflow-hidden ${
            isProjectOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          {projects.map((project, index) => {
            const isSelected = project.projectId === selectedProjectId;
            return (
              <button
                key={index}
                onClick={() => onSelectProject(project.projectId)}
                className={`text-left px-3 py-2 rounded shadow transition ${
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

        {/* Create Project Button */}
        <button
          onClick={onAddProject}
          className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl w-[90%] max-w-[600px] shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black"
              onClick={() => setIsProfileModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              User Profile & Analytics
            </h2>

            <div className="flex flex-col items-center mb-6">
              <img
                src={avatar}
                alt="Current Avatar"
                className="w-20 h-20 rounded-full border-4 border-blue-500 mb-2"
              />
              <p className="text-lg font-medium">{username}</p>
              <p className="text-sm text-gray-500">
                {localStorage.getItem("email") || "Email not set"}
              </p>
            </div>

            <hr className="mb-4" />

            <h3 className="text-md font-semibold mb-2">Analytics</h3>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              <li>Total Projects: {projects.length}</li>
              <li>Active Projects: N/A</li>
              <li>Member ID: {localStorage.getItem("memberId")}</li>
              <li>Joined Since: Jan 2024</li>
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
