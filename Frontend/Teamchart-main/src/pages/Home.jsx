import React, { useState } from "react";
import LeftSidebar from "../components/LeftSide"; // make sure the path is correct
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../components/Sidebar";
import ReactFlowProviderContent from "../components/HomeComponent";

const Home = () => {
  const { openSidebar, isSidebarOpen } = useGlobalContext();

  // ✅ Add this state to track project list
  const [projects, setProjects] = useState([]);

  // ✅ Function to add new project
  const handleAddProject = (projectName) => {
    const newProject = {
      id: Date.now(), // you can replace this with a backend ID if needed
      name: projectName,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId); // ✅ Set selected project ID
  };

  return (
    <div>
      {/* Add Left Sidebar */}
      <LeftSidebar
        projects={projects}
        onAddProject={handleAddProject}
        onSelectProject={handleSelectProject}
      />

      {/* NavBar */}
      <div className="flex flex-row w-full gap-10 pb-4 shadow-sm p-[13px] ml-64">
        <div>
          <button
            onClick={openSidebar}
            className={`${isSidebarOpen ? "-translate-x-8" : "translate-x-0"
              } fixed mt-3 top-2 transition transform ease-linear duration-500 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none hover:bg-gray-200 hover:text-gray-800`}
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h2 className="mt-[0.34rem] text-3xl font-semibold text-gray-700">
            Team <span className="-ml-1 text-pink-500">Chart</span>
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <ReactFlowProviderContent selectedProjectId={selectedProjectId} />
      </div>
    </div>
  );
};

export default Home;
