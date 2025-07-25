import type { File } from '../../@types/entities';

function toEntity(response: FileResponse): File {
  const file: File = {
    id: response.id,
    name: response.name,
    created_at: response.created_at,
    mime_type: response.mime_type,
  };
  return file;
}
export { toEntity };
