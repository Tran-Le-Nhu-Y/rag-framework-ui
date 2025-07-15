import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';

interface DataGridTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: number;
  pageSize?: number;
}

const DataGridTable: React.FC<DataGridTableProps> = ({
  rows,
  columns,
  height = 480,
  pageSize = 7,
}) => {
  return (
    <Box sx={{ height: height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            fontWeight: 'bold',
            fontSize: '16px',
          },
        }}
      />
    </Box>
  );
};

export default DataGridTable;
