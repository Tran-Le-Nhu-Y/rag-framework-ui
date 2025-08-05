import React from 'react';
import { Box, Typography, Stack, Divider, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FileConfigGuide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        {/* Title */}
        <Stack alignItems="center">
          <Typography variant="h4" gutterBottom textAlign="center">
            📁 {t('configFileInstructionTitle')}
          </Typography>
        </Stack>

        <Divider />

        {/* Giới thiệu */}
        <Typography variant="body1" textAlign="justify">
          🔧 Để định nghĩa các lớp (labels) cho mô hình nhận diện ảnh, bạn cần
          tạo một file <strong>config định dạng JSON</strong> với cấu trúc như
          sau:
        </Typography>

        {/* JSON cấu trúc mẫu */}
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            padding: 2,
            borderRadius: 1,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          }}
        >
          {`[
  {
    "name": "Tên lớp 1",
    "description": "Mô tả lớp 1"
  },
  {
    "name": "Tên lớp 2",
    "description": "Mô tả lớp 2"
  }
]`}
        </Box>

        {/* Giải thích */}
        <Typography variant="h6" fontWeight="bold">
          📝 Giải thích các trường:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography>
              <strong>"name"</strong>: Tên của lớp (label) dùng để phân loại
              ảnh.
            </Typography>
          </li>
          <li>
            <Typography>
              <strong>"description"</strong>: Mô tả chi tiết về lớp đó, ví dụ
              dấu hiệu bệnh, đặc điểm hình ảnh,...
            </Typography>
          </li>
        </Box>

        <Divider />

        {/* Ví dụ */}
        <Typography variant="h6" fontWeight="bold">
          ✅ Ví dụ thực tế:
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f0f0ff',
            padding: 2,
            borderRadius: 1,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          }}
        >
          {`[
  {
    "name": "Product",
    "description": "Represents a retail product with attributes like price, inventory, and category. Used for e-commerce applications."
  },
  {
    "name": "CustomerReview",
    "description": "Contains feedback and ratings submitted by customers for products or services. Includes text and star ratings."
  },
  {
    "name": "BlogPost",
    "description": "Defines a single entry in a blog, including its title, content, author, and publication date. Used for content management systems."
  }
]`}
        </Box>

        {/* Ghi chú */}
        <Typography
          variant="body1"
          fontStyle="italic"
          textAlign="justify"
          color="text.secondary"
        >
          📌 File cần được lưu với định dạng <strong>.json</strong> hoặc{' '}
          <strong>.txt</strong> và được tải lên hệ thống khi tạo mô hình.
        </Typography>
      </Stack>
    </Container>
  );
};

export default FileConfigGuide;
