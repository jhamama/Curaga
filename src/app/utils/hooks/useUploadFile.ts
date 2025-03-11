import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface UploadFileData {
  file: File;
  url: string;
}

interface UploadFileHook {
  uploadFile: (fileData: UploadFileData) => void;
  progress: number;
  isUploading: boolean;
  isError: boolean;
  isComplete: boolean;
  uploadedUrl: string | null;
  error: Error | null;
}

export const useUploadFile = (): UploadFileHook => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { mutate: uploadFile, isLoading: isUploading } = useMutation<
    void,
    Error,
    UploadFileData
  >(
    async ({ file, url }) => {
      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(Math.round(percentComplete));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
            setUploadedUrl(new URL(url).href.split("?")[0]); // Set the URL upon successful upload
            setIsComplete(true); // Mark the upload as complete
          } else {
            reject(new Error("Upload failed"));
            setIsComplete(false);
          }
        };
        xhr.onerror = () => {
          reject(new Error("XHR request failed"));
          setIsComplete(false);
        };
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    {
      onMutate: () => {
        setIsComplete(false); // Reset completion state before starting a new upload
        setUploadedUrl(null); // Reset the uploaded URL
      },
      onError: (error) => {
        setError(error);
        setProgress(0);
      },
      // Optionally reset states on success if needed here
    },
  );

  return {
    uploadFile,
    progress,
    isUploading,
    isError: !!error,
    isComplete,
    uploadedUrl,
    error,
  };
};
