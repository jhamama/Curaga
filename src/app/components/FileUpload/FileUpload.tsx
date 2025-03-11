"use client";

import { useUploadFile } from "@/app/utils/hooks/useUploadFile";

const FileUpload = ({ preSignUploadUrl }: { preSignUploadUrl: string }) => {
  const {
    uploadFile,
    progress,
    isUploading,
    isError,
    isComplete,
    uploadedUrl,
    error,
  } = useUploadFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      uploadFile({ file, url: preSignUploadUrl });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <div>Uploading: {progress}%</div>}
      {isError && <div>Error uploading file: {error?.message}</div>}
      {isComplete && uploadedUrl && (
        <div>
          Upload complete. File available at: <a href={uploadedUrl}>here</a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
