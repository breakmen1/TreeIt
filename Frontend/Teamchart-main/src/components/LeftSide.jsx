import React, { useState, useEffect } from "react";
import api from "./BaseAPI";
const LeftSidebar = ({
  projects = [],
  onAddProject,
  onSelectProject,
  selectedProjectId,
  setSelectedProjectId
}) => {
  const username = localStorage.getItem("username") || "User";
  const avatarKey = `avatar-${username}`;
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundType=gradientLinear&fontFamily=Trebuchet%20MS&fontSize=41`;

  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [menuOpenId, setMenuOpenId] = useState(null); // which project’s menu open
  const [candidateMembers, setCandidateMembers] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const [allMembers, setAllMembers] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  // ⬇️ Fetch all members when Add Members modal is opened
  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const res = await api.get(`/members`);
        setAllMembers(res.data);
      } catch (error) {
        console.error("Error fetching members:", error);
        setAllMembers([]);
      }
    };

    if (modalProject) fetchAllMembers();
  }, [modalProject]);

  const availableCandidates = allMembers.filter(
    (member) => !modalProject?.members?.some((m) => m._id === member._id)
  );


  // Toggle menu visibility
  const toggleMenu = (pid) =>
    setMenuOpenId((prev) => (prev === pid ? null : pid));

  const onSelectProjectClick = (pid) => {
    onSelectProject(pid);
    setMenuOpenId(null);
  };

  const openAddMemberModal = async (project) => {
    setModalProject(project);

    const res = await api.get(`/projects/${selectedProjectId}/members`);

    // compute candidates not in project
    const currentIds = res.data?.map((m) => m.memberId) || [];
    const candidates = allMembers.filter(
      (m) => !currentIds.includes(m.memberId)
    );
    setCandidateMembers(candidates);
    setSelectedCandidates([]); // initially none selected
    setMenuOpenId(null);
  };

  const handleUpdateMembers = async () => {
    if (!modalProject) return;
    try {
      await api.put(`/projects/${modalProject.projectId}/add-members`, {
        memberIds: selectedCandidates,
      });
      alert("Members updated successfully");
      setSelectedProjectId(null); // temporarily unset
      setTimeout(() => setSelectedProjectId(modalProject.projectId), 0); // then reset
      setModalProject(null);
      // optionally trigger parent to refetch or update projects array
    } catch (err) {
      console.error(err);
      alert("Error updating members");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await api.delete(`/projects/${projectId}`);
      alert("Deleted");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };
  return (
    <>
      <div className="w-64 h-screen bg-gray-100 border-r px-4 py-6 fixed top-0 left-0">
        {/* User Profile */}
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
            className="text-md font-semibold text-gray-700 hover:text-blue-600 transition"
            onClick={() => setIsProjectOpen((prev) => !prev)}
          >
            {isProjectOpen ? "📂 Projects" : "📁 Open Projects"}
          </p>
        </div>

        {/* Projects list with transition */}
        {/* Projects list with scroll (max 5 visible at once) */}
        <div
          className={`transition-all duration-300 ease-in-out ${isProjectOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            } overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
        >
          {projects.map((project) => {
            const isSelected = project.projectId === selectedProjectId;
            return (
              <div
                key={project.projectId}
                className={`mb-2 shadow-sm rounded ${isSelected ? "bg-blue-400" : "bg-white"} transition`}
              >
                <div className="flex justify-between items-center px-3 py-2 rounded hover:bg-gray-100">
                  <button
                    onClick={() => onSelectProjectClick(project.projectId)}
                    className="text-left w-full font-medium text-gray-800 truncate"
                  >
                    {project.name}
                  </button>
                  <button
                    className="ml-2 px-1 py-1 hover:bg-gray-200 rounded text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(project.projectId);
                    }}
                  >
                    ⋮
                  </button>
                </div>

                {menuOpenId === project.projectId && (
                  <div className="pl-4 pb-2 text-sm text-gray-700 animate-fadeIn">
                    <button
                      className="block w-full text-left py-1 hover:bg-gray-100 rounded"
                      onClick={() => openAddMemberModal(project)}
                    >
                      ➕ Add Members
                    </button>
                    <button
                      className="block w-full text-left py-1 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDeleteProject(project.projectId)}
                    >
                      🗑 Delete Project
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>


        {/* Create project button */}
        <button
          onClick={onAddProject}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
        >
          Create Project
        </button>


      </div>
      {/* Add Members Modal */}
      {modalProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-xl mb-4">Add Members to {modalProject.name}</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="w-full mb-3 px-3 py-1 border rounded text-sm"
            />

            <div className="max-h-48 overflow-y-auto mb-4">
              {candidateMembers
                .filter((m) =>
                  m.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((m) => (
                  <label key={m.memberId} className="block mb-1">
                    <input
                      type="checkbox"
                      value={m.memberId}
                      onChange={(e) => {
                        const id = m.memberId;
                        setSelectedCandidates((prev) =>
                          e.target.checked
                            ? [...prev, id]
                            : prev.filter((x) => x !== id)
                        );
                      }}
                    />{" "}
                    {m.username}
                  </label>
                ))}

            </div>
            <div className="text-right space-x-2">
              <button onClick={() => setModalProject(null)} className="px-3 py-1">
                Cancel
              </button>
              <button
                onClick={handleUpdateMembers}
                disabled={selectedCandidates.length === 0}
                className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Update Members
              </button>
            </div>
          </div>
        </div>
      )}


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
