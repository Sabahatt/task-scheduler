// src/components/DataTable.tsx

import Paper from "@mui/material/Paper";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { FC } from "react";

type DataTableProps = {
  columns: GridColDef[];
  rows: GridRowsProp;
  pageSizeOptions?: number[];
  initialPagination?: GridPaginationModel;
  height?: number | string;
  loading?: boolean;
};

const DataTable: FC<DataTableProps> = ({
  columns,
  rows,
  pageSizeOptions = [5, 10],
  initialPagination = { page: 0, pageSize: 5 },
  height = 400,
  loading,
}) => {
  return (
    <Paper sx={{ height, width: "100%", justifyContent: "center" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: initialPagination } }}
        pageSizeOptions={pageSizeOptions}
        sx={{ border: 0 }}
        loading={loading}

      />
    </Paper>
  );
};

export default DataTable;
