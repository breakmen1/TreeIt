import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftSidebar from "../components/LeftSide";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../components/Sidebar";
import ReactFlowProviderContent from "../components/HomeComponent";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const { openSidebar, isSidebarOpen } = useGlobalContext();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // ✅ Fetch projects from backend on mount
  useEffect(() => {
  const fetchProjects = async () => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) return;

    try {
      const res = await axios.get(`http://localhost:2999/projects/member/${memberId}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching user projects", err);
    }
  };

  fetchProjects();
}, []);

  // ✅ Add new project to backend
  const handleAddProject = async (name, projectId) => {
    try {
      const memberId = localStorage.getItem("memberId");
      const response = await axios.post("http://localhost:2999/projects", {
        name: name,
        projectId: projectId,
        memberId: memberId
      });

      setProjects((prev) => [...prev, response.data]);
      console.log(response.data);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div>
      {/* Sidebar */}
      <LeftSidebar
        projects={projects}
        onAddProject={handleAddProject}
        onSelectProject={handleSelectProject}
        selectedProjectId={selectedProjectId}
      />

      {/* NavBar */}
      <div className="flex flex-row w-full gap-10 pb-4 shadow-sm p-[13px] ml-64">
        <div>
          <button
            onClick={openSidebar}
            className={`${
              isSidebarOpen ? "translate-x-8" : "translate-x-0"
            } fixed top-4 right-4 transition transform ease-linear duration-500 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none hover:bg-gray-200 hover:text-gray-800`}
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

      {/* Flow */}
      <div className="ml-64">
        <ReactFlowProviderContent selectedProjectId={selectedProjectId} />
      </div>
    </div>
  );
};

export default Home;
