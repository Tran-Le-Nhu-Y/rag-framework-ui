import { Box, Divider, Stack, Typography } from '@mui/material';

const ImageWithDescription = ({
  title,
  instructions,
  imageSrc,
  imageAlt,
}: {
  title: string;
  instructions: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}) => (
  <Stack spacing={2} width="100%">
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
    <Box
      pl={5}
      display="flex"
      gap={2}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
    >
      <Stack spacing={2} flex={1} minWidth="300px">
        {instructions}
      </Stack>
      <Stack flex={1} minWidth="300px" alignItems="center">
        <Typography>📷 Hình minh họa:</Typography>
        <img src={imageSrc} alt={imageAlt} width="100%" />
      </Stack>
    </Box>
  </Stack>
);

const AgentCreationGuide: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Stack alignItems="center">
        <Typography variant="h4" gutterBottom>
          🧠 Hướng dẫn tạo cấu hình AI Agent
        </Typography>
      </Stack>
      <Divider />

      {/* Bắt buộc phải có */}
      <Typography paragraph>
        ✅ <strong>Bắt buộc phải có:</strong> Để tạo một AI Agent, bạn phải tạo
        trước 2 cấu hình:
      </Typography>
      <ul>
        <li>📝 Prompt</li>
        <li>🤖 Chat Model</li>
      </ul>
      <Divider />

      {/* Step 1 */}
      <ImageWithDescription
        title="📝 Bước 1: Tạo cấu hình Prompt"
        instructions={
          <>
            <Typography>➡ Vào trang “Quản lý cấu hình Prompt”.</Typography>
            <Typography>➡ Chọn “Tạo cấu hình Prompt”.</Typography>
            <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
            <ul>
              <li>Tên Prompt</li>
              <li>Nội dung Prompt</li>
            </ul>
          </>
        }
        imageSrc="/images/Create_Prompt.png"
        imageAlt="Tạo cấu hình Prompt"
      />
      <Divider />

      {/* Step 2 */}
      <ImageWithDescription
        title="🤖 Bước 2: Tạo cấu hình Chat Model"
        instructions={
          <>
            <Typography>➡ Vào trang “Quản lý cấu hình Chat Model”.</Typography>
            <Typography>➡ Chọn “Tạo cấu hình Chat Model".</Typography>
            <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
            <ul>
              <li>Tên cấu hình & Tên mô hình</li>
              <li>Loại mô hình (ví dụ: Google Gen AI)</li>
              <li>Các thông số kỹ thuật: Top K, Top P, Temperature,...</li>
              <li>Cài đặt an toàn (tuỳ chọn): chọn danh mục và cấp độ.</li>
            </ul>
          </>
        }
        imageSrc="public\images\Create_Chat_Model_Google_Gen_AI.png"
        imageAlt="Tạo cấu hình Chat Model"
      />
      <Divider />

      {/* Step 3 */}
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight="bold">
          🧩 Bước 3: (Tùy chọn) Tạo các cấu hình khác
        </Typography>
        <Typography>
          Bạn có thể tạo thêm các cấu hình sau nếu muốn sử dụng chúng trong AI
          Agent:
        </Typography>

        {/* CNN Model */}
        <ImageWithDescription
          title="🧠 CNN Model (Mô hình nhận diện ảnh)"
          instructions={
            <>
              <Typography>➡ Vào trang “Quản lý cấu hình CNN Model”.</Typography>
              <Typography>➡ Chọn “Tạo cấu hình CNN Model".</Typography>
              <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
              <ul>
                <li>Tên cấu hình</li>
                <li>Tải lên tập tin mô hình nhận diện</li>
                <li>Mô tả các lớp đầu ra của mô hình</li>
                <li>
                  Cấu hình tiền xử lý ảnh (tùy chọn): Resize, Pad, Grayscale
                </li>
              </ul>
            </>
          }
          imageSrc="public\images\Create_CNN_Model.png"
          imageAlt="CNN Model"
        />

        {/* MCP */}
        <ImageWithDescription
          title="🌐 MCP Model"
          instructions={
            <>
              <Typography>➡ Vào trang “Quản lý cấu hình MCP”.</Typography>
              <Typography>➡ Chọn “Tạo cấu hình MCP".</Typography>
              <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
              <ul>
                <li>Tên cấu hình MCP</li>
                <li>Kiểu kết nối, URL, Timeout,...</li>
                <li>Headers (tùy chọn)</li>
              </ul>
            </>
          }
          imageSrc="public\images\Create_MCP.png"
          imageAlt="MCP"
        />
        {/* Retriever - Vector Store */}
        <ImageWithDescription
          title="📦 Retriever: Vector Store"
          instructions={
            <>
              <Typography>
                ➡ Vào trang “Quản lý cấu hình Vector Store".
              </Typography>
              <Typography>➡ Chọn “Tạo cấu hình Vector Store".</Typography>
              <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
              <ul>
                <li>Tên cấu hình Vector Store</li>
                <li>Embedding model</li>
                <li>Chế độ, Trọng số, Collection Name,...</li>
              </ul>
            </>
          }
          imageSrc="public\images\Create_Vector_Store_Persistent.png"
          imageAlt="Vector Store Retriever"
        />

        {/* Retriever - BM25 */}
        <ImageWithDescription
          title="📦 Retriever: BM25"
          instructions={
            <>
              <Typography>➡ Vào trang “Quản lý cấu hình BM25".</Typography>
              <Typography>➡ Chọn “Tạo cấu hình BM25".</Typography>
              <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
              <ul>
                <li>Tên cấu hình BM25</li>
                <li>Embedding model</li>
                <li>Trọng số, các tùy chọn khác,...</li>
              </ul>
            </>
          }
          imageSrc="public\images\Create_BM25.png"
          imageAlt="BM25 Retriever"
        />

        {/* Search Tool */}
        <ImageWithDescription
          title="🔎 Search Tool"
          instructions={
            <>
              <Typography>
                ➡ Vào trang “Quản lý cấu hình Search Tool".
              </Typography>
              <Typography>➡ Chọn “Tạo cấu hình".</Typography>
              <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
              <ul>
                <li>Tên cấu hình</li>
                <li>Loại Search Tool</li>
                <li>Số kết quả tối đa</li>
              </ul>
            </>
          }
          imageSrc="public\images\Create_Search_Tool.png"
          imageAlt="Search Tool"
        />
      </Stack>
      <Divider />

      {/* Step 4 */}
      <ImageWithDescription
        title="🎯 Bước 4: Tạo AI Agent"
        instructions={
          <>
            <Typography>➡ Vào trang “Quản lý cấu hình AI Agent".</Typography>
            <Typography>➡ Chọn “Tạo cấu hình AI Agent”.</Typography>
            <Typography>📌 Cần cung cấp các thông tin sau:</Typography>
            <ul>
              <li>Tên AI Agent</li>
              <li>Chọn ngôn ngữ</li>
              <li>Mô tả AI Agent</li>
              <li>Chọn các cấu hình đã tạo ở các bước trên</li>
            </ul>
          </>
        }
        imageSrc="public\images\Create_AI_Agent.png"
        imageAlt="Tạo AI Agent"
      />
      <Divider />
      {/* Note */}
      <Stack>
        <Typography paragraph>
          📌 <strong>Ghi chú:</strong>
          <br />
          Prompt và Chat Model là <strong>bắt buộc</strong>.<br />
          Các thành phần như CNN Model, MCP, Retriever, Search Tool là{' '}
          <strong>tuỳ chọn</strong>.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AgentCreationGuide;
