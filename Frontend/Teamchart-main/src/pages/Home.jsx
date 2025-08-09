import React, { useEffect, useState } from "react";
import api from "../components/utility/BaseAPI";
import ReactFlowProviderContent from "../components/GraphPage";
import LeftSidebar from "../components/LeftsidePanel";
import PageWrapper from "../components/ui/PageWrapper";
import { FaBars, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { useGlobalContext } from "../components/utility/SidebarSlide";
import { showError, showSuccess, showInfo } from "../components/utility/ToastNotofication";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllMembers = async () => {
    try {
      const res = await api.get(`/members`);
      setAllMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setAllMembers([]);
    }
  };

  useEffect(() => {
    if (isModalOpen) fetchAllMembers();
  }, [isModalOpen]);

  // Fetch projects from backend on mount with loading state
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const memberId = localStorage.getItem("memberId");
      if (!memberId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get(`/projects/member/${memberId}`);
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[res.data.length - 1].projectId);
        }
      } catch (err) {
        console.error("Error fetching user projects", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // Add new project to backend
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
        memberId: memberId,
        memberIds: selectedMembers
      });

      setProjects((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewProjectName("");
      setSelectedMembers([]);
      setSelectedProjectId(response.data.projectId);
      showSuccess("Project created successfully!");

    } catch (err) {
      showInfo("Please select at least one member before creating project");
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
        <motion.div 
          className="flex flex-row w-full gap-10 pb-4 shadow-sm p-[13px] ml-64"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div>
            <motion.button
              onClick={openSidebar}
              className={`${isSidebarOpen ? "translate-x-8" : "translate-x-0"
                } fixed top-4 right-4 transition transform ease-linear duration-500 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none hover:bg-gray-200 hover:text-gray-800`}
              whileHover={{ scale: 1.1, backgroundColor: "#EEF2FF" }}
              whileTap={{ scale: 0.9 }}
            >
              <FaBars className="w-5 h-5" />
            </motion.button>
          </div>
          <div>
            {/* Title with animated gradient */}
            <motion.h2 
              className="mt-2 text-4xl font-bold mb-2 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                TreeIt
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Chart
              </span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-24 h-1 bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.h2>
          </div>
        </motion.div>

        {/* Flow with animation */}
        <motion.div 
          className="ml-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <motion.div 
                className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <ReactFlowProviderContent
              selectedProjectId={selectedProjectId}
            />
          )}
        </motion.div>

        {/* Create Project Modal with animation */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div 
                className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-5">
                  <motion.h2 
                    className="text-2xl font-semibold text-gray-800"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Create New Project
                  </motion.h2>
                  
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={18} />
                  </motion.button>
                </div>

                {/* Project Name Input */}
                <motion.div 
                  className="mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProjectName}
                    onChange={(e) => {
                      setNewProjectName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    className={`w-full rounded-xl px-4 py-3 border outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      nameError ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {nameError && (
                    <motion.p 
                      className="text-red-500 text-xs mt-1 pl-2"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Project name is required.
                    </motion.p>
                  )}
                </motion.div>

                {/* Search Members */}
                <motion.div 
                  className="mb-4 relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-4 py-3 border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </motion.div>

                {/* Member List */}
                <motion.div 
                  className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-5 text-sm bg-gray-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {allMembers
                    .filter((m) => m.memberId !== localStorage.getItem("memberId"))
                    .filter((m) =>
                      m.username.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => a.username.localeCompare(b.username))
                    .map((member, index) => (
                      <motion.label 
                        key={member.memberId} 
                        className="flex items-center mb-2 cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (index * 0.05) }}
                        whileHover={{ x: 2 }}
                      >
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
                          className="mr-3 accent-blue-500 h-4 w-4"
                        />
                        <span className="text-gray-700">{member.username}</span>
                      </motion.label>
                    ))}
                </motion.div>

                {/* Buttons */}
                <motion.div 
                  className="flex justify-end gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={() => handleAddProject(newProjectName)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus size={12} />
                    Create
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Home;