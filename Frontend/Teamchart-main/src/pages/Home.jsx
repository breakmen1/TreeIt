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
            {/* Title */}
            <h2 className="mt-2 text-4xl font-bold text-gray-800 mb-2">
              TreeIt <span className="text-blue-500">Chart</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-semibold mb-5 text-gray-800">Create New Project</h2>

              {/* Project Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                    if (nameError) setNameError(false);
                  }}
                  className={`w-full rounded-xl px-4 py-2 border outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${nameError ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">Project name is required.</p>
                )}
              </div>

              {/* 🔍 Live Member Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl px-4 py-2 border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              {/* ✅ Filtered Member List */}
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-5 text-sm bg-gray-50">
                {allMembers
                  .filter((m) => m.memberId !== localStorage.getItem("memberId"))
                  .filter((m) =>
                    m.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((member) => (
                    <label key={member.memberId} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={member.memberId}
                        checked={selectedMembers.includes(member.memberId)}
                        onChange={() => {
                          const id = member.memberId;
                          setSelectedMembers((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                        className="mr-3 accent-blue-500"
                      />
                      <span className="text-gray-700">{member.username}</span>
                    </label>
                  ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
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