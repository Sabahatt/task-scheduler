import DataTable from "@/ui/components/DataTable";
import ScreenHeader from "@/ui/components/ScreenHeader";
import { Dispatch, FC, SetStateAction } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ITask } from "@/models/types/Task";
import { GridColDef } from "@mui/x-data-grid";
import AssignModal from "@/ui/components/AssignmentModal";

type Props = {
  loading: boolean;
  rows: ITask[] | [];
  handleDelete: (id: string) => void;
  handleCreate: () => void;
  handleEdit: (id: string) => void;
  handleViewDetail: (id: string) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  handleUnassign: (id: string) => void
};

const BrowseTaskView: FC<Props> = ({
  loading,
  rows,
  handleDelete,
  handleCreate,
  handleEdit,
  handleViewDetail,
  open,
  setOpen,
  handleUnassign
}) => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => handleViewDetail(params.row.id)}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "deadline",
      headerName: "Due Date",
      width: 150,
      valueGetter: (params) => {
        return params ? new Date(params).toLocaleDateString() : "";
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "estimatedHours",
      headerName: "Est. Hours",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value?.memberName || "Unassigned",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      filterable: false,
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <Box
            display="flex"
            gap={1}
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
            {params.row.assignedTo ? (
              <Button
                variant="text"
                size="small"
                color="warning"
                sx={{ minWidth: 80 }}
                onClick={() => handleUnassign(params.row._id)}
              >
                Unassign
              </Button>
            ) : (
              <Button
                variant="text"
                size="small"
                sx={{ minWidth: 80 }}
                onClick={() => setOpen(true)} 
              >
                Assign
              </Button>
            )}
            {open && (
              <AssignModal
                open={open}
                onClose={() => setOpen(false)}
                taskId={params.row.id}
              />
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <div className="container">
        <ScreenHeader
          title="Browse Tasks"
          btnTitle="Create Task"
          handleClick={handleCreate}
        />
        <DataTable rows={rows} columns={columns} loading={loading} />
      </div>
    </>
  );
};

export default BrowseTaskView;
