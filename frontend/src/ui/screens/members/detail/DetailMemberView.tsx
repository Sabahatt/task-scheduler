import ScreenHeader from "@/ui/components/ScreenHeader";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FC } from "react";

type Props = {
  loading: boolean;
  memberData: { memberName: string; availableHours: number };
  groupedTasks;
  handleViewDetail: (id: string) => void
};

const DetailMemberView: FC<Props> = ({ loading, memberData, groupedTasks, handleViewDetail }) => {
  if (loading || !memberData || !groupedTasks) {
    return <div className="container">Loading...</div>;
  }

  const statuses = ["Pending", "In Progress", "Completed"];

  return (
    <div className="container">
      <ScreenHeader
        title={memberData?.memberName}
        subHead1="Availability/day"
        subHead1Value={memberData?.availableHours}
      />
      <Box className=" mx-auto px-4">

        {/* Grid layout for statuses */}
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {statuses.map((status) => (
            <Box key={status}>
              <Typography variant="h6" gutterBottom>
                {status}
              </Typography>

              {groupedTasks[status]?.length ? (
                groupedTasks[status].map((task) => (
                  <Paper
                    key={task._id}
                    elevation={2}
                    className="p-4 mb-4 transition-shadow hover:shadow-md bg-white"
                  >
                    <span
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
                      onClick={() => handleViewDetail(task._id)}
                    >
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        className="hover:underline"
                      >
                        {task.title}
                      </Typography>
                    </span>
                    <Typography variant="body2" color="textSecondary">
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Paper
                  elevation={2}
                  className="p-4 mb-4 transition-shadow hover:shadow-md bg-white"
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontStyle="italic"
                  >
                    No tasks
                  </Typography>
                </Paper>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default DetailMemberView;
