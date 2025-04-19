import DataTable from "@/ui/components/DataTable";
import ScreenHeader from "@/ui/components/ScreenHeader";
import { FC } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import { IMember } from "@/models/types/Member";
import { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

type Props = {
  loading: boolean;
  rows: IMember[] | [];
  handleDelete: (id: string) => void
  handleCreate: () => void
  handleEdit: (id: string) => void
  handleViewDetail: (id: string) => void
};

const BrowseMemberView: FC<Props> = ({ loading, rows, handleCreate, handleDelete, handleEdit, handleViewDetail }) => {
  const columns: GridColDef[] = [
    {
      field: "memberName",
      headerName: "Member",
      width: 330,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => handleViewDetail(params.row.id)}
        >
          {params.value}
        </span>
      )
    },
    {
      field: "availableHours",
      headerName: "Available Hours",
      width: 330,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taskCount",
      headerName: "Tasks Assigned",
      width: 330,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 330,
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
        </Box>
      ),
    },
  ];

  return (
    <>
    <div className="container">
      <ScreenHeader title="Browse Members" btnTitle="Create Member" handleClick={handleCreate} />
      <DataTable rows={rows} columns={columns} loading={loading} />
    </div>
    </>
    
  );
};

export default BrowseMemberView;
