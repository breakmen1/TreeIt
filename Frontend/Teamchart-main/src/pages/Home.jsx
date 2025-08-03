import React, { useEffect, useState } from "react";

import api from "../components/utility/BaseAPI";

import ReactFlowProviderContent from "../components/GraphPage";
import LeftSidebar from "../components/LeftsidePanel";
import PageWrapper from "../components/ui/PageWrapper";

import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../components/utility/SidebarSlide";
import { showError, showSuccess, showInfo } from "../components/utility/ToastNotofication";

const Home = () => {
  const { openSidebar, isSidebarOpen } = useGlobalContext();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        console.log(projects.length);
        if (projects.length > 0) {
          setSelectedProjectId(projects[projects.length - 1].projectId);
        }
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
    if (!newProjectName.trim()) {
      setNameError(true);
      showInfo("Project name is mandatory!");
      return;
    }
    setNameError(false);
    try {
      const memberId = localStorage.getItem("memberId");
      const response = await api.post(`/projects`, {
        name: name,
        // projectId: projectId,
        memberId: memberId,
        memberIds: selectedMembers
      });

      console.log(response.data);
      setProjects((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewProjectName("");
      setSelectedMembers([]);
      setSelectedProjectId(response.data.projectId);

    } catch (err) {
      showInfo("Please select atleast one member before creating project");
    }
  };

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[projects.length - 1].projectId);
    }
  }, [projects, selectedProjectId]);

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  return (
    <PageWrapper>
      <div className="font-poppins">
        {/* Sidebar */}
        <LeftSidebar
          projects={projects}
          onAddProject={openCreateModal}
          onSelectProject={handleSelectProject}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />

        {/* NavBar */}
        <div className="flex flex-row w-full gap-10 pb-4 shadow-sm p-[13px] ml-64">
          <div>
            <button
              onClick={openSidebar}
              className={`${isSidebarOpen ? "translate-x-8" : "translate-x-0"
                } fixed top-4 right-4 transition transform ease-linear duration-500 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none hover:bg-gray-200 hover:text-gray-800`}
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="font-poppins mt-2 text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent tracking-tight">
              TreeIt <span className="font-poppins from-green-300 to-green-500 bg-gradient-to-r bg-clip-text text-transparent">Chart</span>
            </h2>
          </div>
        </div>

        {/* Flow */}
        <div className="ml-64">
          <ReactFlowProviderContent
            selectedProjectId={selectedProjectId}
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>

              {/* Project Name Input */}
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  if (nameError) setNameError(false);
                }}
                className={`w-full mb-1 border px-3 py-2 ${nameError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mb-3">Project name is required.</p>
              )}

              {/* 🔍 Live Member Search */}
              <input
                type="text"
                placeholder="Search members..."
                className="w-full mb-2 px-3 py-1 border border-gray-300 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* ✅ Filtered Member List */}
              <div className="max-h-40 overflow-y-auto border p-2 mb-4 text-sm">
                {allMembers
                  .filter((m) => m.memberId !== localStorage.getItem("memberId"))
                  .filter((m) =>
                    m.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((member) => (
                    <label key={member.memberId} className="block mb-1">
                      <input
                        type="checkbox"
                        value={member.memberId}
                        checked={selectedMembers.includes(member.memberId)}
                        onChange={(e) => {
                          const id = member.memberId;
                          setSelectedMembers((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                        className="mr-2"
                      />
                      {member.username}
                    </label>
                  ))}
              </div>

              {/* Buttons */}
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
    </PageWrapper>
  );
};

export default Home;