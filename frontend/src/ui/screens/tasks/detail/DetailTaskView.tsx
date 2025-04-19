import { ITask } from "@/models/types/Task";
import ScreenHeader from "@/ui/components/ScreenHeader";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React, { FC } from "react";

type Props = {
  loading: boolean;
  taskData: ITask;
  handleStatusUpdate: (event: SelectChangeEvent) => void;
};

const DetailTaskView: FC<Props> = ({
  loading,
  taskData,
  handleStatusUpdate,
}) => {
  if (loading || !taskData) {
    return <div className="container">Loading...</div>;
  }

  const statusOptions = ["Pending", "In Progress", "Completed"];

  return (
    <div className="container">
      <ScreenHeader
        title={taskData.title}
        subHead1="Estimated Duration"
        subHead1Value={taskData.estimatedHours}
        subHead2="Deadline"
        subHead2Value={new Date(taskData.deadline).toLocaleDateString()}
      />
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Paper elevation={2} className="p-4 lg:col-span-2">
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{taskData.description || ""}</Typography>
        </Paper>

        {/* Sidebar Info */}
        <Paper elevation={2} className="p-4 space-y-4">
          {/* Status (editable) */}
          <Box>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className="mb-1"
            >
              Status
            </Typography>
            <Select
              fullWidth
              value={taskData.status}
              onChange={handleStatusUpdate}
              variant="outlined"
              size="small"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Priority */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Priority
            </Typography>
            <Typography variant="body1">{taskData.priority}</Typography>
          </Box>

          {/* Assigned To */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Assigned To
            </Typography>
            <Typography variant="body1">
              {taskData?.assignedTo?.memberName || "Unassigned"}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default DetailTaskView;
