import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Button } from '@mui/material';
import { BiSolidDockLeft } from "react-icons/bi";

const RightsidePanel = ({
    isSidebarOpen,
    closeSidebar,
    projectMembers,
    newNodeInput,
    setNewNodeInput,
    description,
    setDescription,
    handleCreateNode,
    saveGraph,
    handleDownload
}) => {
    return (
        <div
            className={`transition-all duration-500 fixed top-0 z-40 ${isSidebarOpen ? "right-0" : "-right-72"
                }`}
        >
            <div className="relative flex flex-col w-72 h-screen px-5 py-6 bg-white shadow-xl border-l border-gray-200 rounded-l-xl">
                {/* Close Button */}
                <button
                    onClick={closeSidebar}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                    <BiSolidDockLeft className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Node <span className="text-pink-500">Data</span>
                </h2>

                <hr className="mb-4 border-gray-200" />

                {/* Content Wrapper */}
                <div className="flex flex-col justify-between h-full space-y-0">
                    {/* Node Creation Form */}
                    <div className="space-y-4">
                        {/* Task */}
                        <TextField
                            label="Task"
                            variant="outlined"
                            fullWidth
                            size="small"
                            placeholder="Enter task title"
                            value={newNodeInput.task}
                            onChange={(e) =>
                                setNewNodeInput((prev) => ({
                                    ...prev,
                                    task: e.target.value,
                                }))
                            }
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: 2,
                            }}
                        />

                        {/* Description */}
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            minRows={2}
                            maxRows={5}
                            fullWidth
                            value={description}
                            placeholder="Optional notes..."
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: 2,
                            }}
                        />

                        {/* Assignee */}
                        <FormControl fullWidth size="small">
                            <InputLabel id="assignTo-label">Assign To</InputLabel>
                            <Select
                                labelId="assignTo-label"
                                value={newNodeInput.assignedTo}
                                label="Assign To"
                                onChange={(e) =>
                                    setNewNodeInput((prev) => ({
                                        ...prev,
                                        assignedTo: e.target.value,
                                    }))
                                }
                            >
                                {projectMembers.map((member) => (
                                    <MenuItem key={member.memberId} value={member.username}>
                                        {member.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Deadline */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Deadline"
                                value={new Date(newNodeInput.deadline)}
                                minDateTime={new Date()}
                                onChange={(newValue) =>
                                    setNewNodeInput((prev) => ({
                                        ...prev,
                                        deadline: newValue.toISOString(),
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth size="small" />
                                )}
                            />
                        </LocalizationProvider>

                        {/* Create Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                textTransform: "none",
                                bgcolor: "#3b82f6", // Tailwind blue-500
                                "&:hover": {
                                    bgcolor: "#2563eb", // Tailwind blue-600
                                },
                                borderRadius: 2,
                                py: 1.2,
                                fontWeight: 600,
                            }}
                            onClick={handleCreateNode}
                        >
                            Create Node
                        </Button>

                        {/* Save & Download Buttons */}
                        <div className="flex gap-3">
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                }}
                                onClick={saveGraph}
                            >
                                Save
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                }}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default RightsidePanel;