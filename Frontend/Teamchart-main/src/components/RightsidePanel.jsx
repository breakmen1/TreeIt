import React from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Button } from '@mui/material';
import { BiSolidDockLeft } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";

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
            className={`transition-all  duration-500  fixed top-0 ${isSidebarOpen ? "right-0" : "-right-64"
                }`}
        >
            <div className="relative flex flex-col w-64 h-screen min-h-screen px-4 py-8 overflow-y-auto bg-white border-r">
                <div className="">
                    <button
                        onClick={closeSidebar}
                        className="absolute flex items-center justify-center w-8 h-8 ml-6 text-gray-600 rounded-full top-1 right-1"
                    >
                        {/* <HiX className="w-5 h-5" /> */}
                        <BiSolidDockLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-700 ">
                        Node <span className="-ml-1 text-pink-500 ">Data</span>
                    </h2>
                </div>
                <hr className="my-0 mt-[0.20rem]" />
                <div className="flex flex-col justify-between flex-1 mt-3">
                    <div className="flex flex-col justify-start space-y-5 h-[calc(100vh-135px)]">
                        {/* Create Node Section */}
                        <div className="flex flex-col space-y-3 ">
                            <div className="flex flex-col space-y-3">
                                {/* Task Input */}
                                <TextField
                                    label="Task"
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={(e) =>
                                        setNewNodeInput((prev) => ({
                                            ...prev,
                                            task: e.target.value,
                                        }))
                                    }
                                    value={newNodeInput.task}
                                />

                                {/* Description input */}
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    minRows={2}
                                    maxRows={6}
                                    fullWidth
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                                {/* Assigned To Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="assignTo-label">Assign To</InputLabel>
                                    <Select
                                        labelId="assignTo-label"
                                        id="assignTo"
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


                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none', // disables uppercase
                                    }}
                                    onClick={handleCreateNode}
                                >
                                    Create Node
                                </Button>
                            </div>
                        </div>
                        {/* Save and Restore Buttons */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-row space-x-3">
                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none', // disables uppercase
                                    }}
                                    onClick={saveGraph}
                                >
                                    Save
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none', // disables uppercase
                                    }}
                                    onClick={handleDownload}
                                >
                                    Download{" "}
                                </Button>
                            </div>
                        </div>

                        <hr className="my-0" />
                        <div className="flex justify-center px-4 pb-2 mt-auto -mx-4 bottom-3">
                            <h4 className=" text-[12px] font-semibold text-gray-600 ">
                                {/* Made with <FaHeart className="inline-block " /> by{" "} */}
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href=""
                                    className="cursor-pointer hover:underline hover:text-blue-500"
                                >
                                    {/* Akash. */}
                                </a>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default RightsidePanel;