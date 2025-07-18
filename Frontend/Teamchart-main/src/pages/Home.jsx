import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/LeftSide";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../components/Sidebar";
import ReactFlowProviderContent from "../components/HomeComponent";
import { v4 as uuidv4 } from "uuid";
import api from "../components/BaseAPI";

const Home = () => {
  const { openSidebar, isSidebarOpen } = useGlobalContext();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const fetchAllMembers = async () => {
  try {
    const res = await api.get(`/members`);
    console.log("Fetched members:", res.data); // ✅ Add this to verify format
    setAllMembers(res.data); // might need res.data.members
  } catch (error) {
    console.error("Error fetching members:", error);
    setAllMembers([]); // fallback to empty array to prevent map error
  }
};

  useEffect(() => {
    if (isModalOpen) fetchAllMembers();
  }, [isModalOpen]);

  // ✅ Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      const memberId = localStorage.getItem("memberId");
      if (!memberId) return;

      try {
        const res = await api.get(
          `/projects/member/${memberId}`
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching user projects", err);
      }
    };

    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // ✅ Add new project to backend
  const handleAddProject = async (name) => {
    try {
      const memberId = localStorage.getItem("memberId");
      const response = await api.post(`/projects`, {
        name: name,
        // projectId: projectId,
        memberId: memberId,
        memberIds: selectedMembers
      });

      setProjects((prev) => [...prev, response.data]);
      console.log(response.data);
      setIsModalOpen(false);
      setNewProjectName("");
      setSelectedMembers([]);
      
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
        onAddProject={openCreateModal}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full mb-3 border px-3 py-2"
            />

            <div className="max-h-40 overflow-y-auto border p-2 mb-4">
              {allMembers.filter((member) => member.memberId != localStorage.getItem("memberId")).map((member) => (
                <label key={member.memberId} className="block mb-1 text-sm">
                  <input
                    type="checkbox"
                    value={member.memberId}
                    checked={selectedMembers.includes(member.memberId)}
                    onChange={(e) => {
                      const memberId = member.memberId;
                      setSelectedMembers((prev) =>
                        prev.includes(memberId)
                          ? prev.filter((uid) => uid !== memberId)
                          : [...prev, memberId]
                      );
                    }}
                    className="mr-2"
                  />
                  {member.username}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleAddProject(newProjectName)}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
