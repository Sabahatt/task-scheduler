import {
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TaskIcon from "@mui/icons-material/Task";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Schedule";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { FC } from "react";
import { TimelineView } from "@/ui/components/Timeline";
import { ITask } from "@/models/types/Task";
import { ISummary } from "@/models/types/Summary";

type Props = {
  data: ISummary;
  loading: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  modalTitle: string;
  tasksToShow: ITask[];
  handleRowClick: (params) => void;
  openModal: (title: string, tasks: ITask[]) => void;
  handleBtnClick: () => void
};

const priorityColorMap: Record<string, string> = {
  High: "#d32f2f",
  Medium: "#fbc02d",
  Low: "#388e3c",
};

const DashboardView: FC<Props> = ({
  data,
  loading,
  setOpen,
  open,
  modalTitle,
  tasksToShow,
  handleRowClick,
  openModal,
  handleBtnClick
}) => {
  if (loading || !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: "Total Tasks",
      count: data.totalTasks,
      icon: <TaskIcon color="primary" />,
      tasks: [
        ...data.pendingTasks,
        ...data.inProgressTasks,
        ...data.completedTasks,
        ...data.overdueTasks,
      ],
    },
    {
      title: "Pending",
      count: data.pendingCount,
      icon: <PendingIcon color="warning" />,
      tasks: data.pendingTasks,
    },
    {
      title: "In Progress",
      count: data.inProgressCount,
      icon: <TaskIcon color="info" />,
      tasks: data.inProgressTasks,
    },
    {
      title: "Completed",
      count: data.completedCount,
      icon: <CheckCircleIcon color="success" />,
      tasks: data.completedTasks,
    },
    {
      title: "Due Soon",
      count: data.dueSoonCount,
      icon: <WarningIcon color="secondary" />,
      tasks: data.dueSoonTasks,
    },
    {
      title: "Overdue",
      count: data.overdueCount,
      icon: <WarningIcon color="error" />,
      tasks: data.overdueTasks,
    },
  ];

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: priorityColorMap[params.value] || "#e0e0e0",
            color: "white",
          }}
        />
      ),
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" gutterBottom>
          Task Summary
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleBtnClick}
        >
          Create New Task
        </Button>
      </div>
      <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
        {statCards.map((card) => (
          <Card
            key={card.title}
            onClick={() => openModal(card.title, card.tasks)}
            sx={{
              minWidth: 180,
              flex: "1 1 250px",
              cursor: "pointer",
              borderLeft: "5px solid",
              transition: "0.3s",
              "&:hover": {
                boxShadow: 4,
              },
              borderColor: "lightGray",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {card.count}
              </Typography>
              <Box>{card.icon}</Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            overflowY: "auto",
            cursor: "pointer",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {modalTitle} Tasks
          </Typography>

          {tasksToShow.length === 0 ? (
            <Typography>No tasks available.</Typography>
          ) : (
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={tasksToShow.map((t) => ({ ...t, id: t._id }))}
                columns={columns}
                pageSizeOptions={[5, 10]}
                onRowClick={handleRowClick}
              />
            </Box>
          )}
        </Box>
      </Modal>
      <TimelineView />
    </Container>
  );
};
export default DashboardView;
