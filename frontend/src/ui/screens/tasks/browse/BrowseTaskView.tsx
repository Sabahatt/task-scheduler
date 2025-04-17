import DataTable from "@/ui/components/DataTable";
import ScreenHeader from "@/ui/components/ScreenHeader";
import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ITask } from "@/models/types/Task";
import { GridColDef } from "@mui/x-data-grid";

type Props = {
  loading: boolean;
  rows: ITask[] | [];
  handleDelete: (id: string) => void
  handleCreate: () => void
  handleEdit: (id: string) => void
};

const BrowseTaskView: FC<Props> = ({ loading, rows, handleDelete, handleCreate, handleEdit }) => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "deadline",
      headerName: "Due Date",
      width: 200,
      valueGetter: (params) => {
        return params ? new Date(params).toLocaleDateString() : "";
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "estimatedHours",
      headerName: "Est. Hours",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      filterable: false,
      headerAlign: "center",

      renderCell: (params) => (
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
            // onClick={() => navigate(`/tasks/edit/${params.row.id}`)}
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
          <Button
            variant="text"
            size="small"
            // onClick={() => openAssignModal(params.row)}
            onClick={() => {
              console.log("first");
            }}
          >
            Assign
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
    <div className="container">
      <ScreenHeader title="Browse Tasks" btnTitle="Create Task" handleClick={handleCreate} />
      <DataTable rows={rows} columns={columns} loading={loading} />
    </div>
    </>
    
  );
};

export default BrowseTaskView;
