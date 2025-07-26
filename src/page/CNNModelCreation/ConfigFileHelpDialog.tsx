import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConfigFileHelpDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('configFileInstructionTitle') || 'Hướng dẫn ghi file config'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <>
            Cấu trúc file <strong>config</strong> cần có định dạng sau:
            <pre
              style={{
                background: '#f5f5f5',
                padding: '10px',
                marginTop: '10px',
              }}
            >
              {`{
  "classes": [
    {
      "name": "Tên lớp 1",
      "description": "Mô tả lớp 1"
    },
    {
      "name": "Tên lớp 2",
      "description": "Mô tả lớp 2"
    }
  ]
}`}
            </pre>
            <Typography variant="body2" mt={2}>
              🔹 <strong>"name"</strong>: Tên nhãn (label) của lớp mô hình nhận
              diện.
              <br />
              🔹 <strong>"description"</strong>: Mô tả chi tiết về lớp đó, ví dụ
              biểu hiện của bệnh hoặc đặc điểm nhận dạng.
            </Typography>
          </>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
