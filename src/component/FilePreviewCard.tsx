import { Paper, Typography, Box, IconButton } from '@mui/material';
import { AttachFile, Download, Close } from '@mui/icons-material';
import type { File } from '../@types/entities';

export function FilePreviewCard({
  file,
  onDownload,
  onDelete,
}: {
  file: File;
  onDownload?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        px: 1.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: 2,
        minWidth: 180,
        maxWidth: 300,
        position: 'relative',
        bgcolor: '#f9f9f9',
      }}
    >
      <AttachFile color="primary" fontSize="small" />

      <Box flexGrow={1} overflow="hidden">
        <Typography variant="body2" fontWeight="bold" noWrap>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {(file.mime_type || '') +
            ' - ' +
            (file.created_at
              ? new Date(file.created_at).toLocaleString()
              : 'N/A')}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        {onDownload && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            sx={{ color: 'primary.main' }}
          >
            <Download fontSize="small" />
          </IconButton>
        )}

        {onDelete && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
