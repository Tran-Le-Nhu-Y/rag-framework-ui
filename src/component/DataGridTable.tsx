import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';

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
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
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
